import express from 'express';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcrypt';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = express.Router();

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
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      const stored = user.password;
      let ok = false;
      let needsRehash = false;

      if (!stored) {
        // No password set for this user
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Heuristic: if stored starts with $2 (bcrypt), use bcrypt.compare
      if (typeof stored === 'string' && stored.startsWith('$2')) {
        ok = await bcrypt.compare(password, stored);
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

export default router;
