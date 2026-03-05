import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import CustomButton from '../components/CustomButton';
import { Colors } from '../constants/colors';
import { login, setAuthHeader } from '../services/authService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const token = await login(mobile, password);
      if (token) {
        setAuthHeader(token);
        navigation.replace('Dashboard');
      } else {
        Alert.alert('Login failed', 'Invalid credentials');
      }
    } catch (err: any) {
      Alert.alert('Login failed', err?.response?.data?.message || 'Check network and try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Operator Login</Text>
        <Text style={styles.sub}>Use your registered mobile number</Text>
        <TextInput
          style={styles.input}
          placeholder="Mobile number"
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={setMobile}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <CustomButton title="Login" onPress={handleLogin} loading={loading} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: 6,
  },
  sub: {
    fontSize: 14,
    color: Colors.muted,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    fontSize: 16,
  },
});

export default LoginScreen;
