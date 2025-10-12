// server.js
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
// import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import path from 'path';
import { Issuer, generators } from 'openid-client';

// Firebase removed: using AWS Cognito for authentication instead
import authRoutes from './routes/auth.js';
import wishlistRoutes from './routes/wishlist.js';
import userRoutes from './routes/user.js'; // ✅ Add this line
import productRoutes from './routes/product.js';
import cartRoutes from "./routes/cart.js";
import shiprocketRoutes from './routes/shiprocket.js'; // ✅ Import Shiprocket routes
import paymentRoutes from './routes/payment.js'; // ✅ Import payment routes
import shiprocketTokenRouter  from './routes/shiprockettoken.js'; // ✅ Import Shiprocket token route
import orderRoutes from './routes/order.js'; // ✅ Import order routes
import searchRouter from './routes/search.js'; // ✅ Import search route

// dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// const cors = require("cors");

const allowedOrigins = [
  "http://localhost:3000",
  "https://www.snatchers.in"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (curl, server-side), localhost origins, and file:// during local dev.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (process.env.NODE_ENV !== 'production') {
        // permit localhost variants and file scheme while developing locally
        try {
          if (origin.startsWith('file://') || origin.includes('localhost')) return callback(null, true);
        } catch (e) {
          // fallthrough to deny
        }
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true, // if you're using cookies or auth headers
  })
);

app.use(express.json());

// Session middleware (required for OIDC flow state/nonce storage)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'some secret',
    resave: false,
    saveUninitialized: false,
    // For local development we need to allow non-secure cookies so the browser will accept them on http://localhost.
    // In production this will use secure cookies.
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
    },
  })
);

// View engine for simple demo pages
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'ejs');

// OpenID Connect / Cognito client init
let oidcClient;
// In-memory temporary token store for callback -> SPA handshake
const tempAuthTokens = new Map(); // token => { userInfo, tokenSet, expires }
async function initOidc() {
  try {
    const issuer = await Issuer.discover(
      `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`
    );
    oidcClient = new issuer.Client({
      client_id: process.env.COGNITO_CLIENT_ID,
      client_secret: process.env.COGNITO_CLIENT_SECRET,
      redirect_uris: [process.env.COGNITO_REDIRECT_URI || 'https://d84l1y8p4kdic.cloudfront.net'],
      response_types: ['code'],
    });
    console.log('✅ OIDC client initialized');
  } catch (err) {
    console.error('❌ Failed to initialize OIDC client', err);
  }
}
initOidc();

// Simple auth checker middleware for demo pages
const checkAuth = (req, res, next) => {
  if (!req.session.userInfo) {
    req.isAuthenticated = false;
  } else {
    req.isAuthenticated = true;
  }
  next();
};

// Routes
app.use('/api', authRoutes);              // 🔑 Login (POST /api/auth/google)

// Session-first user endpoint: if the SPA has an HTTP-only session cookie,
// return the session user. This must be defined before mounting the token-
// protected `userRoutes` so cookie-based requests don't get intercepted
// by the JWT `verifyToken` middleware.
app.get('/api/user/me', (req, res) => {
  if (!req.session || !req.session.userInfo) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  return res.json({ user: req.session.userInfo });
});

app.use('/api/user', userRoutes);              // 👤 User routes (POST /api/user, GET /api/user/me)
app.use('/api/wishlist', wishlistRoutes); // 🛒 Wishlist protected routes
app.use("/api/products", productRoutes); // productRoutes imported correctly
app.use("/api/cart", cartRoutes); // 🛒 Cart protected routes
app.use('/api/shiprocket', shiprocketRoutes); // 🛳️ Shiprocket routes
app.use('/api/payment', paymentRoutes); // 💳 Payment routes
app.use('/api/orders', orderRoutes); // 📦 Order routes
app.use('/api/shiprocket-orders', shiprocketTokenRouter); // 🛳️ Shiprocket token route
app.use('/search', searchRouter);


// Root
app.get('/', checkAuth, (req, res) => {
  // Render a minimal home page that shows login state
  res.render('home', {
    isAuthenticated: req.isAuthenticated,
    userInfo: req.session.userInfo,
  });
});

// OIDC login route - redirect to Cognito hosted login page
app.get('/login', (req, res) => {
  if (!oidcClient) return res.status(503).send('OIDC client not initialized');
  const nonce = generators.nonce();
  const state = generators.state();
  req.session.nonce = nonce;
  req.session.state = state;
  // Use the exact redirect URI from env to avoid redirect_mismatch errors
  const redirectUri = process.env.COGNITO_REDIRECT_URI || 'http://localhost:5000/callback';
  console.log('[OIDC] /login requested — using redirectUri:', redirectUri);
  const authUrl = oidcClient.authorizationUrl({
    scope: 'openid email phone',
    state,
    nonce,
    redirect_uri: redirectUri,
  });
  // Log auth URL partially (avoid printing secrets)
  console.log('[OIDC] redirecting to Cognito auth URL (partial):', authUrl.replace(/(redirect_uri=)[^&]*/,'$1REDACTED'));
  res.redirect(authUrl);
});

// Demo auth endpoints for local testing
if (process.env.DEMO_AUTH === 'true' || process.env.NODE_ENV !== 'production') {
  // Simple demo login: accepts { email, name } and creates a session for testing
  app.post('/demo/login', express.json(), (req, res) => {
    const { email, name } = req.body || {};
    if (!email) return res.status(400).json({ error: 'email required for demo login' });
    const demoUser = {
      email,
      name: name || email.split('@')[0],
      uid: `demo_${Date.now()}`,
      picture: '',
    };
    req.session.userInfo = demoUser;
    return res.json({ user: demoUser });
  });

  app.get('/demo/logout', (req, res) => {
    req.session.destroy(() => {});
    res.json({ ok: true });
  });
}

// Callback route - Cognito will redirect back here after auth
app.get('/callback', async (req, res) => {
  try {
    if (!oidcClient) throw new Error('OIDC client not initialized');
    const params = oidcClient.callbackParams(req);
    const tokenSet = await oidcClient.callback(
      process.env.COGNITO_REDIRECT_URI || 'http://localhost:5000/callback',
      params,
      { nonce: req.session.nonce, state: req.session.state }
    );
    const userInfo = await oidcClient.userinfo(tokenSet.access_token);
    // Create a temporary one-time token that the SPA will claim to establish the session
    const tempToken = (globalThis.crypto && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
    // Increase TTL to 5 minutes for more reliable local/dev flows
    const expires = Date.now() + 1000 * 60 * 5; // 5 minutes
    tempAuthTokens.set(tempToken, { userInfo, tokenSet, expires });
    // Dev-only debug log so we can trace token creation and expiry
    try {
      console.log(`[OIDC] Created temp auth token: ${tempToken} (expires=${new Date(expires).toISOString()})`);
    } catch (e) {
      // ignore logging errors
    }
    // After successful login, redirect back to the SPA with the temp token
    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontend}/auth/success?token=${tempToken}`);
  } catch (err) {
    console.error('Callback error:', err?.message || err);
    // If the error indicates a redirect mismatch, explain and stop
    if (err && (err.message || '').toLowerCase().includes('redirect_mismatch')) {
      return res.status(400).send('<h1>Redirect mismatch</h1><p>The redirect URI used by this application does not match the one configured in Cognito. Please ensure <code>COGNITO_REDIRECT_URI</code> is registered in the Cognito app client settings and that it exactly matches (including protocol).</p>');
    }
    res.redirect('/');
  }
});

// Endpoint the SPA will call to claim the temp token and create a server session (sets cookie)
app.post('/auth/claim', async (req, res) => {
  try {
    const { token } = req.body || {};
    if (!token) return res.status(400).json({ error: 'No token provided' });
    const entry = tempAuthTokens.get(token);
    // Add debug logging to help diagnose why a token might be missing/expired
    console.log(`[AuthClaim] claim attempt for token=${token} found=${!!entry}`);
    if (!entry) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    console.log(`[AuthClaim] token expires=${new Date(entry.expires).toISOString()} now=${new Date().toISOString()} consumed=${!!entry.consumed}`);
    if (entry.expires < Date.now()) {
      tempAuthTokens.delete(token);
      console.log(`[AuthClaim] token expired and removed: ${token}`);
      return res.status(400).json({ error: 'Token expired' });
    }

    // If token was already consumed recently, allow repeated claims for a short window
    if (entry.consumed) {
      console.log(`[AuthClaim] token already consumed but still valid: ${token}`);
      return res.json({ user: entry.userInfo });
    }

    // Establish session and mark token consumed for a short grace period to avoid race conditions
    req.session.userInfo = entry.userInfo;
    req.session.tokenSet = entry.tokenSet;
    entry.consumed = true;
    // allow repeated claims for 30 seconds after first consumption
    entry.expires = Date.now() + 1000 * 30;
    tempAuthTokens.set(token, entry);
    console.log(`[AuthClaim] token consumed and session established for token: ${token}`);
    return res.json({ user: req.session.userInfo });
  } catch (err) {
    console.error('Auth claim error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Dev-only debug route: list current temp auth tokens and their expiry timestamps
app.get('/debug/tokens', (req, res) => {
  try {
    const out = [];
    for (const [key, val] of tempAuthTokens.entries()) {
      out.push({ token: key, expires: new Date(val.expires).toISOString() });
    }
    return res.json({ tokens: out });
  } catch (err) {
    return res.status(500).json({ error: 'server error' });
  }
});

// Logout route - destroy session and redirect to Cognito logout
app.get('/logout', (req, res) => {
  const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
  req.session.destroy(() => {});
  // Redirect user to Cognito logout endpoint so they are logged out from Cognito as well
  const logoutUri = process.env.COGNITO_LOGOUT_URI || frontend;
  const logoutEndpoint = oidcClient?.issuer?.metadata?.end_session_endpoint;
  if (logoutEndpoint) {
    const logoutUrl = `${logoutEndpoint}?client_id=${process.env.COGNITO_CLIENT_ID}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
    return res.redirect(logoutUrl);
  }
  // Fallback: redirect to frontend
  res.redirect(frontend);
});

// Note: /api/user/me is now handled earlier as a session-first endpoint.

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
