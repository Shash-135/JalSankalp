import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import CustomButton from '../components/CustomButton';
import { COLORS, RADIUS, SPACING } from '../constants';
import { useAuth } from '../context/AuthContext';

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [operatorId, setOperatorId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!operatorId || !password) {
      Alert.alert('Missing info', 'Please enter operator ID and password.');
      return;
    }
    setLoading(true);
    const ok = await login({ operatorId, password });
    setLoading(false);
    if (!ok) {
      Alert.alert('Login failed', 'Please check your credentials or try again later.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Pump Operator</Text>
        <Text style={styles.subtitle}>Login to manage your pumps</Text>
        <TextInput
          placeholder="Operator ID"
          value={operatorId}
          onChangeText={setOperatorId}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        <CustomButton title="Login" onPress={onSubmit} loading={loading} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  box: {
    backgroundColor: '#fff',
    padding: SPACING.xl,
    borderRadius: RADIUS.lg,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.muted,
    marginBottom: SPACING.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: '#f9fafb',
  },
});

export default LoginScreen;
