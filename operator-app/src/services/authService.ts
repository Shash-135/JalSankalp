import api from './api';
import { Operator } from '../context/AuthContext';
import { OFFLINE_MODE } from '../constants';
import { decode as atob } from 'base-64';

type LoginPayload = {
  mobile: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: Operator;
  exp?: number;
};

const parseJwtExp = (token: string): number | undefined => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return typeof decoded.exp === 'number' ? decoded.exp : undefined;
  } catch {
    return undefined;
  }
};

export const loginRequest = async (payload: LoginPayload): Promise<LoginResponse> => {
  if (OFFLINE_MODE) {
    // In strict offline mode, simulate success if we have cached creds, but for now we reject
    throw new Error("Offline login without cached credentials is not supported yet.");
  }

  const response = await api.post('/auth/login', {
    mobile: payload.mobile,
    password: payload.password,
  });
  const data = response.data;
  const exp = parseJwtExp(data.token);
  return {
    token: data.token,
    user: data.user,
    exp,
  };
};
