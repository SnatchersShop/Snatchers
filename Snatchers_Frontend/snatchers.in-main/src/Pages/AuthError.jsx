import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function AuthError() {
  const query = useQuery();
  const error = query.get('error') || 'unknown_error';
  const message = query.get('message') || '';

  const humanMessage = (() => {
    switch (error) {
      case 'redirect_mismatch':
        return 'Sign-in failed because the authentication service rejected the redirect URL. This usually means the application is misconfigured.';
      case 'access_denied':
        return 'Access was denied. You may have cancelled the sign-in process.';
      default:
        return 'An unexpected authentication error occurred.';
    }
  })();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-xl w-full bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-semibold mb-4">Authentication error</h1>
        <p className="mb-4">{humanMessage}</p>
        {message && (
          <div className="mb-4 text-sm text-gray-700">Details: {message}</div>
        )}

        <div className="flex gap-3">
          <a href="/login" className="inline-block px-4 py-2 bg-blue-600 text-white rounded">Try signing in again</a>
          <Link to="/" className="inline-block px-4 py-2 border rounded">Go to homepage</Link>
          <a href="mailto:support@yourdomain.com" className="inline-block px-4 py-2 text-sm text-gray-700">Contact support</a>
        </div>
      </div>
    </div>
  );
}
