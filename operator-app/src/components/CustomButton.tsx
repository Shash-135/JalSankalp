import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants';

type Props = {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
};

const CustomButton: React.FC<Props> = ({ title, onPress, type = 'primary', disabled, loading }) => {
  const isPrimary   = type === 'primary';
  const isDanger    = type === 'danger';
  const isAccent    = type === 'accent';
  const isSecondary = type === 'secondary';

  const bgColor = isPrimary   ? COLORS.primary
                : isDanger    ? COLORS.danger
                : isAccent    ? COLORS.accent
                : isSecondary ? COLORS.secondary
                : 'transparent';

  const textColor = type === 'ghost' ? COLORS.primary : '#fff';
  const borderColor = type === 'ghost' ? COLORS.cardBorder : bgColor;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bgColor, borderColor },
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={type === 'ghost' ? COLORS.primary : '#fff'} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginVertical: SPACING.sm,
    borderWidth: 1.5,
  },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  text: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

export default CustomButton;
