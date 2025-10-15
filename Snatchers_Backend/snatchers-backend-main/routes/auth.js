import express from 'express';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcrypt';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

// Helper to set the session cookie explicitly (works around proxy/header differences)
function setSessionCookie(req, res) {
  try {
    const secureFlag = req.secure || (req.headers && req.headers['x-forwarded-proto'] === 'https');
    const sessionCookieDays = parseInt(process.env.SESSION_COOKIE_DAYS || '', 10);
    const defaultCookieDays = Number.isFinite(sessionCookieDays) ? sessionCookieDays : 30;
    const cookieMaxAge = process.env.SESSION_MAX_AGE_MS
      ? parseInt(process.env.SESSION_MAX_AGE_MS, 10)
      : 1000 * 60 * 60 * 24 * defaultCookieDays;
    const sameSite = process.env.SESSION_SAME_SITE || (secureFlag ? 'none' : 'lax');
    const cookieOptions = {
      httpOnly: true,
      secure: secureFlag,
      sameSite,
      maxAge: cookieMaxAge,
    };
    if (process.env.SESSION_COOKIE_DOMAIN) cookieOptions.domain = process.env.SESSION_COOKIE_DOMAIN;
    const cookieName = process.env.SESSION_COOKIE_NAME || 'connect.sid';
    // set cookie with current session id
    res.cookie(cookieName, req.sessionID, cookieOptions);
  } catch (e) {
    console.warn('Failed to set session cookie explicitly', e);
  }
}

// Create verifier lazily so env vars are available at runtime
function createVerifier() {
  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  const clientId = process.env.COGNITO_USER_POOL_CLIENT_ID || process.env.COGNITO_CLIENT_ID;
  if (!userPoolId || !clientId) {
    throw new Error('COGNITO_USER_POOL_ID and COGNITO_USER_POOL_CLIENT_ID must be set');
  }
  return CognitoJwtVerifier.create({
    userPoolId,
    tokenUse: 'id',
    clientId,
  });
}

router.post('/login', async (req, res) => {
  // This route supports two login modes:
  // 1) Cognito ID token login: { idToken }
  // 2) Email/password login: { email, password }
  const { idToken, email, password } = req.body || {};

  // Mode 1: Cognito ID token
  if (idToken) {
    try {
      const verifier = createVerifier();
      const payload = await verifier.verify(idToken);

      const uid = payload.sub;
      const emailAddr = payload.email;
      const name = payload.name || payload['cognito:username'] || '';

      const user = await User.findOneAndUpdate(
        { uid },
        { uid, email: emailAddr, name },
        { upsert: true, new: true }
      );

      // For session-first SPA flows we do not set a cookie here by default.
      // Return token and user to the client.
      return res.status(200).json({ token: idToken, user });
    } catch (error) {
      console.error('Cognito login error:', error);
      return res.status(401).json({ error: 'Invalid ID token' });
    }
  }

  // Mode 2: Email/password login
  if (email && password) {
    try {
  const emailNormalized = String(email || '').trim().toLowerCase();
  const user = await User.findOne({ email: { $regex: new RegExp('^' + emailNormalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } }).exec();
      if (!user) {
        console.warn(`[Auth] login attempt for non-existent user: ${emailNormalized}`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const stored = user.password;
      console.log(`[Auth] user found for login: ${user.email} uid=${user.uid} password_present=${!!stored}`);
      let ok = false;
      let needsRehash = false;

      if (!stored) {
        // No password set for this user
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Heuristic: if stored starts with $2 (bcrypt), use bcrypt.compare
      if (typeof stored === 'string' && stored.startsWith('$2')) {
        try {
          ok = await bcrypt.compare(password, stored);
          console.log('[Auth] bcrypt.compare result for', user.email, ok);
        } catch (e) {
          console.error('[Auth] bcrypt.compare failed', e);
        }
      } else {
        // Plaintext fallback for legacy data: compare and re-hash on success
        if (password === stored) {
          ok = true;
          needsRehash = true;
        }
      }

      if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

      // If legacy plaintext matched, re-hash the password and store it
      if (needsRehash) {
        try {
          const hash = await bcrypt.hash(password, 10);
          user.password = hash;
          await user.save();
          console.log(`Re-hashed password for user ${user.email}`);
        } catch (e) {
          console.warn('Failed to rehash password for user', user.email, e);
        }
      }

      // Establish server session for session-first endpoints
      try {
        if (req.session) {
          req.session.userInfo = { uid: user.uid, email: user.email, name: user.name, photoURL: user.photoURL };
          req.session.save?.(() => {});
              // ensure cookie is set for browsers behind proxies
              try { setSessionCookie(req, res); } catch (e) {}
        }
      } catch (e) {
        console.warn('Failed to create session for user', user.email, e);
      }

      return res.json({ user });
    } catch (err) {
      console.error('Password login error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // If no supported auth mode provided
  return res.status(400).json({ error: 'No credentials provided' });
});

// Google ID token login - client sends the Google ID token obtained from client-side
router.post('/google-login', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: 'No ID token provided' });
  try {
    const ticket = await googleClient.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const uid = payload.sub;
    const email = payload.email;
    const name = payload.name || '';

    const user = await User.findOneAndUpdate(
      { uid },
      { uid, email, name, photoURL: payload.picture },
      { upsert: true, new: true }
    );

    // Establish server-side session (if sessions enabled in app)
    try {
      if (req.session) {
        req.session.userInfo = { uid: user.uid, email: user.email, name: user.name, photoURL: user.photoURL };
        // Persist session
        req.session.save?.(() => {});
            try { setSessionCookie(req, res); } catch (e) {}
      }
    } catch (e) {
      console.warn('Failed to establish session after Google login', e);
    }

    return res.json({ token: idToken, user });
  } catch (err) {
    console.error('Google login error:', err);
    return res.status(401).json({ error: 'Invalid Google ID token' });
  }
});

// Register new user with email/password
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    const emailNormalized = String(email || '').trim().toLowerCase();
    // check existing user by email (case-insensitive)
  // safe escape for regex special chars
  const esc = emailNormalized.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
  const existing = await User.findOne({ email: { $regex: new RegExp('^' + esc + '$', 'i') } }).exec();
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const hash = await bcrypt.hash(String(password), 10);

    // generate a uid if not provided (use email-based uid for simplicity)
    const uid = `user-${Date.now()}`;

    const userDoc = new User({ uid, email: emailNormalized, name: name || '', password: hash });
    await userDoc.save();

    // create server session if available
    try {
      if (req.session) {
        req.session.userInfo = { uid: userDoc.uid, email: userDoc.email, name: userDoc.name, photoURL: userDoc.photoURL };
        req.session.save?.(() => {});
            try { setSessionCookie(req, res); } catch (e) {}
      }
    } catch (e) {
      console.warn('Failed to create session after register', e);
    }

    return res.status(201).json({ user: userDoc });
  } catch (err) {
    console.error('Register error:', err);
    // duplicate key error may happen concurrently
    if (err && err.code === 11000) return res.status(409).json({ error: 'User already exists' });
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
