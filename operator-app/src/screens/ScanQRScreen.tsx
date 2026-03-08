import React, { useEffect, useState } from 'react';
import {
  Alert, SafeAreaView, StyleSheet, Text,
  TextInput, View,
} from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { COLORS, RADIUS, SPACING } from '../constants';
import { fetchPump } from '../services/pumpService';
import CustomButton from '../components/CustomButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const ScanQRScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'ScanQR'>> = ({ navigation }) => {
  const device = useCameraDevice('back');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [manualId, setManualId]           = useState('');
  const [loading, setLoading]             = useState(false);
  const [scannedValue, setScannedValue]   = useState<string | null>(null);

  useEffect(() => {
    Camera.requestCameraPermission().then(status => setHasPermission(status === 'granted'));
  }, []);

  const handlePumpFetch = async (pumpId: string) => {
    if (!pumpId) { Alert.alert('Pump ID missing', 'Scan a QR code or enter an ID.'); return; }
    try {
      setLoading(true);
      const pump = await fetchPump(pumpId);
      navigation.replace('PumpDetails', { pump });
    } catch {
      Alert.alert('Not found', 'Could not load pump details.');
    } finally {
      setLoading(false);
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
        <View style={styles.permCard}>
          <Text style={styles.permIcon}>📷</Text>
          <Text style={styles.title}>Camera Permission Required</Text>
          <Text style={styles.text}>Enable camera access in your device settings to scan pump QR codes.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Camera viewfinder */}
      <View style={styles.cameraCard}>
        {device ? (
          <View style={styles.cameraBox}>
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive
              codeScanner={codeScanner}
            />
            {/* Corner brackets overlay */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            <Text style={styles.hint}>Align QR code within the frame</Text>
          </View>
        ) : (
          <View style={[styles.cameraBox, styles.cameraPlaceholder]}>
            <Text style={styles.cameraLoadText}>Initialising camera...</Text>
          </View>
        )}
      </View>

      {/* Manual input card */}
      <View style={styles.manualCard}>
        <Text style={styles.orLabel}>— or enter manually —</Text>
        <TextInput
          placeholder="Pump ID / QR Code"
          value={manualId}
          onChangeText={setManualId}
          style={styles.input}
          placeholderTextColor={COLORS.muted}
          autoCapitalize="none"
        />
        <CustomButton
          title="Fetch Pump Details"
          onPress={() => handlePumpFetch(manualId)}
          loading={loading}
        />
      </View>
    </SafeAreaView>
  );
};

const CORNER_SIZE = 20;
const CORNER_WIDTH = 3;
const CORNER_COLOR = '#fff';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.lg },
  cameraCard: { marginBottom: SPACING.lg },
  cameraBox: {
    height: 280,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    backgroundColor: '#000',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: SPACING.md,
  },
  cameraPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  cameraLoadText: { color: COLORS.muted, fontWeight: '600' },
  hint: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
  },
  // Corner brackets
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: CORNER_COLOR,
  },
  topLeft:     { top: 16, left: 16,  borderTopWidth: CORNER_WIDTH, borderLeftWidth: CORNER_WIDTH,   borderTopLeftRadius: 4 },
  topRight:    { top: 16, right: 16, borderTopWidth: CORNER_WIDTH, borderRightWidth: CORNER_WIDTH,  borderTopRightRadius: 4 },
  bottomLeft:  { bottom: 40, left: 16,  borderBottomWidth: CORNER_WIDTH, borderLeftWidth: CORNER_WIDTH,  borderBottomLeftRadius: 4 },
  bottomRight: { bottom: 40, right: 16, borderBottomWidth: CORNER_WIDTH, borderRightWidth: CORNER_WIDTH, borderBottomRightRadius: 4 },
  // Manual section
  manualCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  orLabel: {
    textAlign: 'center',
    color: COLORS.muted,
    fontWeight: '700',
    fontSize: 12,
    marginBottom: SPACING.md,
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    backgroundColor: '#f8faff',
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 14,
  },
  permCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginTop: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  permIcon: { fontSize: 40, marginBottom: SPACING.md },
  title:    { fontSize: 17, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginBottom: SPACING.sm },
  text:     { color: COLORS.muted, textAlign: 'center', fontWeight: '600', lineHeight: 20 },
});

export default ScanQRScreen;
