import React, { useEffect, useRef } from 'react';
import api from '../api';

export default function GoogleSignIn({ onSuccess, onError }) {
  const btnRef = useRef(null);

  useEffect(() => {
    // Load Google Identity Services script if not present
    const existing = document.getElementById('google-identity');
    if (!existing) {
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.id = 'google-identity';
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
      s.onload = () => initialize();
    } else {
      initialize();
    }

    function initialize() {
      try {
        /* global google */
        const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
        if (!clientId) {
          console.warn('REACT_APP_GOOGLE_CLIENT_ID not set');
          return;
        }
        google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
        });
        // render the button
        google.accounts.id.renderButton(btnRef.current, { theme: 'outline', size: 'large' });
      } catch (e) {
        console.warn('Google Identity initialization failed', e);
      }
    }

    function handleCredentialResponse(response) {
      const idToken = response.credential;
      if (!idToken) return onError?.('No ID token from Google');
      // Send to backend to verify and create session
      api.post('/api/google-login', { idToken })
        .then((res) => onSuccess?.(res.data))
        .catch((err) => onError?.(err?.response?.data || err.message || 'Google login failed'));
    }
  }, []);

  return (
    <div>
      <div ref={btnRef} />
    </div>
  );
}
