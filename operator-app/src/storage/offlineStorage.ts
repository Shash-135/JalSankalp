import AsyncStorage from '@react-native-async-storage/async-storage';
import { PumpLog } from '../services/pumpService';

const PENDING_LOGS_KEY = 'jansankalp_pending_logs';

export const savePendingLog = async (log: PumpLog) => {
  const existing = await getPendingLogs();
  existing.push(log);
  await AsyncStorage.setItem(PENDING_LOGS_KEY, JSON.stringify(existing));
};

export const getPendingLogs = async (): Promise<PumpLog[]> => {
  const raw = await AsyncStorage.getItem(PENDING_LOGS_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const clearPendingLogs = async () => {
  await AsyncStorage.removeItem(PENDING_LOGS_KEY);
};
