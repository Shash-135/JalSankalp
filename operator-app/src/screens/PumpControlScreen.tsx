import React, { useState, useEffect, useRef } from 'react';
import {
  ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, View, Animated,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import { COLORS, RADIUS, SPACING } from '../constants';
import { useAuth } from '../context/AuthContext';
import { startPump, stopPump, saveToOfflineQueue, fetchPumpStatus } from '../services/pumpService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const THRESHOLDS = [25, 50, 75, 100];

const PumpControlScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'PumpControl'>> = ({ route }) => {
  const { pumpId } = route.params;
  const { operator } = useAuth();
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed]     = useState(0);
  const [loading, setLoading]     = useState(false);
  const [checking, setChecking]   = useState(true);
  const pulseAnim                 = useRef(new Animated.Value(1)).current;
  const timerRef                  = useRef<ReturnType<typeof setInterval> | null>(null);

  // Capacity tracking state
  const [flowRateLpm, setFlowRateLpm]       = useState(0);
  const [capacityKl, setCapacityKl]         = useState(0);
  const [todayPumpedL, setTodayPumpedL]     = useState(0);
  const alertedRef = useRef<Set<number>>(new Set());

  // Check if pump is already running on mount + load capacity data
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await fetchPumpStatus(pumpId);
        setFlowRateLpm(status?.flow_rate_lpm || 0);
        setCapacityKl(status?.capacity_kl || 0);
        setTodayPumpedL(status?.today_pumped_l || 0);

        if (status?.isRunning && status?.startedAt) {
          const existingStart = new Date(status.startedAt);
          setStartTime(existingStart);
          setElapsed(Math.floor((Date.now() - existingStart.getTime()) / 1000));

          // Mark already-crossed thresholds so we don't re-alert
          if (status.capacity_kl > 0) {
            const capacityL = status.capacity_kl * 1000;
            const alreadyPumped = status.today_pumped_l || 0;
            const elapsedMins = (Date.now() - existingStart.getTime()) / 60000;
            const sessionWater = elapsedMins * (status.flow_rate_lpm || 0);
            const totalNow = alreadyPumped + sessionWater;
            const pctNow = (totalNow / capacityL) * 100;
            for (const t of THRESHOLDS) {
              if (pctNow >= t) alertedRef.current.add(t);
            }
          }
        }
      } catch {
        // Offline fallback — default to idle
      } finally {
        setChecking(false);
      }
    };
    checkStatus();
  }, [pumpId]);

  // Timer + pulse animation
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

  // Real-time capacity threshold checking
  useEffect(() => {
    if (!startTime || capacityKl <= 0 || flowRateLpm <= 0) return;

    const capacityL = capacityKl * 1000;
    const elapsedMins = elapsed / 60;
    const sessionWaterL = elapsedMins * flowRateLpm;
    const totalWaterL = todayPumpedL + sessionWaterL;
    const pct = (totalWaterL / capacityL) * 100;

    for (const threshold of THRESHOLDS) {
      if (pct >= threshold && !alertedRef.current.has(threshold)) {
        alertedRef.current.add(threshold);

        const emoji = threshold >= 100 ? '🛑' : threshold >= 75 ? '🔴' : threshold >= 50 ? '🟠' : '🟡';
        const title = threshold >= 100
          ? `${emoji} CAPACITY FULL!`
          : `${emoji} ${threshold}% Capacity Reached`;
        const message = threshold >= 100
          ? `The area's daily water quota is fully used!\n\nTotal: ${(totalWaterL / 1000).toFixed(2)} KL / ${capacityKl} KL\n\nThe pump has been automatically stopped.`
          : `${threshold}% of the area's daily water capacity has been used.\n\nTotal: ${(totalWaterL / 1000).toFixed(2)} KL / ${capacityKl} KL\n\nRemaining: ${((capacityL - totalWaterL) / 1000).toFixed(2)} KL`;

        Alert.alert(title, message, [{ text: 'OK' }]);

        if (threshold >= 100) {
          handleStop();
        }
      }
    }
  }, [elapsed, startTime, capacityKl, flowRateLpm, todayPumpedL]);

  const formatElapsed = (sec: number) => {
    const h = Math.floor(sec / 3600).toString().padStart(2, '0');
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return h !== '00' ? `${h}:${m}:${s}` : `${m}:${s}`;
  };

  // Real-time water calculation
  const getSessionWaterL = () => {
    if (!startTime || flowRateLpm <= 0) return 0;
    return (elapsed / 60) * flowRateLpm;
  };

  const getTotalWaterL = () => todayPumpedL + getSessionWaterL();
  const getCapacityPct = () => capacityKl > 0 ? Math.min((getTotalWaterL() / (capacityKl * 1000)) * 100, 100) : 0;

  const handleStart = async () => {
    const now = new Date();
    try {
      setLoading(true);
      await startPump({ pumpId, operatorId: operator?.id || 'operator', startTime: now.toISOString() });
      setStartTime(now);
      alertedRef.current = new Set();
    } catch {
      await saveToOfflineQueue({ action: 'start', pump_id: pumpId, timestamp: now.toISOString() });
      setStartTime(now);
      alertedRef.current = new Set();
      Alert.alert('Offline mode', 'Pump start saved offline and will sync when online.');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    const end = new Date();
    try {
      setLoading(true);
      const result = await stopPump({ pumpId, operatorId: operator?.id || 'operator', endTime: end.toISOString() });
      setStartTime(null);

      const waterLiters = result?.water_pumped_l ?? getSessionWaterL();
      const durationMins = result?.duration != null ? result.duration : Math.floor(elapsed / 60);

      Alert.alert(
        '✅ Pump Stopped',
        `Session logged successfully.\n\nDuration: ${durationMins} mins\nWater pumped: ${waterLiters.toFixed(1)} liters`,
      );
    } catch {
      await saveToOfflineQueue({ action: 'stop', pump_id: pumpId, timestamp: end.toISOString(), duration: Math.floor(elapsed / 60) });
      setStartTime(null);
      Alert.alert('Offline mode', 'Stop log saved offline and will sync when online.');
    } finally {
      setLoading(false);
    }
  };

  const isRunning = !!startTime;
  const pct = getCapacityPct();
  const isCapacityFull = capacityKl > 0 && todayPumpedL >= (capacityKl * 1000);
  const barColor = pct >= 100 ? COLORS.danger : pct >= 75 ? '#ea580c' : pct >= 50 ? COLORS.warning : COLORS.running;

  if (checking) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ color: COLORS.muted, marginTop: SPACING.sm, fontWeight: '600' }}>Checking pump status...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Status Card */}
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

      {/* Real-time Water Meter */}
      {isRunning && capacityKl > 0 && (
        <View style={styles.meterCard}>
          <View style={styles.meterHeader}>
            <Text style={styles.meterTitle}>💧 Water Level</Text>
            <Text style={[styles.meterPct, { color: barColor }]}>{pct.toFixed(1)}%</Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${Math.min(pct, 100)}%`, backgroundColor: barColor }]} />
          </View>
          <View style={styles.meterStats}>
            <Text style={styles.meterStat}>Session: {(getSessionWaterL() / 1000).toFixed(2)} KL</Text>
            <Text style={styles.meterStat}>Today: {(getTotalWaterL() / 1000).toFixed(2)} / {capacityKl} KL</Text>
          </View>
          <Text style={styles.flowInfo}>Flow rate: {flowRateLpm} L/min</Text>
        </View>
      )}

      {/* Session Water (no capacity set) */}
      {isRunning && capacityKl <= 0 && flowRateLpm > 0 && (
        <View style={styles.meterCard}>
          <Text style={styles.meterTitle}>💧 Session Water</Text>
          <Text style={[styles.meterPct, { fontSize: 28, marginTop: SPACING.xs }]}>
            {(getSessionWaterL() / 1000).toFixed(2)} KL
          </Text>
          <Text style={styles.flowInfo}>Flow rate: {flowRateLpm} L/min • No area capacity set</Text>
        </View>
      )}

      {/* Controls */}
      <View style={styles.controls}>
        {!isRunning && (
          <CustomButton
            title={isCapacityFull ? 'Quota Full (Disabled)' : (loading ? 'Starting...' : '▶  Start Pump')}
            onPress={handleStart}
            type={isCapacityFull ? "secondary" : "primary"}
            disabled={loading || isCapacityFull}
            loading={loading}
          />
        )}
        {isRunning && (
          <CustomButton
            title={loading ? 'Stopping...' : '■  Stop Pump'}
            onPress={handleStop}
            type="danger"
            disabled={loading}
            loading={loading}
          />
        )}
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
    marginBottom: SPACING.md,
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
  meterCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    elevation: 2,
  },
  meterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  meterTitle: {
    fontWeight: '800',
    fontSize: 14,
    color: COLORS.text,
  },
  meterPct: {
    fontWeight: '900',
    fontSize: 18,
    fontVariant: ['tabular-nums'],
  },
  progressBg: {
    height: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  meterStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meterStat: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.muted,
  },
  flowInfo: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
  controls: {
    gap: SPACING.xs,
  },
});

export default PumpControlScreen;
