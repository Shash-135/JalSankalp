import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../constants/colors';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  type?: 'primary' | 'outline';
  style?: ViewStyle;
};

const CustomButton: React.FC<Props> = ({ title, onPress, loading, type = 'primary', style }) => {
  const isPrimary = type === 'primary';
  return (
    <TouchableOpacity
      style={[styles.button, isPrimary ? styles.primary : styles.outline, style]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#fff' : Colors.primary} />
      ) : (
        <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textOutline]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  outline: {
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  textPrimary: {
    color: '#fff',
  },
  textOutline: {
    color: Colors.primary,
  },
});

export default CustomButton;
