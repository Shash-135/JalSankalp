import { Colors } from '../constants/colors';

export const spacing = (value: number) => value * 8;

export const cardStyle = {
  backgroundColor: Colors.surface,
  borderRadius: 16,
  padding: spacing(2),
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

export const typography = {
  title: { fontSize: 22, fontWeight: '700', color: Colors.ink },
  subtitle: { fontSize: 16, fontWeight: '600', color: Colors.muted },
  body: { fontSize: 15, color: Colors.ink },
  label: { fontSize: 14, fontWeight: '600', color: Colors.muted },
};
