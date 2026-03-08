import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { STORAGE_KEYS } from '../constants';
import { loginRequest } from '../services/authService';
import { onUnauthorized } from '../services/apiEvents';

export type Operator = {
  id: string;
  name: string;
  mobile?: string;
};

type AuthContextType = {
  token: string | null;
  operator: Operator | null;
  loading: boolean;
  login: (opts: { mobile: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [loading, setLoading] = useState(true);

  const isStoredTokenValid = useCallback(async () => {
    const expString = await AsyncStorage.getItem(STORAGE_KEYS.tokenExp);
    if (!expString) return false;
    const exp = Number(expString);
    if (!Number.isFinite(exp)) return false;
    const nowSec = Date.now() / 1000;
    return exp > nowSec;
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [{ isConnected }] = await Promise.all([NetInfo.fetch()]);
        const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.token);
        const storedProfile = await AsyncStorage.getItem(STORAGE_KEYS.operator);
        const tokenValid = await isStoredTokenValid();

        // Allow offline resume only with a valid (unexpired) cached token + profile
        if (storedToken && storedProfile && tokenValid) {
          setToken(storedToken);
          setOperator(JSON.parse(storedProfile));
        } else if (isConnected && storedToken && storedProfile) {
          // If online but exp missing/expired, force clean slate to avoid using stale creds
          await AsyncStorage.multiRemove([STORAGE_KEYS.token, STORAGE_KEYS.operator, STORAGE_KEYS.tokenExp]);
        }
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const handleLogin = useCallback(async ({ mobile, password }: { mobile: string; password: string }) => {
    try {
      const result = await loginRequest({ mobile, password });
      if (result?.token && result?.user) {
        setToken(result.token);
        setOperator(result.user);
        await AsyncStorage.setItem(STORAGE_KEYS.token, result.token);
        await AsyncStorage.setItem(STORAGE_KEYS.operator, JSON.stringify(result.user));
        if (result.exp) {
          await AsyncStorage.setItem(STORAGE_KEYS.tokenExp, String(result.exp));
        }
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
    await AsyncStorage.multiRemove([STORAGE_KEYS.token, STORAGE_KEYS.operator, STORAGE_KEYS.tokenExp]);
  }, []);

  useEffect(() => {
    // Auto-logout when API reports unauthorized (expired/invalid token)
    const unsubscribe = onUnauthorized(() => {
      logout();
    });
    return unsubscribe;
  }, [logout]);

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
