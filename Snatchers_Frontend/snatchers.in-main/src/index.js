import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { WishlistProvider } from './contexts/WishlistContext.jsx';
import axios from 'axios';

// Global axios defaults: include credentials so cookies (HTTP-only session) are sent
axios.defaults.withCredentials = true;
// If an API base URL is provided at build time, always use it. This lets the
// production build target the backend host (for example: https://api.zupra.online)
// while dev still benefits from the CRA proxy when env var is not set.
if (process.env.REACT_APP_API_BASE_URL) {
  axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
}

// Ensure Authorization header is attached when a token is present in localStorage.
// The app stores the token under the key 'token' (see Login.jsx). We use a
// request interceptor so the latest token is always picked up (in case it
// changes during the SPA lifetime).
axios.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('token');
    if (stored) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${stored}`;
    }
  } catch (e) {
    // ignore localStorage errors (e.g., SSR or privacy settings)
  }
  return config;
}, (error) => Promise.reject(error));

// Helper for logout flows to remove the local token and Authorization header
// (call this when you log out a user client-side)
export function clearAuthToken() {
  try { localStorage.removeItem('token'); } catch (e) {}
  try { delete axios.defaults.headers.common.Authorization; } catch (e) {}
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
