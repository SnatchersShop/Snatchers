import React, { createContext, useContext, useEffect, useState } from 'react';
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

const awsConfig = {
  region: process.env.REACT_APP_AWS_REGION || '<YOUR_REGION>',
  userPoolId: process.env.REACT_APP_USER_POOL_ID || '<YOUR_USER_POOL_ID>',
  userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID || '<YOUR_CLIENT_ID>'
};

// Optional client secret (not recommended in frontends for production)
awsConfig.userPoolWebClientSecret = process.env.REACT_APP_USER_POOL_CLIENT_SECRET || '';

const poolData = {
  UserPoolId: awsConfig.userPoolId,
  ClientId: awsConfig.userPoolWebClientId,
};

// Validate basic UserPoolId format (e.g. us-east-1_XXXXXXXXX) and ClientId presence.
const userPoolIdRegex = /^[a-z]{2}-[a-z]+-\d+_[A-Za-z0-9]+$/;
let userPool = null;
if (!awsConfig.userPoolId || awsConfig.userPoolId.includes('<') || !userPoolIdRegex.test(awsConfig.userPoolId)) {
  console.error('[CognitoAuth] Invalid or missing REACT_APP_USER_POOL_ID. Expected format: region_poolId (e.g. us-east-1_Abc12345). Current value:', awsConfig.userPoolId);
} else if (!awsConfig.userPoolWebClientId || awsConfig.userPoolWebClientId.includes('<')) {
  console.error('[CognitoAuth] Invalid or missing REACT_APP_USER_POOL_CLIENT_ID. Current value:', awsConfig.userPoolWebClientId);
} else {
  try {
    userPool = new CognitoUserPool(poolData);
  } catch (err) {
    console.error('[CognitoAuth] Failed to create CognitoUserPool:', err);
    userPool = null;
  }
}

// If Cognito isn't configured, fall back to a local dev auth mode using localStorage.
const LOCAL_USERS_KEY = 'snatchers_local_users_v1';
const LOCAL_CURRENT_KEY = 'snatchers_local_current_v1';
const enableLocalMode = !userPool;

function readLocalUsers() {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function writeLocalUsers(users) {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    /* ignore */
  }
}

function setLocalCurrent(username) {
  try {
    localStorage.setItem(LOCAL_CURRENT_KEY, username);
  } catch (e) {}
}

function getLocalCurrent() {
  try {
    return localStorage.getItem(LOCAL_CURRENT_KEY);
  } catch (e) {
    return null;
  }
}

// Ensure a default test user exists for quick local testing
if (enableLocalMode) {
  const users = readLocalUsers();
  if (!users.find(u => u.username === 'test@local')) {
    users.push({ username: 'test@local', password: 'password', attributes: { email: 'test@local' } });
    writeLocalUsers(users);
  }
}

const AuthContext = createContext(null);

// Helper to compute SECRET_HASH using HMAC-SHA256 and base64 encoding
async function computeSecretHash(username) {
  const secret = awsConfig.userPoolWebClientSecret;
  const clientId = awsConfig.userPoolWebClientId;
  if (!secret) return null;
  // Use Web Crypto API
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API not available to compute SECRET_HASH. Cannot authenticate with a client secret from the frontend.');
  }
  const enc = new TextEncoder();
  const keyData = enc.encode(secret);
  const msg = enc.encode(username + clientId);
  const key = await window.crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await window.crypto.subtle.sign('HMAC', key, msg);
  // convert to base64
  const bytes = new Uint8Array(sig);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function CognitoAuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userPool) {
      // Local dev auth mode
      const current = getLocalCurrent();
      if (current) {
        // create a mock session object
        const session = {
          getIdToken() {
            return {
              getJwtToken: () => `local-jwt-${current}`,
              payload: { email: current }
            };
          }
        };
        setCurrentUser({ username: current, session });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
      return;
    }

    const user = userPool.getCurrentUser();
    if (user) {
      user.getSession((err, session) => {
        if (err) {
          console.error('Cognito session error', err);
          setCurrentUser(null);
        } else {
          setCurrentUser({ username: user.getUsername(), session });
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const signup = (email, password, attributes = {}) => {
    if (!userPool && enableLocalMode) {
      return new Promise((resolve) => {
        const users = readLocalUsers();
        if (users.find(u => u.username === email)) {
          const err = new Error('User already exists');
          err.name = 'UsernameExistsException';
          return resolve(Promise.reject(err));
        }
        users.push({ username: email, password, attributes });
        writeLocalUsers(users);
        setLocalCurrent(email);
        const session = {
          getIdToken() { return { getJwtToken: () => `local-jwt-${email}`, payload: { email } }; }
        };
        setCurrentUser({ username: email, session });
        return resolve({ user: { username: email } });
      });
    }
    if (!userPool) return Promise.reject(new Error('Cognito User Pool is not configured. Set REACT_APP_USER_POOL_ID and REACT_APP_USER_POOL_CLIENT_ID.'));
    return new Promise((resolve, reject) => {
      userPool.signUp(email, password, [], null, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  };

  const forgotPassword = (username) => {
    if (!userPool && enableLocalMode) {
      // Local mode: simulate success
      return Promise.resolve({ challenge: 'CODE_SENT' });
    }
    if (!userPool) return Promise.reject(new Error('Cognito User Pool is not configured.'));
    return new Promise((resolve, reject) => {
      const user = new CognitoUser({ Username: username, Pool: userPool });
      user.forgotPassword({
        onSuccess: (data) => resolve(data),
        onFailure: (err) => reject(err),
        inputVerificationCode: () => resolve({ challenge: 'CODE_SENT' }),
      });
    });
  };

  const confirmPassword = (username, code, newPassword) => {
    if (!userPool && enableLocalMode) {
      // Local mode: simply update stored password if user exists
      return new Promise((resolve, reject) => {
        const users = readLocalUsers();
        const idx = users.findIndex(u => u.username === username);
        if (idx === -1) return reject(new Error('User not found'));
        users[idx].password = newPassword;
        writeLocalUsers(users);
        resolve(true);
      });
    }
    if (!userPool) return Promise.reject(new Error('Cognito User Pool is not configured.'));
    return new Promise((resolve, reject) => {
      const user = new CognitoUser({ Username: username, Pool: userPool });
      user.confirmPassword(code, newPassword, {
        onSuccess: () => resolve(true),
        onFailure: (err) => reject(err),
      });
    });
  };

  const login = async (username, password) => {
    if (!userPool && enableLocalMode) {
      return new Promise((resolve, reject) => {
        const users = readLocalUsers();
        const found = users.find(u => u.username === username && u.password === password);
        if (!found) return reject(new Error('Invalid credentials'));
        setLocalCurrent(username);
        const session = {
          getIdToken() { return { getJwtToken: () => `local-jwt-${username}`, payload: { email: username } }; }
        };
        setCurrentUser({ username, session });
        resolve(session);
      });
    }
    if (!userPool) return Promise.reject(new Error('Cognito User Pool is not configured.'));

    // If a client secret is configured, compute SECRET_HASH and include it in auth params
    let secretHash = null;
    try {
      if (awsConfig.userPoolWebClientSecret) {
        secretHash = await computeSecretHash(username);
      }
    } catch (err) {
      console.error('Failed to compute SECRET_HASH:', err);
      // proceed without secret hash — the server will reject if required
    }

    const authParams = { Username: username, Password: password };
    if (secretHash) authParams.SecretHash = secretHash;

    const authDetails = new AuthenticationDetails(authParams);
    const user = new CognitoUser({ Username: username, Pool: userPool });

    return new Promise((resolve, reject) => {
      user.authenticateUser(authDetails, {
        onSuccess: (session) => {
          setCurrentUser({ username, session });
          resolve(session);
        },
        onFailure: (err) => reject(err),
        newPasswordRequired: (data) => reject(new Error('New password required')),
      });
    });
  };

  const logout = () => {
    if (!userPool && enableLocalMode) {
      // clear local current
      setLocalCurrent('');
      setCurrentUser(null);
      return;
    }
    if (!userPool) {
      setCurrentUser(null);
      return;
    }
    const user = userPool.getCurrentUser();
    if (user) user.signOut();
    setCurrentUser(null);
  };

  const getSession = () => {
    if (!userPool && enableLocalMode) {
      const current = getLocalCurrent();
      if (!current) return Promise.resolve(null);
      return Promise.resolve({
        getIdToken() { return { getJwtToken: () => `local-jwt-${current}`, payload: { email: current } }; }
      });
    }
    if (!userPool) return Promise.resolve(null);
    return new Promise((resolve, reject) => {
      const user = userPool.getCurrentUser();
      if (!user) return resolve(null);
      user.getSession((err, session) => {
        if (err) return reject(err);
        resolve(session);
      });
    });
  };

  const value = { currentUser, loading, signup, login, logout, getSession, forgotPassword, confirmPassword, userPool };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useCognitoAuth() {
  return useContext(AuthContext);
}

export default CognitoAuthProvider;
