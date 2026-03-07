import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants';

type Props = {
  label: string;
  status?: 'success' | 'danger' | 'warning' | 'info';
};

const StatusBadge: React.FC<Props> = ({ label, status = 'info' }) => {
  const background = {
    success: COLORS.success,
    danger: COLORS.danger,
    warning: COLORS.warning,
    info: COLORS.primary,
  }[status];

  return (
    <View style={[styles.badge, { backgroundColor: background }]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    alignSelf: 'flex-start',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
});

export default StatusBadge;
