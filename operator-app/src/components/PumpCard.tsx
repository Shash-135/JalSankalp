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
    qrCode?: string;
  };
  onPress?: () => void;
};

const PumpCard: React.FC<Props> = ({ pump, onPress }) => {
  const isActive = pump.status?.toLowerCase() === 'active';
  const accentColor = isActive ? COLORS.success : COLORS.warning;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {/* Left accent bar */}
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{pump.name}</Text>
          {pump.status ? (
            <StatusBadge
              label={pump.status}
              status={isActive ? 'success' : 'warning'}
            />
          ) : null}
        </View>
        {pump.location ? (
          <Text style={styles.meta}>📍 {pump.location}</Text>
        ) : null}
        <Text style={styles.id}>ID: {pump.qrCode || pump.id}</Text>
      </View>

      {/* Chevron */}
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    marginVertical: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  body: {
    flex: 1,
    padding: SPACING.md + 2,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  meta: {
    color: COLORS.muted,
    fontSize: 13,
    marginBottom: 2,
  },
  id: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  chevron: {
    fontSize: 22,
    color: COLORS.muted,
    paddingRight: SPACING.md,
  },
});

export default PumpCard;
