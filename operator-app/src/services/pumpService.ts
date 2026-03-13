import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { PumpLog } from '../components/LogCard';
import { STORAGE_KEYS } from '../constants';

// ─── Single unified offline queue ──────────────────────────────────────────
// All offline logs are stored under STORAGE_KEYS.offlineLogs so that
// syncService.ts and pumpService.ts share the same queue and "Sync" button works.

export type Pump = {
  id: string;
  name: string;
  location?: string;
  status?: string;
  lastServiced?: string;
  operatorName?: string;
  lastOperationTime?: string;
  qrCode?: string;
};

type ActionPayload = {
  action: 'start' | 'stop' | 'report';
  pump_id: string;
  operator_id?: string;
  timestamp?: string;
  notes?: string;
  photoUri?: string;
  duration?: number;
  mobile?: string;
  name?: string;
};

// ─── Offline queue helpers (use shared STORAGE_KEYS.offlineLogs) ────────────

export const getOfflineQueue = async (): Promise<ActionPayload[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.offlineLogs);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveToOfflineQueue = async (payload: ActionPayload) => {
  const queue = await getOfflineQueue();
  queue.push(payload);
  await AsyncStorage.setItem(STORAGE_KEYS.offlineLogs, JSON.stringify(queue));
};

// ─── Called by syncService.ts ───────────────────────────────────────────────
export const syncPumpLogs = async (logs: PumpLog[]) => {
  const rawLogs = logs.filter(l => l.action === 'start' || l.action === 'stop');
  const reports = logs.filter(l => l.action === 'report');

  if (rawLogs.length > 0) {
    await api.post('/pump/sync', { logs: rawLogs });
  }

  for (const report of reports) {
    const formData = new FormData();
    formData.append('pump_id', report.pump_id);
    formData.append('issue_type', 'maintenance');
    if (report.notes)    formData.append('description', report.notes);
    if ((report as any).mobile) formData.append('mobile', (report as any).mobile);
    if ((report as any).name)   formData.append('name',   (report as any).name);
    if ((report as any).photoUri) {
      formData.append('photo', {
        uri:  (report as any).photoUri,
        type: 'image/jpeg',
        name: 'maintenance.jpg',
      } as any);
    }
    await api.post('/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
};

// ─── pumpService.ts sync (also used by App.tsx NetInfo listener) ────────────
export const syncOfflineLogs = async () => {
  const isOnline = await NetInfo.fetch().then(s => s.isConnected);
  if (!isOnline) return { status: 'offline' };

  const queue = await getOfflineQueue();
  if (queue.length === 0) return { status: 'synced', count: 0 };

  try {
    await syncPumpLogs(queue as unknown as PumpLog[]);
    await AsyncStorage.removeItem(STORAGE_KEYS.offlineLogs);
    return { status: 'synced', count: queue.length };
  } catch (err) {
    console.error('Offline sync failed', err);
    return { status: 'error', count: queue.length };
  }
};

// ─── Pump API calls ─────────────────────────────────────────────────────────

export const fetchPump = async (qrCodeValue: string): Promise<Pump> => {
  const res = await api.get(`/pumps/qr/${encodeURIComponent(qrCodeValue)}`);
  const p = res.data;
  return {
    id:                String(p.id),
    qrCode:            p.qr_code || qrCodeValue,
    name:              p.name,
    location:          p.location,
    status:            p.status,
    lastServiced:      p.created_at,
    operatorName:      p.operator_name,
    lastOperationTime: p.last_operation_time,
  };
};

export const startPump = async (payload: { pumpId: string; operatorId: string; startTime: string }) => {
  const isOnline = await NetInfo.fetch().then(s => s.isConnected);
  if (!isOnline) {
    await saveToOfflineQueue({
      action:    'start',
      pump_id:   payload.pumpId,
      timestamp: payload.startTime,
      notes:     '',
    });
    return { status: 'queued_offline', offline: true };
  }

  const res = await api.post('/pump/start', {
    pump_id: payload.pumpId,
    notes:   '',
  });
  return res.data;
};

export const stopPump = async (payload: { pumpId: string; operatorId: string; endTime: string }) => {
  const isOnline = await NetInfo.fetch().then(s => s.isConnected);
  if (!isOnline) {
    await saveToOfflineQueue({
      action:    'stop',
      pump_id:   payload.pumpId,
      timestamp: payload.endTime,
      notes:     '',
    });
    return { status: 'queued_offline', offline: true };
  }

  const res = await api.post('/pump/stop', {
    pump_id: payload.pumpId,
    notes:   '',
  });
  return res.data;
};

export const fetchWorkHistory = async (): Promise<PumpLog[]> => {
  const res = await api.get('/pump/logs');
  return res.data || [];
};

export const submitMaintenance = async (payload: {
  pumpId: string;
  operatorId: string;
  operatorMobile?: string;
  operatorName?: string;
  comment: string;
  photoUri?: string;
}) => {
  const isOnline = await NetInfo.fetch().then(s => s.isConnected);
  if (!isOnline) {
    await saveToOfflineQueue({
      action:   'report',
      pump_id:  payload.pumpId,
      notes:    payload.comment,
      photoUri: payload.photoUri,
      mobile:   payload.operatorMobile,
      name:     payload.operatorName,
    });
    return { status: 'queued_offline', offline: true };
  }

  const formData = new FormData();
  formData.append('pump_id',     payload.pumpId);
  formData.append('description', payload.comment);
  formData.append('issue_type',  'maintenance');
  if (payload.operatorMobile) formData.append('mobile', payload.operatorMobile);
  if (payload.operatorName)   formData.append('name',   payload.operatorName);
  if (payload.photoUri) {
    formData.append('photo', {
      uri:  payload.photoUri,
      type: 'image/jpeg',
      name: 'maintenance.jpg',
    } as any);
  }

  const res = await api.post('/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};
