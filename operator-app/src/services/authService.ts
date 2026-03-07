import api from './api';
import { Operator } from '../context/AuthContext';
import { OFFLINE_MODE } from '../constants';

type LoginPayload = {
  operatorId: string;
  password: string;
};

type LoginResponse = {
  token: string;
  operator: Operator;
};

export const loginRequest = async (payload: LoginPayload): Promise<LoginResponse> => {
  if (OFFLINE_MODE) {
    // In strict offline mode, simulate success if we have cached creds, but for now we reject
    throw new Error("Offline login without cached credentials is not supported yet.");
  }

  const response = await api.post('/auth/login', {
    operator_id: payload.operatorId,
    password: payload.password,
  });
  const data = response.data;
  return {
    token: data.token,
    operator: data.operator ?? { id: payload.operatorId, name: data?.name ?? 'Operator' },
  };
};
