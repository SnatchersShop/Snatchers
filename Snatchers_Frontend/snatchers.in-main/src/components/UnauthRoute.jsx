import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

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
        try {
          const session = await getSession();
          if (session) {
            if (mounted) setAuthenticated(true);
            return;
          }
        } catch (e) {}
        const token = localStorage.getItem('token');
        if (token) {
          if (mounted) setAuthenticated(true);
          return;
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
