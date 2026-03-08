import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import StatusBadge from '../components/StatusBadge';
import { COLORS, RADIUS, SPACING } from '../constants';
import { Pump } from '../services/pumpService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type MetaRowProps = { label: string; value: string };
const MetaRow: React.FC<MetaRowProps> = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.metaLabel}>{label}</Text>
    <Text style={styles.metaValue}>{value}</Text>
  </View>
);

const PumpDetailsScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'PumpDetails'>> = ({ route, navigation }) => {
  const { pump } = route.params as { pump: Pump };
  const isActive = pump.status?.toLowerCase() === 'active';

  return (
    <View style={styles.container}>
      {/* Header band */}
      <View style={styles.headerBand}>
        <View style={styles.headerContent}>
          <Text style={styles.name}>{pump.name}</Text>
          {pump.status ? (
            <StatusBadge
              label={pump.status}
              status={isActive ? 'success' : 'warning'}
            />
          ) : null}
        </View>
        <Text style={styles.idText}>QR / ID: {pump.id}</Text>
      </View>

      {/* Details card */}
      <View style={styles.detailCard}>
        {pump.location        ? <MetaRow label="📍 Location"       value={pump.location} /> : null}
        {pump.operatorName    ? <MetaRow label="👤 Operator"        value={pump.operatorName} /> : null}
        {pump.lastOperationTime ? (
          <MetaRow label="🕐 Last Operation" value={new Date(pump.lastOperationTime).toLocaleString()} />
        ) : null}
      </View>

      <CustomButton
        title="Open Pump Control →"
        onPress={() => navigation.navigate('PumpControl', { pumpId: pump.id })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg },
  headerBand: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
  },
  name: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
    flex: 1,
    marginRight: SPACING.sm,
  },
  idText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    fontWeight: '600',
  },
  detailCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  metaLabel: { color: COLORS.muted, fontWeight: '700', fontSize: 13 },
  metaValue: { color: COLORS.text, fontWeight: '700', fontSize: 13, textAlign: 'right', flex: 1, marginLeft: SPACING.md },
});

export default PumpDetailsScreen;
