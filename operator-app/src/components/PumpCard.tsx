import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';
import { cardStyle, typography } from '../styles/theme';
import StatusBadge from './StatusBadge';

type Props = {
  pump: {
    id: string;
    name: string;
    location: string;
    status: string;
    lastMaintenance?: string;
  };
};

const PumpCard: React.FC<Props> = ({ pump }) => {
  return (
    <View style={[styles.card, cardStyle]}>
      <Text style={typography.title}>{pump.name}</Text>
      <Text style={styles.muted}>ID: {pump.id}</Text>
      <Text style={styles.muted}>Location: {pump.location}</Text>
      <View style={styles.badgeRow}>
        <StatusBadge status={pump.status} />
        {pump.lastMaintenance ? (
          <Text style={styles.updated}>Last check: {pump.lastMaintenance}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
  },
  muted: {
    marginTop: 4,
    color: Colors.muted,
  },
  badgeRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  updated: {
    fontSize: 13,
    color: Colors.muted,
  },
});

export default PumpCard;
