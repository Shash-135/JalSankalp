
const runtimeBase = (typeof process !== 'undefined' && process.env && (process.env.API_BASE_URL || process.env.EXPO_PUBLIC_API_URL)) || '';
export const API_BASE_URL = runtimeBase.trim() || 'http://10.147.130.206:5000/api';


export const OFFLINE_MODE = false;

export const COLORS = {
  primary:     '#1a3a8f',   
  primaryDark: '#0f2666',   
  accent:      '#ea580c',   
  secondary:   '#0f766e',
  background:  '#eef2ff',   
  card:        '#ffffff',
  cardBorder:  '#e4e9f5',
  text:        '#0f172a',
  muted:       '#64748b',
  success:     '#059669',
  danger:      '#dc2626',
  warning:     '#d97706',
  running:     '#16a34a',   
};

export const SPACING = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
};

export const RADIUS = {
  sm:  8,
  md:  12,
  lg:  16,
  xl:  24,
};

export const STORAGE_KEYS = {
  token: 'operator_token',
  operator: 'operator_profile',
  tokenExp: 'operator_token_exp',
  offlineLogs: 'offline_pump_logs',
};
