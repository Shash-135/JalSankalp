import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  return config;
});

// Add a response interceptor to handle 401s globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the server tells us the token is invalid/expired
    if (error.response && error.response.status === 401) {
      // 1. Wipe out the invalid token
      localStorage.removeItem('admin_token');
      // 2. Force the browser to gracefully redirect (avoids React Router cyclic dependancy here)
      if (window.location.pathname !== '/login') {
         window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
