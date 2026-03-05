import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CustomButton from '../components/CustomButton';
import PumpCard from '../components/PumpCard';
import LogCard from '../components/LogCard';
import { Colors } from '../constants/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const samplePump = {
  id: 'P-014',
  name: 'Community Pump',
  location: 'Ward 4, Near School',
  status: 'Active',
  lastMaintenance: '15 Feb 2026',
};

const sampleLogs = [
  { pumpName: 'Community Pump', startTime: '09:00', endTime: '10:15', duration: '1h 15m', synced: true },
  { pumpName: 'Market Pump', startTime: '06:30', endTime: '07:05', duration: '35m', synced: false },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Welcome, Operator</Text>
          <Text style={styles.sub}>Manage pumps and logs easily.</Text>
        </View>
      </View>

      <CustomButton title="Scan Pump QR" onPress={() => navigation.navigate('ScanQR')} />

      <Text style={styles.section}>Assigned Pump</Text>
      <PumpCard pump={samplePump} />

      <View style={styles.row}>
        <View style={styles.half}>
          <CustomButton title="Pump Control" onPress={() => navigation.navigate('PumpControl', { pump: samplePump })} />
        </View>
        <View style={styles.half}>
          <CustomButton title="Maintenance" type="outline" onPress={() => navigation.navigate('Maintenance', { pump: samplePump })} />
        </View>
      </View>

      <Text style={styles.section}>Recent Logs</Text>
      {sampleLogs.map((log, idx) => (
        <LogCard key={idx} log={log} />
      ))}

      <CustomButton title="Work History" type="outline" onPress={() => navigation.navigate('WorkHistory')} />
      <CustomButton title="Settings" type="outline" onPress={() => navigation.navigate('Settings')} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, paddingHorizontal: 16, paddingTop: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.ink },
  sub: { fontSize: 14, color: Colors.muted },
  section: { marginTop: 16, marginBottom: 6, fontSize: 16, fontWeight: '700', color: Colors.ink },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
});

export default DashboardScreen;
