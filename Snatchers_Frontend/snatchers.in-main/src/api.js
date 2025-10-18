import axios from 'axios';

// Create a new axios instance
const api = axios.create({
  // baseURL can be set via environment if needed
  baseURL: process.env.REACT_APP_API_BASE_URL || '',
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
        localStorage.removeItem('token');
        // redirect to login page
        window.location.href = '/login';
      }
    } catch (e) {}
    return Promise.reject(error);
  }
);

export default api;
