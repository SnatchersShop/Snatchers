import User from '../models/User.js';
import verifyToken from './auth.js';

// Session-aware authentication middleware.
// If a server session exists (req.session.userInfo), attach the corresponding
// user document to req.user and set req.authId (string). Otherwise, delegate to
// the JWT/session-aware verifyToken middleware which will validate Authorization
// header tokens and also map session userInfo to req.user.
export const isAuthenticated = async (req, res, next) => {
  try {
    // Prefer session-based userInfo (created by login/register flows)
    if (req.session && req.session.userInfo) {
      try {
        const si = req.session.userInfo || {};
        // Try to find a user by uid/email or fallback to session fields
        let user = null;
        if (si.uid) {
          user = await User.findOne({ uid: si.uid }).select('-password');
        }
        if (!user && si.email) {
          user = await User.findOne({ email: si.email }).select('-password');
        }
        if (!user) {
          // As a last resort, attach the raw session info so downstream code
          // doesn't crash expecting req.user to exist.
          req.user = { uid: si.uid || si.sub, email: si.email, name: si.name };
          req.authId = String(si.uid || si.sub || si.email || '');
          return next();
        }

        req.user = user;
        // Preferred stable identifier for wishlist ownership
        req.authId = String(user.uid || user._id || user.sub || user.email || '');
        return next();
      } catch (err) {
        console.error('[isAuthenticated] session lookup error:', err);
        return res.status(500).json({ error: 'Server error during auth' });
      }
    }

    // No session present; delegate to existing verifyToken which will validate
    // an Authorization: Bearer <token> header and populate req.user where
    // applicable. verifyToken will call next() on success or send a 401.
    return verifyToken(req, res, next);
  } catch (err) {
    console.error('[isAuthenticated] unexpected error:', err);
    return res.status(500).json({ error: 'Server error during auth' });
  }
};

export default isAuthenticated;
