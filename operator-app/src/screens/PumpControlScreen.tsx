import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import CustomButton from '../components/CustomButton';
import { Colors } from '../constants/colors';
import { startPump, stopPump } from '../services/pumpService';
import { savePendingLog } from '../storage/offlineStorage';
import { formatTime } from '../utils/formatters';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'PumpControl'>;

const PumpControlScreen: React.FC<Props> = ({ route }) => {
  const pump = route.params?.pump;
  const operatorId = 'OP-001';
  const [active, setActive] = useState(false);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    const now = new Date().toISOString();
    setLoading(true);
    try {
      await startPump({ pump_id: pump.id, operator_id: operatorId, start_time: now });
      setStartTime(now);
      setActive(true);
    } catch (err) {
      Alert.alert('Offline or error', 'Will store log locally.');
      await savePendingLog({ pump_id: pump.id, operator_id: operatorId, start_time: now });
      setStartTime(now);
      setActive(true);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    const end = new Date().toISOString();
    setLoading(true);
    try {
      await stopPump({ pump_id: pump.id, operator_id: operatorId, start_time: startTime || end, end_time: end });
    } catch (err) {
      Alert.alert('Offline or error', 'Saving stop log locally for sync.');
      await savePendingLog({ pump_id: pump.id, operator_id: operatorId, start_time: startTime || end, end_time: end });
    } finally {
      setActive(false);
      setStartTime(null);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Pump Control</Text>
        <Text style={styles.sub}>Pump: {pump?.name}</Text>
        <Text style={styles.sub}>Status: {active ? 'Running' : 'Stopped'}</Text>
        {startTime && <Text style={styles.sub}>Started at: {formatTime(startTime)}</Text>}
      </View>
      {!active ? (
        <CustomButton title="Start Pump" onPress={handleStart} loading={loading} />
      ) : (
        <CustomButton title="Stop Pump" onPress={handleStop} loading={loading} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.bg },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  title: { fontSize: 20, fontWeight: '700', color: Colors.ink },
  sub: { fontSize: 15, color: Colors.muted, marginTop: 6 },
});

export default PumpControlScreen;
