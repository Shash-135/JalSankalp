import AsyncStorage from '@react-native-async-storage/async-storage';
import { PumpLog } from '../components/LogCard';
import { STORAGE_KEYS } from '../constants';

export const getOfflineLogs = async (): Promise<PumpLog[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.offlineLogs);
  return raw ? JSON.parse(raw) : [];
};

export const addOfflineLog = async (log: PumpLog) => {
  const existing = await getOfflineLogs();
  const updated = [...existing, log];
  await AsyncStorage.setItem(STORAGE_KEYS.offlineLogs, JSON.stringify(updated));
};

export const clearOfflineLogs = async () => {
  await AsyncStorage.removeItem(STORAGE_KEYS.offlineLogs);
};

export const replaceOfflineLogs = async (logs: PumpLog[]) => {
  await AsyncStorage.setItem(STORAGE_KEYS.offlineLogs, JSON.stringify(logs));
};
