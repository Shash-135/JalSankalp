import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import LogCard, { PumpLog } from '../components/LogCard';
import { COLORS, RADIUS, SPACING } from '../constants';
import { fetchWorkHistory, getOfflineQueue } from '../services/pumpService';

const SectionHeader: React.FC<{ title: string; count: number }> = ({ title, count }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {count > 0 && (
      <View style={styles.countBadge}>
        <Text style={styles.countText}>{count}</Text>
      </View>
    )}
  </View>
);

const WorkHistoryScreen: React.FC = () => {
  const [logs, setLogs]       = useState<PumpLog[]>([]);
  const [pending, setPending] = useState<PumpLog[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    try {
      const remote = await fetchWorkHistory();
      setLogs(remote);
    } catch { /* Keep last good value */ }
    const offline = await getOfflineQueue();
    setPending(offline.map(q => ({
      pump_id:     q.pump_id,
      operator_id: q.operator_id || 'unknown',
      action:      q.action,
      timestamp:   q.timestamp || new Date().toISOString(),
      duration:    q.duration,
      notes:       q.notes,
    })));
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} colors={[COLORS.primary]} />}
    >
      <SectionHeader title="Recent Logs" count={logs.length} />
      {logs.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>No logs found. Pull to refresh.</Text>
        </View>
      ) : (
        logs.map((l, i) => <LogCard key={l.id ? String(l.id) : `log-${i}`} log={l} />)
      )}

      <SectionHeader title="Pending Sync" count={pending.length} />
      {pending.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>All logs synced ✓</Text>
        </View>
      ) : (
        pending.map((l, i) => <LogCard key={`pending-${i}`} log={l} />)
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content:   { padding: SPACING.lg, paddingBottom: SPACING.xl },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  countBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  empty: { alignItems: 'center', paddingVertical: SPACING.lg },
  emptyIcon: { fontSize: 32, marginBottom: SPACING.xs },
  emptyText: { color: COLORS.muted, fontWeight: '600', fontSize: 13 },
});

export default WorkHistoryScreen;
