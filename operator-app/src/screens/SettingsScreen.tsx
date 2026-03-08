import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import CustomButton from '../components/CustomButton';
import StatusBadge from '../components/StatusBadge';
import { COLORS, RADIUS, SPACING, STORAGE_KEYS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { syncOfflineLogs } from '../services/syncService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    {children}
  </View>
);

const SettingsScreen: React.FC = () => {
  const { logout, operator } = useAuth();
  const net    = useNetInfo();
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    const res = await syncOfflineLogs();
    setSyncing(false);
    if (res.synced) {
      Alert.alert('Synced ✓', res.message || 'Offline logs uploaded successfully.');
    } else {
      Alert.alert('Not synced', res.reason === 'offline' ? 'No internet connection.' : 'Server issue. Try again later.');
    }
  };

  const clearQueue = async () => {
    Alert.alert('Clear Offline Data', 'Are you sure? Unsynced logs will be permanently lost.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: async () => {
        await AsyncStorage.removeItem(STORAGE_KEYS.offlineLogs);
        Alert.alert('Cleared', 'Offline logs have been wiped.');
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Operator info card */}
      {operator && (
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(operator.name || 'O')[0].toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.name}>{operator.name || 'Operator'}</Text>
            <Text style={styles.mobile}>{operator.mobile || '—'}</Text>
          </View>
        </View>
      )}

      {/* Settings rows */}
      <View style={styles.card}>
        <SettingsRow label="Connection">
          <StatusBadge
            label={net.isConnected ? 'Online' : 'Offline'}
            status={net.isConnected ? 'success' : 'warning'}
          />
        </SettingsRow>
        <View style={styles.divider} />
        <SettingsRow label="App Version">
          <Text style={styles.value}>1.0.0</Text>
        </SettingsRow>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <CustomButton title="Sync Offline Logs" onPress={handleSync} loading={syncing} type="primary" />
        <CustomButton title="Clear Offline Data" onPress={clearQueue} type="ghost" />
        <CustomButton title="Logout" type="danger" onPress={logout} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg },
  profileCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '900', fontSize: 20 },
  name:   { color: '#fff', fontWeight: '800', fontSize: 16 },
  mobile: { color: 'rgba(255,255,255,0.65)', fontWeight: '600', fontSize: 13 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  divider: { height: 1, backgroundColor: COLORS.cardBorder },
  rowLabel: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  value:    { fontSize: 14, fontWeight: '700', color: COLORS.muted },
  actions: { gap: SPACING.xs },
});

export default SettingsScreen;
