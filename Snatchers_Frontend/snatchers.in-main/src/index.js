import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <WishlistProvider>
        <App />
      </WishlistProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
