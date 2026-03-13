import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator, Pressable, SafeAreaView,
  ScrollView, StyleSheet, Text, View,
} from 'react-native';
import PumpCard from '../components/PumpCard';
import StatusBadge from '../components/StatusBadge';
import { COLORS, RADIUS, SPACING } from '../constants';
import { useAuth } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import api from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

type DashboardPump = { id: string; name: string; location: string; status: string; qrCode?: string };

type ActionTile = { label: string; icon: string; screen: keyof RootStackParamList; color: string };

const actions: ActionTile[] = [
  { label: 'Scan QR',      icon: '⬜', screen: 'ScanQR',      color: COLORS.primary },
  { label: 'Work History', icon: '📋', screen: 'WorkHistory', color: COLORS.secondary },
  { label: 'Maintenance',  icon: '🔧', screen: 'Maintenance', color: COLORS.warning  },
  { label: 'Settings',     icon: '⚙️', screen: 'Settings',    color: COLORS.muted    },
];

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { operator } = useAuth();
  const [pumps, setPumps]   = useState<DashboardPump[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPumps = async () => {
      try {
        if (!operator?.id) return;
        const res = await api.get(`/operator/${operator.id}/pumps`);
        const formatted = res.data.map((p: any) => ({
          id:       String(p.id),             // numeric pump id for API calls
          qrCode:   p.qr_code || undefined,   // keep QR for display
          name:     p.name,
          location: p.location || 'Assigned Region',
          status:   p.status === 'active' ? 'Active' : 'Idle',
        }));
        setPumps(formatted);
      } catch (err) {
        console.error('Failed to load dashboard pumps', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPumps();
  }, []);

  const activeCount = pumps.filter(p => p.status === 'Active').length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Gradient greeting header (simulated with solid + shadow) */}
        <View style={styles.headerCard}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Hello, {operator?.name?.split(' ')[0] || 'Operator'} 👋</Text>
            <Text style={styles.sub}>
              {pumps.length} pump{pumps.length !== 1 ? 's' : ''} assigned · {activeCount} active
            </Text>
          </View>
          <StatusBadge label="Online" status="success" />
        </View>

        {/* 2×2 Action Grid */}
        <View style={styles.grid}>
          {actions.map(a => (
            <Pressable
              key={a.screen}
              style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
              onPress={() => navigation.navigate(a.screen as any)}
            >
              <Text style={styles.tileIcon}>{a.icon}</Text>
              <Text style={[styles.tileLabel, { color: a.color }]}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Pumps section */}
        <Text style={styles.sectionTitle}>Your Assigned Pumps</Text>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: SPACING.lg }} />
        ) : pumps.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💧</Text>
            <Text style={styles.emptyText}>No pumps assigned yet.</Text>
          </View>
        ) : (
          pumps.map(pump => (
            <PumpCard
              key={pump.id}
              pump={pump}
              onPress={() => navigation.navigate('PumpDetails', { pump })}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SPACING.lg, paddingBottom: SPACING.xl },
  headerCard: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  headerLeft: { flex: 1 },
  greeting: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
  },
  sub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  tile: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    width: '47.5%',
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    aspectRatio: 1.6,
  },
  tilePressed: { opacity: 0.82, transform: [{ scale: 0.97 }] },
  tileIcon: { fontSize: 26, marginBottom: SPACING.xs },
  tileLabel: { fontSize: 13, fontWeight: '800' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyState: { alignItems: 'center', paddingVertical: SPACING.xl },
  emptyIcon: { fontSize: 40, marginBottom: SPACING.sm },
  emptyText: { color: COLORS.muted, fontWeight: '600' },
});

export default DashboardScreen;
