import axios from 'axios';

// Create a new axios instance
const api = axios.create({
  // baseURL reads from environment, falling back to production API host
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://api.snatchers.in',
  // send cookies if backend uses cookie sessions; adjust if using token-only
  withCredentials: true,
});

// Request interceptor: attach token from localStorage
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {}
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 by clearing token and redirecting to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      if (error && error.response && error.response.status === 401) {
        // Clear any locally stored token so future requests won't include it
        localStorage.removeItem('token');
        // Emit an event so the app can handle unauthorized state explicitly
        try {
          window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail: { status: 401 } }));
        } catch (e) {
          // fallback: simple event for older browsers
          const ev = document.createEvent && document.createEvent('Event');
          if (ev && ev.initEvent) {
            ev.initEvent('auth:unauthorized', true, true);
            try { window.dispatchEvent(ev); } catch (ignore) {}
          }
        }
        // Do NOT perform a global redirect here — callers should decide how to react.
      }
    } catch (e) {}
    return Promise.reject(error);
  }
);

export default api;
