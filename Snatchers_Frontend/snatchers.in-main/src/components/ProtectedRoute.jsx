import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { getSession } = useAuth();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // 1) try server session
        if (process.env.REACT_APP_USE_SERVER_AUTH === 'true') {
          try {
            const backend = process.env.REACT_APP_API_BASE_URL || 'https://api.snatchers.in';
            const res = await fetch(backend + '/api/user/me', { credentials: 'include', cache: 'no-store' });
            if (res.ok) {
              if (mounted) setAuthenticated(true);
              return;
            }
          } catch (e) {}
        }
        // 2) try Cognito session
        try {
          const session = await getSession();
          if (session) {
            if (mounted) setAuthenticated(true);
            return;
          }
        } catch (e) {}
        // 3) try local token
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

  if (checking) return null; // or a spinner
  if (!authenticated) return <Navigate to="/login" replace />;
  return children;
}
