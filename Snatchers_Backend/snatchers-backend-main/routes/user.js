import express from 'express';
import User from '../models/User.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// ✅ Save or get user
router.post('/', async (req, res) => {
  const { uid, name, email, photoURL } = req.body;

  try {
    let user = await User.findOne({ uid });

    if (!user) {
      user = new User({ uid, name, email, photoURL });
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Protected route to get user info from token
router.get('/me', verifyToken, async (req, res) => {
  try {
    const uid = req.user.sub || req.user.uid || req.user['cognito:username'];
    let user = await User.findOne({ uid });

    // 🔧 Auto-create user if not found using Cognito claims
    if (!user) {
      user = new User({
        uid,
        name: req.user.name || req.user['cognito:username'] || "Unknown",
        email: req.user.email || "unknown@example.com",
        photoURL: req.user.picture || ""
      });
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
