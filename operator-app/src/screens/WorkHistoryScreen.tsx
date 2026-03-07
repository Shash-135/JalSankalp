import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text } from 'react-native';
import LogCard, { PumpLog } from '../components/LogCard';
import { COLORS, SPACING } from '../constants';
import { getOfflineLogs } from '../storage/offlineStorage';
import { fetchWorkHistory } from '../services/pumpService';

const WorkHistoryScreen: React.FC = () => {
  const [logs, setLogs] = useState<PumpLog[]>([]);
  const [pending, setPending] = useState<PumpLog[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    try {
      const remote = await fetchWorkHistory();
      setLogs(remote);
    } catch (error) {
      // Keep last good value
    }
    const offline = await getOfflineLogs();
    setPending(offline);
    setRefreshing(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: SPACING.lg }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
    >
      <Text style={styles.title}>Today & recent logs</Text>
      {logs.length === 0 ? <Text style={styles.text}>No logs yet.</Text> : logs.map(l => <LogCard key={`${l.pump_id}-${l.start_time}`} log={l} />)}

      <Text style={[styles.title, { marginTop: SPACING.lg }]}>Pending sync</Text>
      {pending.length === 0 ? (
        <Text style={styles.text}>No offline logs.</Text>
      ) : (
        pending.map(l => <LogCard key={`${l.pump_id}-${l.start_time}-pending`} log={l} />)
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  text: { color: COLORS.muted, marginBottom: SPACING.sm },
});

export default WorkHistoryScreen;
