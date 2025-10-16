import React, { useState } from "react";
import { useEffect } from "react";
import GoogleSignIn from '../components/GoogleSignIn';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../contexts/AuthContext.jsx";
import axios from 'axios';

export default function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [existingServerUser, setExistingServerUser] = useState(null);

  async function handleAuth() {
    // If server-side auth is enabled, redirect to backend's OIDC login route
    const useServer = process.env.REACT_APP_USE_SERVER_AUTH === 'true';
    if (useServer) {
      // Redirect to backend OIDC login URL
      let backend = (process.env.REACT_APP_API_BASE_URL || '').replace(/\/$/, '');
      if (!backend) {
        try {
          const origin = window.location.origin || '';
          if (origin.includes(':3000')) {
            backend = origin.replace(':3000', ':5000');
          } else {
            // fallback to localhost:5000 if we can't infer
            backend = 'http://localhost:5000';
          }
        } catch (e) {
          backend = 'http://localhost:5000';
        }
      }
  // backend may be provided via REACT_APP_API_BASE_URL; ensure we always hit
  // the API path on the backend which mounts Express routes under `/api`
  const handleAuth = async () => {
  // ... (keep the other variable definitions)

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/login`, // The correct API endpoint
      {
        email: email,       // The email from your form's state
        password: password, // The password from your form's state
      },
      {
        withCredentials: true, // IMPORTANT: This sends the session cookie
      }
    );

    // If login is successful, you can navigate to the dashboard
    console.log("Login successful:", response.data);
    navigate("/dashboard"); // Or wherever you want to go after login

  } catch (error) {
    console.error("Login failed:", error);
    // Here you would show an error message to the user
    toast.error("Invalid credentials or server error.");
  }
};
    }
    try {
      // If server-side auth is enabled, call the backend directly with email/password
      if (process.env.REACT_APP_USE_SERVER_AUTH === 'true') {
        try {
          const emailNormalized = String(email || '').trim().toLowerCase();
          const res = await axios.post('/api/login', { email: emailNormalized, password }, { withCredentials: true });
          console.log('Server login result:', res.data);
          toast.success('Login successful!');
          setTimeout(() => navigate('/'), 1000);
          return;
        } catch (err) {
          const msg = err?.response?.data?.error || err.message || 'Unknown error';
          toast.error('Auth error: ' + msg);
          return;
        }
      }

      // Otherwise use Cognito auth (SPA) as before
      const session = await login(email, password);
      const idToken = session.getIdToken().getJwtToken();
      try {
        const res = await axios.post(`/api/login`, { idToken });
        const data = res.data;
        localStorage.setItem('token', data.token);
        const userRes = await axios.get(`/api/user/me`, { headers: { Authorization: `Bearer ${data.token}` } });
        console.log('Authenticated user (Cognito):', userRes.data);
        toast.success('Login successful!');
        setTimeout(() => navigate('/'), 1500);
      } catch (err) {
        const msg = err?.response?.data?.error || err.message || 'Unknown error';
        toast.error('Backend error: ' + msg);
        return;
      }
    } catch (error) {
      toast.error('Auth error: ' + error.message);
    }
  }

  // When using server-side auth, check on mount if the server session already exists.
  // Do NOT auto-redirect; just detect and let the tester decide to continue.
  useEffect(() => {
    const useServer = process.env.REACT_APP_USE_SERVER_AUTH === 'true';
    if (!useServer) return;
    (async () => {
      try {
        const res = await fetch(`/api/user/me`, { credentials: 'include', cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setExistingServerUser(data.user || data);
          console.log('Server session detected (no auto-redirect):', data.user || data);
        }
      } catch (err) {
        // ignore, user not logged in
      }
    })();
  }, []);



  return (
    <>
      <ToastContainer position="top-center" autoClose={1500} hideProgressBar />
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50"
        style={{ fontFamily: "'Italiana', serif" }}
      >
        <div className="w-full max-w-md p-8 border-2 border-red-600 rounded-lg shadow-lg bg-white text-center">
          <h2 className="text-3xl font-semibold text-red-600 mb-8">Authenticate</h2>
          {existingServerUser ? (
            <div>
              <p className="mb-4">Detected server session for <strong>{existingServerUser.email}</strong>.</p>
              <button
                onClick={() => navigate('/profile')}
                className="w-full py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
              >
                Continue to profile
              </button>
              <div className="text-sm text-gray-500 mt-3">Or sign in with a different account below.</div>
            </div>
          ) : null}

          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="mb-2 p-2 border" />
          <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" className="mb-4 p-2 border" />
          <div className="text-sm text-gray-600 mb-3">Don't have an account? <a href="/register" className="text-red-600 font-semibold">Register</a></div>
          <button
            onClick={handleAuth}
            className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
          >
            Login
          </button>
          
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Or sign in with</p>
            {/* Lazy-load Google sign-in button */}
            <React.Suspense fallback={<div>Loading sign-in...</div>}>
              <GoogleSignIn
                onSuccess={(data) => {
                  console.log('Google login success', data);
                  // After server session is established, navigate home
                  navigate('/');
                }}
                onError={(err) => {
                  console.error('Google login error', err);
                  toast.error('Google login failed');
                }}
              />
            </React.Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
