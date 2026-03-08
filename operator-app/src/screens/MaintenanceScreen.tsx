import React, { useState } from 'react';
import {
  Alert, Image, ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomButton from '../components/CustomButton';
import { COLORS, RADIUS, SPACING } from '../constants';
import { useAuth } from '../context/AuthContext';
import { submitMaintenance } from '../services/pumpService';

const MaintenanceScreen: React.FC = () => {
  const { operator }   = useAuth();
  const [pumpId, setPumpId]   = useState('');
  const [comment, setComment] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const pickPhoto = async () => {
    const res = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
    const uri = res.assets?.[0]?.uri;
    if (uri) setPhotoUri(uri);
  };

  const submit = async () => {
    if (!pumpId || !comment) {
      Alert.alert('Missing info', 'Please enter both the pump ID and a description.');
      return;
    }
    try {
      setLoading(true);
      await submitMaintenance({
        pumpId,
        operatorId: operator?.id || 'operator',
        operatorMobile: operator?.mobile,
        operatorName: operator?.name,
        comment,
        photoUri,
      });
      Alert.alert('Reported', 'Maintenance report submitted successfully.');
      setPumpId(''); setComment(''); setPhotoUri(undefined);
    } catch {
      Alert.alert('Failed', 'Could not send report. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.label}>Pump ID</Text>
        <TextInput
          placeholder="Enter pump ID or QR code"
          value={pumpId}
          onChangeText={setPumpId}
          style={styles.input}
          placeholderTextColor={COLORS.muted}
        />

        <Text style={styles.label}>Issue Description</Text>
        <TextInput
          placeholder="Describe the problem in detail"
          value={comment}
          onChangeText={setComment}
          style={[styles.input, styles.textarea]}
          multiline
          textAlignVertical="top"
          placeholderTextColor={COLORS.muted}
        />

        {/* Photo preview / picker */}
        {photoUri ? (
          <View style={styles.previewBox}>
            <Image source={{ uri: photoUri }} style={styles.preview} />
            <TouchableOpacity onPress={() => setPhotoUri(undefined)} style={styles.removePhoto}>
              <Text style={styles.removePhotoText}>✕ Remove Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.photoPlaceholder} onPress={pickPhoto}>
            <Text style={styles.photoIcon}>📷</Text>
            <Text style={styles.photoLabel}>Attach Photo</Text>
            <Text style={styles.photoSub}>Optional — tap to select from gallery</Text>
          </TouchableOpacity>
        )}
      </View>

      <CustomButton title="Submit Report" onPress={submit} loading={loading} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xl },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
    marginTop: SPACING.sm,
  },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: '#f8faff',
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 14,
  },
  textarea: { height: 110, paddingTop: SPACING.md },
  photoPlaceholder: {
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderStyle: 'dashed',
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    alignItems: 'center',
    backgroundColor: '#f8faff',
    marginTop: SPACING.sm,
  },
  photoIcon:  { fontSize: 28, marginBottom: 4 },
  photoLabel: { fontWeight: '800', color: COLORS.primary, fontSize: 14 },
  photoSub:   { color: COLORS.muted, fontSize: 11, fontWeight: '600', marginTop: 2 },
  previewBox: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginTop: SPACING.sm,
  },
  preview: { height: 180 },
  removePhoto: {
    backgroundColor: '#fee2e2',
    padding: SPACING.sm,
    alignItems: 'center',
  },
  removePhotoText: { color: COLORS.danger, fontWeight: '800', fontSize: 13 },
});

export default MaintenanceScreen;
