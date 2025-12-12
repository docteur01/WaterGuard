import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useStations } from '../contexts/useStations';
import { useCalibrations } from '../contexts/useCalibrations';
import { useAuth } from '../contexts/AuthContext';
import { ChevronLeft, CheckCircle } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

export default function CalibrationScreen() {
  const navigation = useNavigation();
  const route = useRoute() as any;
  const { id } = route.params; // Récupération de l'ID

  const { getStation } = useStations();
  const { addCalibration } = useCalibrations();
  const { user } = useAuth();

  const station = getStation(id);
  const [sensorType, setSensorType] = useState<'ph' | 'temperature' | 'turbidity' | 'conductivity' | 'oxygen'>('ph');
  const [calibrationValue, setCalibrationValue] = useState('');
  const [standardValue, setStandardValue] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCalibrate = async () => {
    if (!calibrationValue || !standardValue) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Veuillez remplir tous les champs',
      });
      return;
    }

    setLoading(true);
    try {
      await addCalibration({
        stationId: id,
        sensorType,
        calibratedAt: new Date().toISOString(),
        calibrationValue: parseFloat(calibrationValue),
        standardValue: parseFloat(standardValue),
        technician: user?.name || 'Anonyme',
        notes,
        nextCalibrationDate: new Date(Date.now() + 30 * 24 * 3600000).toISOString(),
      });

      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Calibration enregistrée',
      });

      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: "Impossible d'enregistrer la calibration",
      });
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
        <Text style={styles.title}>Calibration</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Station Info */}
        <View style={styles.stationInfo}>
          <Text style={styles.stationName}>{station.name}</Text>
          <Text style={styles.stationLocation}>{station.location}</Text>
        </View>

        {/* Formulaire */}
        <Text style={styles.sectionTitle}>Formulaire de Calibration</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Type de Capteur</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={sensorType}
              onValueChange={setSensorType}
              style={styles.picker}
              dropdownIconColor="#fff"
            >
              <Picker.Item label="pH" value="ph" />
              <Picker.Item label="Température" value="temperature" />
              <Picker.Item label="Turbidité" value="turbidity" />
              <Picker.Item label="Conductivité" value="conductivity" />
              <Picker.Item label="Oxygène" value="oxygen" />
            </Picker>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Valeur du Capteur</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 7.25"
            placeholderTextColor="#666"
            value={calibrationValue}
            onChangeText={setCalibrationValue}
            keyboardType="decimal-pad"
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Valeur Standard</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 7.00"
            placeholderTextColor="#666"
            value={standardValue}
            onChangeText={setStandardValue}
            keyboardType="decimal-pad"
            editable={!loading}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes (optionnel)</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Ajouter des notes..."
            placeholderTextColor="#666"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCalibrate}
          disabled={loading}
        >
          <CheckCircle size={20} color="#fff" />
          <Text style={styles.buttonText}>
            {loading ? 'Enregistrement...' : 'Enregistrer Calibration'}
          </Text>
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
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 10, marginTop: 16 },
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
  inputMultiline: { height: 100, textAlignVertical: 'top', paddingTop: 10 },
  pickerContainer: { borderWidth: 1, borderColor: '#2d3139', borderRadius: 6, overflow: 'hidden', marginBottom: 10 },
  picker: { color: '#fff' },
  button: {
    backgroundColor: '#00d084',
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
