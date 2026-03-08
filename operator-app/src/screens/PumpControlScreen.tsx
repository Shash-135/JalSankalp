import React, { useState, useEffect, useRef } from 'react';
import {
  Alert, SafeAreaView, StyleSheet, Text, View, Animated,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import { COLORS, RADIUS, SPACING } from '../constants';
import { useAuth } from '../context/AuthContext';
import { startPump, stopPump, saveToOfflineQueue } from '../services/pumpService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const PumpControlScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'PumpControl'>> = ({ route }) => {
  const { pumpId } = route.params;
  const { operator } = useAuth();
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed]     = useState(0);
  const [loading, setLoading]     = useState(false);
  const pulseAnim                 = useRef(new Animated.Value(1)).current;
  const timerRef                  = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pulse animation for running indicator
  useEffect(() => {
    if (startTime) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.4, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1,   duration: 800, useNativeDriver: true }),
        ])
      ).start();
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsed(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTime]);

  const formatElapsed = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStart = async () => {
    const now = new Date();
    try {
      setLoading(true);
      await startPump({ pumpId, operatorId: operator?.id || 'operator', startTime: now.toISOString() });
      setStartTime(now);
    } catch {
      await saveToOfflineQueue({ action: 'start', pump_id: pumpId, timestamp: now.toISOString() });
      setStartTime(now);
      Alert.alert('Offline mode', 'Pump start saved offline and will sync when online.');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    const end = new Date();
    try {
      setLoading(true);
      await stopPump({ pumpId, operatorId: operator?.id || 'operator', endTime: end.toISOString() });
      setStartTime(null);
      Alert.alert('Pump stopped', 'Log sent to server.');
    } catch {
      await saveToOfflineQueue({ action: 'stop', pump_id: pumpId, timestamp: end.toISOString() });
      setStartTime(null);
      Alert.alert('Offline mode', 'Stop log saved offline and will sync when online.');
    } finally {
      setLoading(false);
    }
  };

  const isRunning = !!startTime;

  return (
    <SafeAreaView style={styles.container}>
      {/* Status visual */}
      <View style={styles.statusCard}>
        <View style={styles.indicatorWrap}>
          <Animated.View style={[styles.pulseDot, {
            backgroundColor: isRunning ? COLORS.running : COLORS.muted,
            transform: [{ scale: pulseAnim }],
            opacity: isRunning ? 0.3 : 0,
            position: 'absolute',
            width: 48, height: 48, borderRadius: 24,
          }]} />
          <View style={[styles.coreDot, {
            backgroundColor: isRunning ? COLORS.running : '#cbd5e1',
          }]} />
        </View>
        <Text style={styles.statusLabel}>{isRunning ? 'PUMP RUNNING' : 'PUMP IDLE'}</Text>
        {isRunning && (
          <Text style={styles.timer}>{formatElapsed(elapsed)}</Text>
        )}
        <Text style={styles.pumpId}>Pump ID: {pumpId}</Text>
        {startTime && (
          <Text style={styles.since}>
            Started at {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <CustomButton
          title={loading && !isRunning ? 'Starting...' : '▶  Start Pump'}
          onPress={handleStart}
          type="primary"
          disabled={isRunning}
          loading={loading && !isRunning}
        />
        <CustomButton
          title={loading && isRunning ? 'Stopping...' : '■  Stop Pump'}
          onPress={handleStop}
          type="danger"
          disabled={!isRunning}
          loading={loading && isRunning}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  statusCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  indicatorWrap: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  pulseDot: {
    width: 48, height: 48, borderRadius: 24,
    position: 'absolute',
  },
  coreDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: COLORS.muted,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  timer: {
    fontSize: 52,
    fontWeight: '900',
    color: COLORS.text,
    fontVariant: ['tabular-nums'],
    letterSpacing: 2,
    marginVertical: SPACING.sm,
  },
  pumpId: {
    color: COLORS.muted,
    fontWeight: '700',
    fontSize: 13,
    marginTop: SPACING.xs,
  },
  since: {
    color: COLORS.muted,
    fontWeight: '600',
    fontSize: 12,
    marginTop: 2,
  },
  controls: {
    gap: SPACING.xs,
  },
});

export default PumpControlScreen;
