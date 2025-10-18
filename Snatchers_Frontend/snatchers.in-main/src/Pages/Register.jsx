import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from '../api';

export default function Register() {
  const navigate = useNavigate();
  // If user is already authenticated, redirect to profile
  React.useEffect(() => {
    (async () => {
      try {
        const useServer = process.env.REACT_APP_USE_SERVER_AUTH === 'true';
        if (useServer) {
          // server-session check: call the backend host directly so Nginx doesn't intercept
          const res = await fetch((process.env.REACT_APP_API_BASE_URL || 'https://api.snatchers.in') + '/api/user/me', { credentials: 'include', cache: 'no-store' });
          if (res.ok) {
            navigate('/profile');
            return;
          }
        }
        // Check local token or Cognito session
        const token = localStorage.getItem('token');
        if (token) {
          navigate('/profile');
          return;
        }
        // If Cognito is used client-side, the Cognito Auth Provider will prevent register page in many flows
      } catch (e) {
        // ignore
      }
    })();
  }, [navigate]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  async function handleRegister() {
    try {
      const emailNormalized = String(email || '').trim().toLowerCase();
      const res = await api.post('/register', { email: emailNormalized, password, name });
      toast.success('Registration successful! Redirecting...');
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Unknown error';
      toast.error('Register error: ' + msg);
    }
  }

  return (
    <>
      <ToastContainer position="top-center" autoClose={1500} hideProgressBar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50" style={{ fontFamily: "'Italiana', serif" }}>
        <div className="w-full max-w-md p-8 border-2 border-red-600 rounded-lg shadow-lg bg-white text-center">
          <h2 className="text-3xl font-semibold text-red-600 mb-8">Register</h2>
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full name (optional)" className="mb-2 p-2 border" />
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="mb-2 p-2 border" />
          <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" className="mb-4 p-2 border" />
          <button onClick={handleRegister} className="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition">Create account</button>
          <div className="mt-4 text-sm text-gray-600">Already have an account? <a href="/login" className="text-red-600 font-semibold">Sign in</a></div>
        </div>
      </div>
    </>
  );
}
