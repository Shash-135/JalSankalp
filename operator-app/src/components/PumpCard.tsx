import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants';
import StatusBadge from './StatusBadge';

type Props = {
  pump: {
    id: string;
    name: string;
    location?: string;
    status?: string;
  };
  onPress?: () => void;
};

const PumpCard: React.FC<Props> = ({ pump, onPress }) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.header}>
        <Text style={styles.title}>{pump.name}</Text>
        {pump.status ? <StatusBadge label={pump.status} status={pump.status === 'Active' ? 'success' : 'warning'} /> : null}
      </View>
      <Text style={styles.meta}>ID: {pump.id}</Text>
      {pump.location ? <Text style={styles.meta}>Location: {pump.location}</Text> : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  pressed: {
    opacity: 0.9,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  meta: {
    marginTop: SPACING.xs,
    color: COLORS.muted,
  },
});

export default PumpCard;
