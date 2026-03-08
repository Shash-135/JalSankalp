import React, { useState } from 'react';
import {
  KeyboardAvoidingView, Platform,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
import { COLORS, RADIUS, SPACING } from '../constants';
import { useAuth } from '../context/AuthContext';

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [mobile, setMobile]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const onSubmit = async () => {
    if (!mobile || !password) { setError('Please enter your mobile number and password.'); return; }
    setLoading(true);
    setError('');
    const ok = await login({ mobile, password });
    setLoading(false);
    if (!ok) setError('Invalid credentials. Please try again.');
  };

  return (
    <SafeAreaView style={styles.bg}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.center}>
        {/* Logo area */}
        <View style={styles.logoArea}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>JS</Text>
          </View>
          <Text style={styles.brand}>JalSankalp</Text>
          <Text style={styles.brandSub}>Pump Operator Portal</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Operator Login</Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            placeholder="10-digit mobile"
            value={mobile}
            onChangeText={setMobile}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="phone-pad"
            placeholderTextColor={COLORS.muted}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Your password"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            placeholderTextColor={COLORS.muted}
          />

          <CustomButton title="Login" onPress={onSubmit} loading={loading} />
        </View>

        <Text style={styles.footer}>Official Gram Panchayat App</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoBox: {
    height: 60,
    width: 60,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  logoText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 24,
  },
  brand: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 26,
    letterSpacing: 0.5,
  },
  brandSub: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    padding: SPACING.xl,
    borderRadius: RADIUS.xl,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  error: {
    color: COLORS.danger,
    backgroundColor: '#fee2e2',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    fontWeight: '600',
    fontSize: 13,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    backgroundColor: '#f8faff',
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 15,
  },
  footer: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: SPACING.lg,
    textTransform: 'uppercase',
  },
});

export default LoginScreen;
