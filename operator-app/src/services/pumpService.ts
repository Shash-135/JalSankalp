import api from './api';

export type PumpLog = {
  pump_id: string;
  operator_id: string;
  start_time: string;
  end_time?: string;
};

export const fetchPumpById = async (pumpId: string) => {
  const { data } = await api.get(`/pumps/${pumpId}`);
  return data;
};

export const startPump = async (payload: PumpLog) => {
  const { data } = await api.post('/pump/start', payload);
  return data;
};

export const stopPump = async (payload: PumpLog) => {
  const { data } = await api.post('/pump/stop', payload);
  return data;
};

export const syncLogs = async (logs: PumpLog[]) => {
  const { data } = await api.post('/pump/sync', { logs });
  return data;
};
