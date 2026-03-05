import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { CameraKitCameraScreen } from 'react-native-camera-kit';
import CustomButton from '../components/CustomButton';
import { Colors } from '../constants/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanQR'>;

const ScanQRScreen: React.FC<Props> = ({ navigation }) => {
  const [scanned, setScanned] = useState(false);

  const handleRead = (event: any) => {
    if (scanned) return;
    setScanned(true);
    const pumpId = event?.nativeEvent?.codeStringValue || 'P-014';
    if (!pumpId) {
      Alert.alert('Invalid QR', 'Pump ID missing');
      setScanned(false);
      return;
    }
    navigation.replace('PumpDetails', { pumpId });
  };

  return (
    <View style={styles.container}>
      <CameraKitCameraScreen
        style={StyleSheet.absoluteFillObject}
        scanBarcode
        onReadCode={handleRead}
        showFrame
        laserColor={Colors.primary}
        frameColor={Colors.secondary}
      />
      {scanned && (
        <View style={styles.overlay}>
          <Text style={styles.text}>Scanned. Loading pump...</Text>
          <CustomButton title="Scan again" type="outline" onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  overlay: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: '#ffffffdd',
    borderRadius: 14,
    padding: 12,
  },
  text: { textAlign: 'center', color: Colors.ink, marginBottom: 6, fontWeight: '600' },
});

export default ScanQRScreen;
