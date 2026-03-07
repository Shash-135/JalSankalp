import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import StatusBadge from '../components/StatusBadge';
import { COLORS, RADIUS, SPACING } from '../constants';
import { Pump } from '../services/pumpService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const PumpDetailsScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'PumpDetails'>> = ({ route, navigation }) => {
  const { pump } = route.params as { pump: Pump };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>{pump.name}</Text>
          {pump.status ? <StatusBadge label={pump.status} status={pump.status === 'Active' ? 'success' : 'warning'} /> : null}
        </View>
        <Text style={styles.meta}>Pump ID: {pump.id}</Text>
        {pump.location ? <Text style={styles.meta}>Location: {pump.location}</Text> : null}
        {pump.lastServiced ? <Text style={styles.meta}>Last serviced: {pump.lastServiced}</Text> : null}
      </View>

      <CustomButton
        title="Open Pump Control"
        onPress={() => navigation.navigate('PumpControl', { pumpId: pump.id })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg },
  card: {
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: SPACING.lg,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  meta: { color: COLORS.muted, marginTop: SPACING.xs },
});

export default PumpDetailsScreen;
