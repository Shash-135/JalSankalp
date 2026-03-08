import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants';

type Props = {
  label: string;
  status?: 'success' | 'danger' | 'warning' | 'info';
};

const palette = {
  success: { bg: '#dcfce7', border: '#86efac', text: COLORS.success, dot: COLORS.success },
  danger:  { bg: '#fee2e2', border: '#fca5a5', text: COLORS.danger,  dot: COLORS.danger  },
  warning: { bg: '#fef3c7', border: '#fcd34d', text: COLORS.warning, dot: COLORS.warning },
  info:    { bg: '#dbeafe', border: '#93c5fd', text: COLORS.primary, dot: COLORS.primary },
};

const StatusBadge: React.FC<Props> = ({ label, status = 'info' }) => {
  const p = palette[status];
  return (
    <View style={[styles.badge, { backgroundColor: p.bg, borderColor: p.border }]}>
      <View style={[styles.dot, { backgroundColor: p.dot }]} />
      <Text style={[styles.text, { color: p.text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontWeight: '700',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default StatusBadge;
