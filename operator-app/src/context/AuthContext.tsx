import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import { loginRequest } from '../services/authService';

export type Operator = {
  id: string;
  name: string;
  phone?: string;
};

type AuthContextType = {
  token: string | null;
  operator: Operator | null;
  loading: boolean;
  login: (opts: { operatorId: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.token);
        const storedProfile = await AsyncStorage.getItem(STORAGE_KEYS.operator);
        if (storedToken) {
          setToken(storedToken);
        }
        if (storedProfile) {
          setOperator(JSON.parse(storedProfile));
        }
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const handleLogin = useCallback(async ({ operatorId, password }: { operatorId: string; password: string }) => {
    try {
      const result = await loginRequest({ operatorId, password });
      if (result?.token) {
        setToken(result.token);
        setOperator(result.operator);
        await AsyncStorage.setItem(STORAGE_KEYS.token, result.token);
        await AsyncStorage.setItem(STORAGE_KEYS.operator, JSON.stringify(result.operator));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    setToken(null);
    setOperator(null);
    await AsyncStorage.multiRemove([STORAGE_KEYS.token, STORAGE_KEYS.operator]);
  }, []);

  const value = useMemo(
    () => ({ token, operator, loading, login: handleLogin, logout }),
    [token, operator, loading, handleLogin, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};
