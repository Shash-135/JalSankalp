import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const TOKEN_KEY = 'jansankalp_operator_token';

export const login = async (mobile: string, password: string) => {
  const { data } = await api.post('/auth/operator/login', { mobile, password });
  const token = data?.token as string | undefined;
  if (token) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }
  return token;
};

export const logout = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

export const getStoredToken = async () => AsyncStorage.getItem(TOKEN_KEY);

export const setAuthHeader = (token?: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};
