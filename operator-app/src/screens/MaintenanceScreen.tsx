import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomButton from '../components/CustomButton';
import { COLORS, RADIUS, SPACING } from '../constants';
import { useAuth } from '../context/AuthContext';
import { submitMaintenance } from '../services/pumpService';

const MaintenanceScreen: React.FC = () => {
  const { operator } = useAuth();
  const [pumpId, setPumpId] = useState('');
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
      Alert.alert('Missing info', 'Enter pump ID and comment.');
      return;
    }
    try {
      setLoading(true);
      await submitMaintenance({
        pumpId,
        operatorId: operator?.id || 'operator',
        comment,
        photoUri,
      });
      Alert.alert('Reported', 'Maintenance report submitted.');
      setPumpId('');
      setComment('');
      setPhotoUri(undefined);
    } catch (error) {
      Alert.alert('Failed', 'Could not send report. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: SPACING.lg }}>
      <Text style={styles.title}>Maintenance Report</Text>
      <Text style={styles.text}>Capture pump issues with photo and comments.</Text>

      <TextInput
        placeholder="Pump ID"
        value={pumpId}
        onChangeText={setPumpId}
        style={styles.input}
      />
      <TextInput
        placeholder="Describe the issue"
        value={comment}
        onChangeText={setComment}
        style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
        multiline
      />

      {photoUri ? (
        <View style={styles.previewBox}>
          <Image source={{ uri: photoUri }} style={styles.preview} />
          <Text style={styles.text}>Photo attached</Text>
        </View>
      ) : null}

      <CustomButton title="Attach Photo" type="ghost" onPress={pickPhoto} />
      <CustomButton title="Submit Report" onPress={submit} loading={loading} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  text: { color: COLORS.muted, marginBottom: SPACING.sm },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    backgroundColor: '#fff',
    marginBottom: SPACING.sm,
  },
  previewBox: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    backgroundColor: '#fff',
  },
  preview: {
    height: 180,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.xs,
  },
});

export default MaintenanceScreen;
