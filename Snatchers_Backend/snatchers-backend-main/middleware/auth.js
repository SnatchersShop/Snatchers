import { CognitoJwtVerifier } from 'aws-jwt-verify';
import User from '../models/User.js';

function createVerifier() {
  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  const clientId = process.env.COGNITO_USER_POOL_CLIENT_ID || process.env.COGNITO_CLIENT_ID;
  if (!userPoolId || !clientId) {
    console.warn('COGNITO_USER_POOL_ID or COGNITO_USER_POOL_CLIENT_ID not set in env. Auth middleware may fail.');
  }
  return CognitoJwtVerifier.create({
    userPoolId: userPoolId || '<YOUR_USER_POOL_ID>',
    tokenUse: 'id',
    clientId: clientId || '<YOUR_CLIENT_ID>',
  });
}

const verifyToken = async (req, res, next) => {
  // First, allow session-based authentication (server session)
  try {
    if (req.session && req.session.userInfo) {
      // Map session userInfo to an object similar to Cognito JWT payload so
      // downstream code can use `req.user.sub` / `req.user.email` etc.
      const s = req.session.userInfo;
      req.user = {
        sub: s.uid || s.sub || s.uid,
        email: s.email,
        name: s.name,
        picture: s.picture || s.photoURL || s.photoUrl,
        // keep original session payload for reference
        _session: s,
      };
      return next();
    }
  } catch (e) {
    // ignore and continue to token verification
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const verifier = createVerifier();
    const payload = await verifier.verify(token);
    req.user = payload;
    next();
  } catch (err) {
    console.error('Cognito token verification failed:', err);
    return res.status(401).json({ message: 'Unauthorized', details: err?.message });
  }
};

// Session-aware authentication middleware that prefers server sessions and
// falls back to token verification. It attaches req.user and req.authId.
export const isAuthenticated = async (req, res, next) => {
  try {
    if (req.session && req.session.userInfo) {
      try {
        const si = req.session.userInfo || {};
        let user = null;
        if (si.uid) {
          user = await User.findOne({ uid: si.uid }).select('-password');
        }
        if (!user && si.email) {
          user = await User.findOne({ email: si.email }).select('-password');
        }
        if (!user) {
          req.user = { uid: si.uid || si.sub, email: si.email, name: si.name };
          req.authId = String(si.uid || si.sub || si.email || '');
          return next();
        }

        req.user = user;
        req.authId = String(user.uid || user._id || user.sub || user.email || '');
        return next();
      } catch (err) {
        console.error('[isAuthenticated] session lookup error:', err);
        return res.status(500).json({ error: 'Server error during auth' });
      }
    }

    // No session - delegate to token verifier
    return verifyToken(req, res, next);
  } catch (err) {
    console.error('[isAuthenticated] unexpected error:', err);
    return res.status(500).json({ error: 'Server error during auth' });
  }
};

export default verifyToken;
