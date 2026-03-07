import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import CustomButton from '../components/CustomButton';
import PumpCard from '../components/PumpCard';
import StatusBadge from '../components/StatusBadge';
import { COLORS, RADIUS, SPACING } from '../constants';
import { useAuth } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import api from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

type DashboardPump = {
  id: string;
  name: string;
  location: string;
  status: string;
};

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { operator } = useAuth();
  const [pumps, setPumps] = useState<DashboardPump[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPumps = async () => {
      try {
        // Fetching all pumps for now, but in a real scenario we'd query by operator_id or assigned region
        const res = await api.get('/pumps');
        const formatted = res.data.map((p: any) => ({
          id: p.qr_code || p.id.toString(), // For the app display we prefer the QR code if available to match scanning
          name: p.name,
          location: p.location || 'Unknown Area',
          status: p.status === 'active' ? 'Active' : 'Idle'
        }));
        setPumps(formatted);
      } catch (err) {
        console.error("Failed to load dashboard pumps", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPumps();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: SPACING.lg }}>
      <View style={styles.headerCard}>
        <View>
          <Text style={styles.greeting}>Hello, {operator?.name || 'Operator'}</Text>
          <Text style={styles.sub}>Quickly manage your assigned pumps</Text>
        </View>
        <StatusBadge label="Online" status="success" />
      </View>

      <View style={styles.actions}>
        <CustomButton title="Scan Pump QR" onPress={() => navigation.navigate('ScanQR')} />
        <CustomButton
          title="Work History"
          type="secondary"
          onPress={() => navigation.navigate('WorkHistory')}
        />
        <CustomButton title="Maintenance" type="ghost" onPress={() => navigation.navigate('Maintenance')} />
        <CustomButton title="Settings" type="ghost" onPress={() => navigation.navigate('Settings')} />
      </View>

      <Text style={styles.sectionTitle}>Assigned Pumps</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
      ) : pumps.length === 0 ? (
        <Text style={{ marginTop: 10, color: COLORS.muted }}>No pumps assigned currently.</Text>
      ) : (
        pumps.map(pump => (
          <PumpCard
            key={pump.id}
            pump={pump}
            onPress={() => navigation.navigate('PumpDetails', { pump: { ...pump, id: pump.id } })}
          />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.background },
  headerCard: {
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  sub: { color: COLORS.muted, marginTop: SPACING.xs },
  actions: { marginBottom: SPACING.lg },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
});

export default DashboardScreen;
