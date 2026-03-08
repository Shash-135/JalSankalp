import NetInfo from '@react-native-community/netinfo';
import { getOfflineQueue, syncPumpLogs } from './pumpService';
import { OFFLINE_MODE } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

export const syncOfflineLogs = async () => {
  if (OFFLINE_MODE) {
    return { synced: true, message: 'Offline mode enabled; skipping sync.' };
  }

  const net = await NetInfo.fetch();
  if (!net.isConnected) {
    return { synced: false, reason: 'offline' };
  }

  // Use the single unified queue (same as pumpService.ts)
  const logs = await getOfflineQueue();
  if (!logs.length) {
    return { synced: true, message: 'No pending logs' };
  }

  try {
    await syncPumpLogs(logs as any);
    await AsyncStorage.removeItem(STORAGE_KEYS.offlineLogs);
    return { synced: true, message: `${logs.length} log(s) synced successfully.` };
  } catch (error) {
    console.error('Sync failed:', error);
    return { synced: false, reason: 'server', error };
  }
};
