import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants';
import { formatTime, formatDurationHours } from '../utils/time';

export type PumpLog = {
  id?: number;
  pump_id: string;
  operator_id: string;
  action: 'start' | 'stop' | 'report';
  timestamp: string;
  duration?: number;
  notes?: string;
  photo_url?: string;
  pump_name?: string;
};

type Props = { log: PumpLog };

const actionStyle: Record<string, { bg: string; border: string; text: string; label: string }> = {
  start:  { bg: '#dcfce7', border: '#86efac', text: COLORS.success,  label: '▶ START'  },
  stop:   { bg: '#f1f5f9', border: '#cbd5e1', text: '#475569',        label: '■ STOP'   },
  report: { bg: '#fef3c7', border: '#fcd34d', text: COLORS.warning,   label: '⚠ REPORT' },
};

const LogCard: React.FC<Props> = ({ log }) => {
  const a = actionStyle[log.action] || actionStyle.stop;
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.pumpName}>{log.pump_name || log.pump_id}</Text>
        <View style={[styles.actionBadge, { backgroundColor: a.bg, borderColor: a.border }]}>
          <Text style={[styles.actionText, { color: a.text }]}>{a.label}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>Time</Text>
        <Text style={styles.value}>{formatTime(log.timestamp)}</Text>
      </View>
      {log.action === 'stop' && log.duration !== undefined ? (
        <View style={styles.row}>
          <Text style={styles.label}>Duration</Text>
          <Text style={styles.value}>{log.duration} min</Text>
        </View>
      ) : null}
      {log.notes ? (
        <View style={styles.row}>
          <Text style={styles.label}>Notes</Text>
          <Text style={[styles.value, { flex: 1, textAlign: 'right' }]}>{log.notes}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md + 2,
    marginVertical: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  pumpName: {
    fontWeight: '800',
    color: COLORS.text,
    fontSize: 14,
    flex: 1,
    marginRight: SPACING.sm,
  },
  actionBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.cardBorder,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  label: { color: COLORS.muted, fontWeight: '600', fontSize: 13 },
  value: { color: COLORS.text, fontWeight: '700', fontSize: 13 },
});

export default LogCard;
