import express from 'express';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';

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
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: 'No ID token provided' });
  }

  try {
    const verifier = createVerifier();
    const payload = await verifier.verify(idToken);

    // Map Cognito attributes to user model
    const uid = payload.sub;
    const email = payload.email;
    const name = payload.name || payload['cognito:username'] || '';

    // Upsert user in MongoDB
    const user = await User.findOneAndUpdate(
      { uid },
      { uid, email, name },
      { upsert: true, new: true }
    );

    // Optionally create a signed JWT for your backend sessions
    // For now, return the idToken and user info
    res.status(200).json({ token: idToken, user });
  } catch (error) {
    console.error('Cognito login error:', error);
    return res.status(401).json({ error: 'Invalid ID token' });
  }
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
