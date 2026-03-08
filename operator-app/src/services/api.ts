import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';
import { emitUnauthorized } from './apiEvents';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.token);
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const status = error?.response?.status;
    if (status === 401) {
      await AsyncStorage.multiRemove([STORAGE_KEYS.token, STORAGE_KEYS.operator, STORAGE_KEYS.tokenExp]);
      emitUnauthorized();
    }
    return Promise.reject(error);
  },
);

export default api;
