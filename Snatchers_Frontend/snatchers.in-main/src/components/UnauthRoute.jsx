import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../api';

export default function UnauthRoute({ children }) {
  const { getSession } = useAuth();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (process.env.REACT_APP_USE_SERVER_AUTH === 'true') {
          try {
            const res = await fetch('/api/user/me', { credentials: 'include', cache: 'no-store' });
            if (res.ok) {
              if (mounted) setAuthenticated(true);
              return;
            }
          } catch (e) {}
        }

        // Check Cognito/session-based client auth
        try {
          const session = await getSession();
          if (session) {
            if (mounted) setAuthenticated(true);
            return;
          }
        } catch (e) {}

        // Token-based path: api instance will attach Authorization header if token exists
        try {
          const tokenCheck = localStorage.getItem('token');
          if (tokenCheck) {
            // Use api (axios) which will add the token automatically
            const userRes = await api.get('/api/user/me');
            if (userRes && userRes.status === 200) {
              if (mounted) setAuthenticated(true);
              return;
            }
          }
        } catch (e) {
          // If token is invalid, api interceptor will clear it and redirect to login
        }
      } finally {
        if (mounted) setChecking(false);
      }
    })();
    return () => { mounted = false; };
  }, [getSession]);

  if (checking) return null;
  if (authenticated) return <Navigate to="/profile" replace />;
  return children;
}
