import { getPendingLogs, clearPendingLogs } from '../storage/offlineStorage';
import { syncLogs } from './pumpService';

export const syncPendingLogs = async () => {
  const pending = await getPendingLogs();
  if (!pending.length) return { synced: 0 };
  try {
    await syncLogs(pending);
    await clearPendingLogs();
    return { synced: pending.length };
  } catch (error: any) {
    return { synced: 0, error: error?.message };
  }
};
