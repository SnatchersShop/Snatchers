import React, { useState } from "react";
import { useEffect } from "react";
import GoogleSignIn from '../components/GoogleSignIn';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../contexts/AuthContext.jsx";
import axios from 'axios';
import api from '../api';

export default function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { getSession, currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [existingServerUser, setExistingServerUser] = useState(null);

  async function handleAuth() {
    const useServer = process.env.REACT_APP_USE_SERVER_AUTH === 'true';
    try {
      if (useServer) {
        const emailNormalized = String(email || '').trim().toLowerCase();
        const res = await api.post('/login', { email: emailNormalized, password });
        console.log('Server login result:', res.data);
        toast.success('Login successful!');
        setTimeout(() => navigate('/'), 1000);
        return;
      }

      // SPA (Cognito/local) path
      const session = await login(email, password);
      // Guard: session may be null in some dev modes
      const idToken = session && typeof session.getIdToken === 'function'
        ? (typeof session.getIdToken().getJwtToken === 'function' ? session.getIdToken().getJwtToken() : (session.getIdToken().getJwtToken && session.getIdToken().getJwtToken()))
        : null;

      if (!idToken) {
        toast.error('Failed to obtain identity token');
        return;
      }

      try {
        const res = await api.post(`/login`, { idToken });
        const data = res.data;
        localStorage.setItem('token', data.token);
        // Use the api instance which auto-attaches Authorization header
        const userRes = await api.get(`/user/me`);
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


  // Redirect authenticated users away from login/register pages.
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const useServer = process.env.REACT_APP_USE_SERVER_AUTH === 'true';
      try {
        if (useServer) {
          const backend = process.env.REACT_APP_API_BASE_URL || 'https://api.snatchers.in';
          const res = await fetch(backend + '/api/user/me', { credentials: 'include', cache: 'no-store' });
          if (res.ok) {
            navigate('/profile');
            return;
          }
        }

        // Check Cognito/session-based client auth
        try {
          const session = await getSession();
          if (session) {
            navigate('/profile');
            return;
          }
        } catch (e) {
          // ignore
        }

        // Fallback: check local token stored by the app
        const token = localStorage.getItem('token');
        if (token) {
          navigate('/profile');
          return;
        }
      } catch (err) {
        // ignore — leave user on login page
      }
    };
    checkAuthAndRedirect();
  }, [getSession, navigate]);



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
