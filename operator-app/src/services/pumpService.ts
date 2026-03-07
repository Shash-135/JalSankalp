import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { PumpLog } from '../components/LogCard';

const OFFLINE_QUEUE_KEY = '@pump_offline_queue';

export type Pump = {
  id: string;
  name: string;
  location?: string;
  status?: string;
  lastServiced?: string;
};

type ActionPayload = {
  action: 'start' | 'stop' | 'report';
  pump_id: string;
  operator_id?: string;
  timestamp?: string;
  notes?: string;
  photoUri?: string;
  duration?: number;
};

const getOfflineQueue = async (): Promise<ActionPayload[]> => {
  try {
    const queueData = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
    return queueData ? JSON.parse(queueData) : [];
  } catch (e) {
    return [];
  }
};

const saveToOfflineQueue = async (payload: ActionPayload) => {
  const queue = await getOfflineQueue();
  queue.push(payload);
  await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
};

export const syncOfflineLogs = async () => {
  const isOnline = await NetInfo.fetch().then(s => s.isConnected);
  if (!isOnline) return { status: 'offline' };

  const queue = await getOfflineQueue();
  if (queue.length === 0) return { status: 'synced', count: 0 };

  try {
    // Separate logs and reports (reports need multipart)
    const rawLogs = queue.filter(item => item.action === 'start' || item.action === 'stop');
    const reports = queue.filter(item => item.action === 'report');

    if (rawLogs.length > 0) {
      await api.post('/pump/sync', { logs: rawLogs });
    }

    for (const report of reports) {
      const formData = new FormData();
      formData.append('pump_id', report.pump_id);
      if (report.notes) formData.append('comment', report.notes);
      if (report.photoUri) {
        formData.append('photo', {
          uri: report.photoUri,
          type: 'image/jpeg',
          name: 'maintenance.jpg',
        } as any);
      }
      await api.post('/pump/report', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    // Clear queue upon success
    await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
    return { status: 'synced', count: queue.length };
  } catch (err) {
    console.error('Offline sync failed', err);
    return { status: 'error', count: queue.length };
  }
};

export const fetchPump = async (qrCodeValue: string): Promise<Pump> => {
  // The QR code contains the qr_code string from the database (same as villager frontend).
  // We look up the pump by its QR value using the shared public endpoint.
  const res = await api.get(`/pumps/qr/${encodeURIComponent(qrCodeValue)}`);
  const p = res.data;
  return {
     id: String(p.id),   // This is the real numeric pump ID used for start/stop operations
     name: p.name,
     location: p.location,
     status: p.status,
     lastServiced: p.created_at
  };
};

export const startPump = async (payload: { pumpId: string; operatorId: string; startTime: string }) => {
  const isOnline = await NetInfo.fetch().then(s => s.isConnected);
  if (!isOnline) {
    await saveToOfflineQueue({
      action: 'start',
      pump_id: payload.pumpId,
      timestamp: payload.startTime,
      notes: ''
    });
    return { status: 'queued_offline', offline: true };
  }

  const res = await api.post('/pump/start', {
    pump_id: payload.pumpId,
    notes: '',
  });
  return res.data;
};

export const stopPump = async (payload: { pumpId: string; operatorId: string; endTime: string }) => {
  const isOnline = await NetInfo.fetch().then(s => s.isConnected);
  if (!isOnline) {
    await saveToOfflineQueue({
      action: 'stop',
      pump_id: payload.pumpId,
      timestamp: payload.endTime,
      notes: ''
    });
    return { status: 'queued_offline', offline: true };
  }

  const res = await api.post('/pump/stop', {
    pump_id: payload.pumpId,
    notes: '',
  });
  return res.data;
};

export const fetchWorkHistory = async (): Promise<PumpLog[]> => {
  const res = await api.get('/pump/logs');
  return res.data || [];
};

export const submitMaintenance = async (payload: { pumpId: string; operatorId: string; comment: string; photoUri?: string }) => {
  const isOnline = await NetInfo.fetch().then(s => s.isConnected);
  if (!isOnline) {
    await saveToOfflineQueue({
      action: 'report',
      pump_id: payload.pumpId,
      notes: payload.comment,
      photoUri: payload.photoUri
    });
    return { status: 'queued_offline', offline: true };
  }

  const formData = new FormData();
  formData.append('pump_id', payload.pumpId);
  formData.append('comment', payload.comment);
  if (payload.photoUri) {
    formData.append('photo', {
      uri: payload.photoUri,
      type: 'image/jpeg',
      name: 'maintenance.jpg',
    } as any);
  }
  const res = await api.post('/pump/report', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};
