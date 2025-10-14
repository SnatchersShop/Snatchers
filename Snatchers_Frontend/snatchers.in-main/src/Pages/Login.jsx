import React, { useState } from "react";
import { useEffect } from "react";
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
      const loginUrl = `${backend}/login`;
      window.location.href = loginUrl;
      return;
    }
    try {
      const session = await login(email, password);
      const idToken = session.getIdToken().getJwtToken();
      try {
  const res = await axios.post(`/api/login`, { idToken });
  const data = res.data;
        localStorage.setItem("token", data.token); // 🔐 Store server JWT

        // 🔽 Fetch user data using the server JWT
        const userRes = await axios.get(`/api/user/me`, {
          headers: { Authorization: `Bearer ${data.token}` },
        });
        const userData = userRes.data;
        console.log("Authenticated user:", userData);

        toast.success("Login successful!");
        setTimeout(() => navigate("/"), 1500);
      } catch (err) {
        const msg = err?.response?.data?.error || err.message || 'Unknown error';
        toast.error("Backend error: " + msg);
        return;
      }
    } catch (error) {
      toast.error("Auth error: " + error.message);
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
          <button
            onClick={handleAuth}
            className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
}
