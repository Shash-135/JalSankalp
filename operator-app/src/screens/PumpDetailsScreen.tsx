import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import PumpCard from '../components/PumpCard';
import CustomButton from '../components/CustomButton';
import { fetchPumpById } from '../services/pumpService';
import { Colors } from '../constants/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'PumpDetails'>;

type Pump = {
  id: string;
  name: string;
  location: string;
  status: string;
  lastMaintenance?: string;
};

const PumpDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { pumpId } = route.params || {};
  const [pump, setPump] = useState<Pump | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (pumpId) {
          const data = await fetchPumpById(pumpId);
          setPump(data);
        }
      } catch (err) {
        Alert.alert('Error', 'Could not fetch pump. Showing sample data.');
        setPump({ id: pumpId || 'P-000', name: 'Sample Pump', location: 'Ward 1', status: 'Active', lastMaintenance: 'Today' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [pumpId]);

  if (loading) {
    return (
      <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>
    );
  }

  return (
    <View style={styles.container}>
      {pump && <PumpCard pump={pump} />}
      <CustomButton title="Open Pump Control" onPress={() => navigation.navigate('PumpControl', { pump })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg },
});

export default PumpDetailsScreen;
