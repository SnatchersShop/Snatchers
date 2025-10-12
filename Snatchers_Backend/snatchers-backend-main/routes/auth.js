import express from 'express';
import admin from '../firebase/initFirebase.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: 'No ID token provided' });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    // Optionally generate a JWT or just return decoded user
    res.status(200).json({ token: idToken, user: decoded });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(401).json({ error: 'Invalid ID token' });
  }
});

export default router;
