import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import CustomButton from '../components/CustomButton';
import StatusBadge from '../components/StatusBadge';
import { COLORS, SPACING } from '../constants';
import { useAuth } from '../context/AuthContext';
import { syncOfflineLogs } from '../services/syncService';

const SettingsScreen: React.FC = () => {
  const { logout } = useAuth();
  const net = useNetInfo();
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    const res = await syncOfflineLogs();
    setSyncing(false);
    if (res.synced) {
      Alert.alert('Synced', res.message || 'Offline logs uploaded.');
    } else {
      Alert.alert('Not synced', res.reason === 'offline' ? 'No internet connection.' : 'Server issue.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Connection</Text>
        <StatusBadge label={net.isConnected ? 'Online' : 'Offline'} status={net.isConnected ? 'success' : 'warning'} />
      </View>

      <CustomButton title="Sync Offline Logs" onPress={handleSync} loading={syncing} />
      <CustomButton title="Logout" type="secondary" onPress={logout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  label: { fontSize: 16, fontWeight: '700', color: COLORS.text },
});

export default SettingsScreen;
