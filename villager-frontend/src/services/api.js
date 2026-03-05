import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.jansankalp.local',
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  return config;
});

export default api;
