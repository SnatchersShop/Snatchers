import { CognitoJwtVerifier } from 'aws-jwt-verify';

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

export default verifyToken;
