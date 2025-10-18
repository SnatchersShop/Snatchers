// server.js
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

// If MONGO_URI is not provided in the regular .env, try the repository deploy example
// This helps local dev when envs are stored in deploy/snatchers-backend.env
try {
  if (!process.env.MONGO_URI) {
    const fallbackPath = path.resolve(process.cwd(), '../../deploy/snatchers-backend.env');
    if (fs.existsSync(fallbackPath)) {
      console.log(`Loading fallback env file: ${fallbackPath}`);
      dotenv.config({ path: fallbackPath });
    }
  }
} catch (e) {
  // ignore
}
import express from 'express';
import cookie from 'cookie';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
// import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
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

// If running behind a reverse proxy (nginx) we must trust the first proxy so
// express-session can correctly detect secure requests and use the X-Forwarded-* headers.
// This is required when TLS is terminated at nginx and Express sees plain HTTP.
app.set('trust proxy', 1);

// Middleware
//const cors = require("cors");

const allowedOrigins = [
  "http://localhost:3000",
  "https://snatchers.in",
  "https://www.snatchers.in",
  "https://snatchers.in",

  // Allow plain HTTP during initial testing/deployment (frontend currently served over HTTP)
  "https://snatchers.in",
  "http://snatchers.in",
  "http://www.snatchers.in"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (curl, server-side), localhost origins, and file:// during local dev.
      try {
        // Debug log to help diagnose CORS issues in production
        console.debug('[CORS] Incoming Origin:', origin);
      } catch (e) {}
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        try { console.debug('[CORS] Allowed origin:', origin); } catch (e) {}
        return callback(null, true);
      }
      if (process.env.NODE_ENV !== 'production') {
        // permit localhost variants and file scheme while developing locally
        try {
          if (origin && (origin.startsWith('file://') || origin.includes('localhost'))) {
            try { console.debug('[CORS] Allowed localhost/file origin:', origin); } catch (e) {}
            return callback(null, true);
          }
        } catch (e) {
          // fallthrough to deny
        }
      }
      try { console.debug('[CORS] Rejected origin:', origin); } catch (e) {}
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true, // if you're using cookies or auth headers
  })
);

app.use(express.json());

// Debug helper: when enabled, set permissive CORS headers so browser shows server errors
// Usage: set DEBUG_ALLOW_ALL_CORS=true in env during debugging, then remove/disable afterward.
if (process.env.DEBUG_ALLOW_ALL_CORS === 'true') {
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });
}

// Ensure we don't enable cross-origin isolation by default.
// Some deploy configurations or proxies may add COEP/COOP headers which
// cause third-party resources (Cloudinary, Razorpay) to be blocked by the
// browser. Force permissive values here so the SPA can load external scripts
// and images without requiring special CORP/CORS server headers on third-party hosts.
app.use((req, res, next) => {
  try {
    // Allow embedding/requests from other origins (do not require CORP)
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    // Allow popups and avoid strict cross-origin opener behavior
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  } catch (e) {
    // ignore
  }
  next();
});

// Disable ETag/conditional requests for API endpoints to avoid 304 responses
// interfering with credentialed session checks in the SPA during local dev.
app.disable && app.disable('etag');

// Ensure API and auth endpoints are not cached by the browser. Some browsers may
// re-use cached 304 responses which causes the SPA to think the session is missing.
app.use((req, res, next) => {
  try {
    if (req.path && (req.path.startsWith('/api') || req.path.startsWith('/auth') || req.path === '/callback')) {
      res.setHeader('Cache-Control', 'no-store');
    }
  } catch (e) {}
  next();
});

// Session middleware (required for OIDC flow state/nonce storage)
// Configure session cookie lifetime. If SESSION_COOKIE_DAYS is provided use it; otherwise
// for development default to 30 days so sessions persist until explicit logout.
const sessionCookieDays = parseInt(process.env.SESSION_COOKIE_DAYS || '', 10);
const defaultCookieDays = Number.isFinite(sessionCookieDays) ? sessionCookieDays : 30;
const cookieMaxAge = process.env.SESSION_MAX_AGE_MS
  ? parseInt(process.env.SESSION_MAX_AGE_MS, 10)
  : 1000 * 60 * 60 * 24 * defaultCookieDays; // ms

// Detect development mode
const isDevMode = process.env.NODE_ENV !== 'production';

// For local/development environments we must not use secure cookies (they won't be sent over http).
const cookieSecure = !isDevMode;

const sessionOptions = {
  secret: process.env.SESSION_SECRET || 'some secret',
  name: process.env.SESSION_COOKIE_NAME || 'connect.sid',
  resave: false,
  saveUninitialized: false,
  // Refresh session cookie on every response to implement sliding expiration
  rolling: true,
  cookie: {
    // secure can be enforced by env override (useful in unusual deploys)
    secure: typeof process.env.SESSION_COOKIE_SECURE !== 'undefined' ? String(process.env.SESSION_COOKIE_SECURE) === 'true' : cookieSecure,
    httpOnly: true,
    // Allow overriding SameSite via env for special cases. In production, when
    // cookies are secure, set SameSite to 'none' so cross-site requests from
    // the frontend (snatchers.in) will include the session cookie.
    sameSite: process.env.SESSION_SAME_SITE || (cookieSecure ? 'none' : 'lax'),
    maxAge: cookieMaxAge,
  },
};

// If a cookie domain is provided, ensure express-session uses it so a single
// Set-Cookie is emitted with the correct domain (avoids duplicate cookies).
if (process.env.SESSION_COOKIE_DOMAIN) {
  sessionOptions.cookie.domain = process.env.SESSION_COOKIE_DOMAIN;
}

// If Mongo is available, use it as session store so sessions persist across restarts
if (process.env.MONGO_URI) {
  sessionOptions.store = MongoStore.create({ mongoUrl: process.env.MONGO_URI });
}

app.use(session(sessionOptions));

// Refresh cookie maxAge on each request when a session exists (sliding session)
app.use((req, res, next) => {
  try {
    if (req.session && req.session.userInfo && req.session.cookie) {
      req.session.cookie.maxAge = cookieMaxAge;
    }
  } catch (e) {
    // ignore
  }
  next();
});

console.log(`Session cookie settings: secure=${cookieSecure}, maxAge=${cookieMaxAge}ms, devMode=${isDevMode}`);

// (removed dev-only debug header to restore normal behavior)

// View engine for simple pages
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'ejs');

// OpenID Connect / Cognito client init
let oidcClient;
// Parse configured Cognito redirect URIs (support comma-separated list)
const cognitoRedirectUris = (process.env.COGNITO_REDIRECT_URI || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';

function isValidRedirectUri(uri) {
  // Accept only exact matches against configured Cognito redirect URIs
  if (!uri) return false;
  if (cognitoRedirectUris.length === 0) return false;
  return cognitoRedirectUris.includes(uri);
}

// Startup validation: in production we must ensure the FRONTEND_URL is included
// in the configured Cognito redirect URIs. This prevents users from being
// redirected to the provider-hosted error page (redirect_mismatch). You can
// also force this check in non-production by setting FAIL_FAST_ON_MISSING_REDIRECT=true
const requireFrontendInRedirects = (process.env.FAIL_FAST_ON_MISSING_REDIRECT === 'true') || process.env.NODE_ENV === 'production';
if (requireFrontendInRedirects) {
  if (!isValidRedirectUri(frontend)) {
    console.error(`❌ Startup check failed: FRONTEND_URL (${frontend}) is not present in COGNITO_REDIRECT_URI list: ${JSON.stringify(cognitoRedirectUris)}.`);
    console.error('Refusing to start to avoid redirect_mismatch errors. Fix your environment variables or Cognito App Client settings.');
    // Exit with non-zero code so orchestration/CI will notice the misconfiguration
    process.exit(1);
  }
} else {
  if (!isValidRedirectUri(frontend)) {
    console.warn(`⚠️ FRONTEND_URL (${frontend}) is not present in COGNITO_REDIRECT_URI list: ${JSON.stringify(cognitoRedirectUris)}.`);
    console.warn('In non-production this is allowed, but you may see redirect_mismatch errors when testing OIDC flows.');
  }
}

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
      // Use parsed redirect URIs; fall back to single env value or a sensible default
      redirect_uris: cognitoRedirectUris.length
        ? cognitoRedirectUris
        : [(process.env.COGNITO_REDIRECT_URI || 'https://d84l1y8p4kdic.cloudfront.net')],
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
app.get('/api/user/me', async (req, res) => {
  try {
    // 1) Session-based authentication
    if (req.session && req.session.userInfo) {
      return res.json({ authType: 'session', user: req.session.userInfo });
    }

    // 2) Token-based authentication (Authorization: Bearer <token>)
    const authHeader = req.headers.authorization || req.headers.Authorization || '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const userPoolId = process.env.COGNITO_USER_POOL_ID;
        const clientId = process.env.COGNITO_USER_POOL_CLIENT_ID || process.env.COGNITO_CLIENT_ID;
        if (!userPoolId || !clientId) {
          console.warn('[Auth] Cognito config missing - cannot verify token');
          return res.status(401).json({ error: 'Token verification unavailable' });
        }
        const verifier = CognitoJwtVerifier.create({ userPoolId, tokenUse: 'id', clientId });
        const payload = await verifier.verify(token);
        const user = { sub: payload.sub, email: payload.email, name: payload.name || payload['cognito:username'] };
        return res.json({ authType: 'token', user, raw: payload });
      } catch (err) {
        console.error('[Auth] token verify failed:', err?.message || err);
        return res.status(401).json({ error: 'Invalid token' });
      }
    }

    // 3) No session or token
    return res.status(401).json({ error: 'Not authenticated' });
  } catch (err) {
    console.error('[Auth] /api/user/me error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
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

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Health / diagnostic endpoint
// Health handler function used for both /health and /api/health
async function healthHandler(req, res) {
  try {
    const mongoState = mongoose.connection.readyState; // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const mongoStatus = (() => {
      switch (mongoState) {
        case 0:
          return 'disconnected';
        case 1:
          return 'connected';
        case 2:
          return 'connecting';
        case 3:
          return 'disconnecting';
        default:
          return 'unknown';
      }
    })();

    const configIssues = [];
    if (!process.env.MONGO_URI) configIssues.push('MONGO_URI missing');
    if (!process.env.COGNITO_CLIENT_ID) configIssues.push('COGNITO_CLIENT_ID missing');
    if (!process.env.COGNITO_USER_POOL_ID) configIssues.push('COGNITO_USER_POOL_ID missing');
    if (!process.env.COGNITO_REGION) configIssues.push('COGNITO_REGION missing');
    if (!process.env.COGNITO_REDIRECT_URI) configIssues.push('COGNITO_REDIRECT_URI missing');
    if (!process.env.FRONTEND_URL) configIssues.push('FRONTEND_URL missing');
    if (cognitoRedirectUris.length > 0 && !cognitoRedirectUris.includes(frontend)) {
      configIssues.push('FRONTEND_URL not present in COGNITO_REDIRECT_URI list');
    }

    return res.json({
      status: 'ok',
      pid: process.pid,
      uptime: process.uptime(),
      oidcClientInitialized: !!oidcClient,
      mongo: { state: mongoState, status: mongoStatus },
      configIssues,
      env: {
        nodeEnv: process.env.NODE_ENV || null,
        frontend: frontend || null,
      },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', error: String(err) });
  }
}

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// OIDC login route - redirect to Cognito hosted login page
app.get('/login', (req, res) => {
  if (!oidcClient) return res.status(503).send('OIDC client not initialized');
  const nonce = generators.nonce();
  const state = generators.state();
  req.session.nonce = nonce;
  req.session.state = state;
  // Pick candidate redirect URI. Prefer the explicit configured list, then env value, then default.
  const redirectCandidate =
    cognitoRedirectUris.length > 0
      ? cognitoRedirectUris[0]
      : (process.env.COGNITO_REDIRECT_URI || 'http://localhost:5000/callback');

  console.log('[OIDC] /login requested — using redirect candidate:', redirectCandidate);

  // IMPORTANT: do not redirect the user to Cognito if the redirect URI is not an exact
  // match of the configured Cognito redirect URIs. If misconfigured, send the user back
  // to the SPA with an error message instead of letting Cognito show its own error page.
  if (!isValidRedirectUri(redirectCandidate)) {
    console.error('[OIDC] redirect URI mismatch — refusing to initiate auth to prevent Cognito error page.');
    const msg = encodeURIComponent('redirect_mismatch');
    return res.redirect(`${frontend}/auth/error?error=${msg}`);
  }

  const authUrl = oidcClient.authorizationUrl({
    scope: 'openid email phone',
    state,
    nonce,
    redirect_uri: redirectCandidate,
  });
  // Log auth URL partially (avoid printing secrets)
  console.log('[OIDC] redirecting to Cognito auth URL (partial):', authUrl.replace(/(redirect_uri=)[^&]*/,'$1REDACTED'));
  res.redirect(authUrl);
});

// (demo endpoints removed; use normal login routes and OIDC flow)

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
        console.error('[OIDC] callback redirect_mismatch detected — redirecting to SPA error page');
        const msg = encodeURIComponent('redirect_mismatch');
        return res.redirect(`${frontend}/auth/error?error=${msg}`);
      }
      // For other errors, send user back to SPA root but log server side.
      res.redirect(frontend);
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
    // ensure session cookie persists according to configured maxAge
    try {
      if (req.session && req.session.cookie) req.session.cookie.maxAge = cookieMaxAge;
    } catch (e) {}
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
  // Destroy server-side session and clear the session cookie in the response so the browser
  // no longer sends it on subsequent requests. Use the configured session cookie name and
  // cookie options so the cookie is removed properly across domains if a domain was set.
  try {
    const cookieName = (session && session.cookie && session.name) || sessionOptions.name || process.env.SESSION_COOKIE_NAME || 'connect.sid';
    req.session && req.session.destroy && req.session.destroy((err) => {
      // best-effort clear cookie
      try {
        const clearOpts = { path: '/' };
        if (sessionOptions && sessionOptions.cookie) {
          if (sessionOptions.cookie.domain) clearOpts.domain = sessionOptions.cookie.domain;
          if (typeof sessionOptions.cookie.secure !== 'undefined') clearOpts.secure = sessionOptions.cookie.secure;
          if (sessionOptions.cookie.sameSite) clearOpts.sameSite = sessionOptions.cookie.sameSite;
        }
        res.clearCookie(cookieName, clearOpts);
      } catch (e) {
        // ignore cookie clear failures
      }
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
      return res.redirect(frontend);
    });
  } catch (err) {
    console.error('Error during logout:', err);
    return res.redirect(frontend);
  }
});

// Note: /api/user/me is now handled earlier as a session-first endpoint.

// MongoDB Connection
function redactMongoUri(uri) {
  if (!uri) return '(none)';
  // hide password between first ':' after protocol and '@'
  try {
    return uri.replace(/(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@/, '$1$2:***@');
  } catch (e) { return '(redact-error)'; }
}

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.warn('⚠️ MONGO_URI not set. Starting server in NO-DB dev mode. Many API endpoints will be disabled.');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} (no DB)`));
} else {
  mongoose.connect(mongoUri, {
    // options kept for compatibility warnings - mongoose ignores deprecated options
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err && err.message ? err.message : err);
    console.error('Attempted MONGO_URI (redacted):', redactMongoUri(mongoUri));
    if (err && err.message && err.message.toLowerCase().includes('authentication failed')) {
      console.error('→ Authentication failed connecting to MongoDB. Check that the username/password in your MONGO_URI are correct, that the user exists in Atlas, and that IP access list allows connections from this host.');
    }
    console.error('The server will exit. If you want to run without a DB for dev, unset MONGO_URI or provide a valid one.');
    process.exit(1);
  });
}
