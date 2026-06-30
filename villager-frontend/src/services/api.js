import axios from 'axios';

const api = axios.create({
  
  
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  
  
  const token = localStorage.getItem('villager_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  return config;
});

export default api;
