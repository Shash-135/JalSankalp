import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants';

type Props = {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
};

const CustomButton: React.FC<Props> = ({ title, onPress, type = 'primary', disabled, loading }) => {
  const isPrimary = type === 'primary';
  const isSecondary = type === 'secondary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isPrimary && styles.primary,
        isSecondary && styles.secondary,
        type === 'ghost' && styles.ghost,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#fff' : COLORS.primary} />
      ) : (
        <Text style={[styles.text, isPrimary && styles.textPrimary]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  primary: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  ghost: {
    backgroundColor: '#fff',
    borderColor: COLORS.primary,
  },
  disabled: {
    opacity: 0.7,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  textPrimary: {
    color: '#fff',
  },
});

export default CustomButton;
