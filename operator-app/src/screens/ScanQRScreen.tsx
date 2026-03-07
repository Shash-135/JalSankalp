import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { COLORS, RADIUS, SPACING } from '../constants';
import { fetchPump } from '../services/pumpService';
import CustomButton from '../components/CustomButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const ScanQRScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'ScanQR'>> = ({ navigation }) => {
  const device = useCameraDevice('back');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [manualId, setManualId] = useState('');
  const [loading, setLoading] = useState(false);
  const [scannedValue, setScannedValue] = useState<string | null>(null);

  useEffect(() => {
    const requestPermission = async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    };
    requestPermission();
  }, []);

  const handlePumpFetch = async (pumpId: string) => {
    if (!pumpId) {
      Alert.alert('Pump ID missing', 'Scan a QR code or enter an ID.');
      return;
    }
    try {
      setLoading(true);
      const pump = await fetchPump(pumpId);
      setLoading(false);
      navigation.replace('PumpDetails', { pump });
    } catch (error) {
      setLoading(false);
      Alert.alert('Not found', 'Could not load pump details.');
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      const value = codes[0]?.value;
      if (value && value !== scannedValue) {
        setScannedValue(value);
        handlePumpFetch(value);
      }
    },
  });

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Camera permission required</Text>
        <Text style={styles.text}>Enable camera to scan pump QR codes.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Scan Pump QR</Text>
      <Text style={styles.text}>Point the camera at the QR on the pump.</Text>

      {device ? (
        <View style={styles.cameraBox}>
          <Camera style={StyleSheet.absoluteFill} device={device} isActive codeScanner={codeScanner} />
        </View>
      ) : (
        <Text style={styles.text}>Camera loading...</Text>
      )}

      <View style={styles.divider} />
      <Text style={styles.text}>Or enter pump ID manually</Text>
      <TextInput
        placeholder="Pump ID"
        value={manualId}
        onChangeText={setManualId}
        style={styles.input}
      />
      <CustomButton title="Fetch Details" onPress={() => handlePumpFetch(manualId)} loading={loading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs },
  text: { color: COLORS.muted, marginBottom: SPACING.sm },
  cameraBox: {
    height: 280,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: SPACING.lg,
  },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: SPACING.lg },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    backgroundColor: '#fff',
  },
});

export default ScanQRScreen;
