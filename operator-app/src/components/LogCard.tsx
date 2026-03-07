import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants';
import { formatTime, formatDurationHours } from '../utils/time';

export type PumpLog = {
  pump_id: string;
  operator_id: string;
  start_time: string;
  end_time?: string;
  durationMs?: number;
  status?: string;
};

type Props = {
  log: PumpLog;
};

const LogCard: React.FC<Props> = ({ log }) => {
  const duration = log.durationMs
    ? formatDurationHours(log.durationMs)
    : log.end_time && log.start_time
      ? formatDurationHours(new Date(log.end_time).getTime() - new Date(log.start_time).getTime())
      : 'In progress';

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Pump</Text>
        <Text style={styles.value}>{log.pump_id}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Start</Text>
        <Text style={styles.value}>{formatTime(log.start_time)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>End</Text>
        <Text style={styles.value}>{log.end_time ? formatTime(log.end_time) : 'Pending'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Duration</Text>
        <Text style={styles.value}>{duration}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  label: {
    color: COLORS.muted,
    fontWeight: '600',
  },
  value: {
    color: COLORS.text,
    fontWeight: '600',
  },
});

export default LogCard;
