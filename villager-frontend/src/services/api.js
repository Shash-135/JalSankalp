import axios from 'axios';

const api = axios.create({
  baseURL: `http://${window.location.hostname}:5000/api`,
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  // Villagers generally do not use persistent JWT tokens for the basic public flows, 
  // but if an OTP flow stores a 'villager_token', we attach it here.
  const token = localStorage.getItem('villager_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  return config;
});

export default api;
