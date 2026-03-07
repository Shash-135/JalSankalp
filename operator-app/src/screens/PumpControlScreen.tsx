import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import { COLORS, RADIUS, SPACING } from '../constants';
import { useAuth } from '../context/AuthContext';
import { addOfflineLog } from '../storage/offlineStorage';
import { startPump, stopPump } from '../services/pumpService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const PumpControlScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'PumpControl'>> = ({ route }) => {
  const { pumpId } = route.params;
  const { operator } = useAuth();
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    const now = new Date();
    try {
      setLoading(true);
      await startPump({ pumpId, operatorId: operator?.id || 'operator', startTime: now.toISOString() });
      setStartTime(now);
      Alert.alert('Pump started', 'Pump is now running.');
    } catch (error) {
      await addOfflineLog({
        pump_id: pumpId,
        operator_id: operator?.id || 'operator',
        start_time: now.toISOString(),
      });
      setStartTime(now);
      Alert.alert('Offline mode', 'Pump start saved offline and will sync when online.');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    const end = new Date();
    const usedStart = startTime || new Date(end.getTime() - 5 * 60 * 1000);
    try {
      setLoading(true);
      await stopPump({ pumpId, operatorId: operator?.id || 'operator', endTime: end.toISOString() });
      setStartTime(null);
      Alert.alert('Pump stopped', 'Log sent to server.');
    } catch (error) {
      await addOfflineLog({
        pump_id: pumpId,
        operator_id: operator?.id || 'operator',
        start_time: usedStart.toISOString(),
        end_time: end.toISOString(),
      });
      setStartTime(null);
      Alert.alert('Offline mode', 'Stop log saved offline and will sync when online.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Pump ID: {pumpId}</Text>
        <Text style={styles.subtitle}>
          {startTime ? `Running since ${startTime.toLocaleTimeString()}` : 'Pump is idle'}
        </Text>
        <CustomButton title="Start Pump" onPress={handleStart} disabled={!!startTime} loading={loading} />
        <CustomButton
          title="Stop Pump"
          type="secondary"
          onPress={handleStop}
          disabled={!startTime}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  subtitle: { color: COLORS.muted, marginBottom: SPACING.lg },
});

export default PumpControlScreen;
