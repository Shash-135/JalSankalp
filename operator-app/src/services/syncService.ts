import NetInfo from '@react-native-community/netinfo';
import { PumpLog } from '../components/LogCard';
import { getOfflineLogs, clearOfflineLogs, replaceOfflineLogs } from '../storage/offlineStorage';
import { syncPumpLogs } from './pumpService';
import { OFFLINE_MODE } from '../constants';

export const syncOfflineLogs = async () => {
  if (OFFLINE_MODE) {
    return { synced: true, message: 'Offline mode enabled; skipping sync.' };
  }

  const net = await NetInfo.fetch();
  if (!net.isConnected) {
    return { synced: false, reason: 'offline' };
  }

  const logs = await getOfflineLogs();
  if (!logs.length) {
    return { synced: true, message: 'No pending logs' };
  }

  try {
    await syncPumpLogs(logs);
    await clearOfflineLogs();
    return { synced: true, count: logs.length };
  } catch (error) {
    // Keep logs but avoid duplicates
    await replaceOfflineLogs(logs);
    return { synced: false, reason: 'server', error };
  }
};

export const queueOfflineLog = async (log: PumpLog) => {
  await replaceOfflineLogs([log, ...((await getOfflineLogs()) || [])]);
};
