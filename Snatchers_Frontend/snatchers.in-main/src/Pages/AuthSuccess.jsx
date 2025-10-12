import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Finalizing sign-in...');
  const [isSuccess, setIsSuccess] = useState(false);
  const claimedRef = useRef(false);

  useEffect(() => {
    // Claim one-time token posted by backend after OIDC callback.
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      setMessage('No auth token present. Please sign in again.');
      return;
    }

    // Prevent duplicate attempts (React StrictMode may run effects twice in dev)
    let inFlight = false;

    const claim = async () => {
      if (inFlight || claimedRef.current) return;
      inFlight = true;
      try {
        const useServerAuth = process.env.REACT_APP_USE_SERVER_AUTH === 'true';
        const claimUrl = useServerAuth ? '/auth/claim' : `${process.env.REACT_APP_API_BASE_URL}/auth/claim`;
        const res = await fetch(claimUrl, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        if (res.ok) {
          claimedRef.current = true;
          setIsSuccess(true);
          setMessage('Sign-in successful — redirecting to profile...');
          setTimeout(() => navigate('/profile'), 600);
          return;
        }
        const err = await res.json().catch(() => ({}));
        setMessage(err.error || 'Failed to claim authentication token. Please try signing in again.');
      } catch (err) {
        setMessage('Network error while claiming token. Please try again.');
      } finally {
        inFlight = false;
      }
    };

    claim();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow text-center">
        <h2 className="text-xl font-semibold mb-2">{message}</h2>
        <p className="text-sm text-gray-600">
          If you are not redirected automatically,{' '}
          {isSuccess ? (
            <a href="/profile" className="text-blue-600 underline">go to your profile</a>
          ) : (
            <a href="/login" className="text-blue-600 underline">click here to sign in</a>
          )}
        </p>
      </div>
    </div>
  );
}
