import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

type Props = {
  status?: 'Active' | 'Inactive' | 'Maintenance' | 'Unknown' | string;
};

const colorMap: Record<string, string> = {
  Active: Colors.success,
  Inactive: Colors.danger,
  Maintenance: Colors.warning,
  Unknown: Colors.muted,
};

const StatusBadge: React.FC<Props> = ({ status = 'Unknown' }) => {
  const color = colorMap[status] || Colors.muted;
  return (
    <View style={[styles.badge, { backgroundColor: color + '20' }]}>
      <Text style={[styles.text, { color }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
  },
});

export default StatusBadge;
