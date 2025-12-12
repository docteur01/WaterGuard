import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';

import { useStations } from '../contexts/useStations';
import { useCalibrations } from '../contexts/useCalibrations';
import { useAuth } from '../contexts/AuthContext';
import { ChevronLeft, Clipboard, Camera } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

export default function FieldOperationsScreen() {
  const navigation = useNavigation();
  const route = useRoute() as any;
  const { id } = route.params; // Récupération de l'ID

  const { getStation } = useStations();
  const { addReport } = useCalibrations();
  const { user } = useAuth();

  const station = getStation(id);
  const [reportType, setReportType] = useState<'maintenance' | 'repair' | 'inspection' | 'other'>('maintenance');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitReport = async () => {
    if (!title || !description) {
      Toast.show({ type: 'error', text1: 'Erreur', text2: 'Veuillez remplir tous les champs' });
      return;
    }

    setLoading(true);
    try {
      await addReport({
        stationId: id,
        reportedAt: new Date().toISOString(),
        reportType,
        title,
        description,
        photos: [],
        technician: user?.name || 'Anonyme',
        status: 'pending',
      });

      Toast.show({ type: 'success', text1: 'Succès', text2: 'Rapport enregistré' });
      navigation.goBack();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Erreur', text2: "Impossible d'enregistrer le rapport" });
    } finally {
      setLoading(false);
    }
  };

  if (!station) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Station non trouvée</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Rapport Terrain</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Station Info */}
        <View style={styles.stationInfo}>
          <Text style={styles.stationName}>{station.name}</Text>
          <Text style={styles.stationLocation}>{station.location}</Text>
        </View>

        {/* Formulaire */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Type d'Opération</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={reportType}
              onValueChange={setReportType}
              style={styles.picker}
              dropdownIconColor="#fff"
            >
              <Picker.Item label="Maintenance" value="maintenance" />
              <Picker.Item label="Réparation" value="repair" />
              <Picker.Item label="Inspection" value="inspection" />
              <Picker.Item label="Autre" value="other" />
            </Picker>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Titre</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Maintenance préventive"
            placeholderTextColor="#666"
            value={title}
            onChangeText={setTitle}
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Détailler l'opération effectuée..."
            placeholderTextColor="#666"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            editable={!loading}
          />
        </View>

        <TouchableOpacity style={styles.photoButton} disabled={loading}>
          <Camera size={20} color="#0066ff" />
          <Text style={styles.photoButtonText}>Ajouter des photos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmitReport}
          disabled={loading}
        >
          <Clipboard size={20} color="#fff" />
          <Text style={styles.buttonText}>{loading ? 'Enregistrement...' : 'Enregistrer Rapport'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f1419' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a1f26',
    borderBottomWidth: 1,
    borderBottomColor: '#2d3139',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#fff' },
  error: { color: '#ff3333', textAlign: 'center', marginTop: 20 },
  content: { paddingHorizontal: 16, paddingVertical: 16 },
  stationInfo: {
    backgroundColor: '#1a1f26',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#0066ff',
  },
  stationName: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 2 },
  stationLocation: { fontSize: 12, color: '#999' },
  formGroup: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '600', color: '#e0e0e0', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#2d3139',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#1a1f26',
  },
  inputMultiline: { height: 120, textAlignVertical: 'top', paddingTop: 10 },
  pickerContainer: { borderWidth: 1, borderColor: '#2d3139', borderRadius: 6, overflow: 'hidden', marginBottom: 10 },
  picker: { color: '#fff' },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0066ff',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 16,
    gap: 8,
    marginVertical: 16,
  },
  photoButtonText: { color: '#0066ff', fontSize: 13, fontWeight: '600' },
  button: {
    backgroundColor: '#0066ff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 20,
    gap: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
