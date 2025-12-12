import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useStations } from '../contexts/useStations';

export default function StationDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute() as any;

  const { id } = route.params; // <-- Récupération de l'ID envoyé depuis StationsScreen
  const { getStation } = useStations();

  const station = getStation(id);

  if (!station) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Station</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.error}>Station non trouvée</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{station.name}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>

        {/* --- STATUT --- */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Text style={styles.label}>Statut</Text>

            <View style={styles.statusValue}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      station.status === 'online'
                        ? '#00d084'
                        : station.status === 'alert'
                        ? '#ff3333'
                        : '#666',
                  },
                ]}
              />
              <Text style={styles.statusText}>{getStatusLabel(station.status)}</Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.label}>Batterie</Text>

            <View style={styles.batteryContainer}>
              <View style={[styles.batteryBar, { width: `${station.battery}%` }]} />
            </View>

            <Text style={styles.statusText}>{station.battery}%</Text>
          </View>

          <View style={styles.statusRow}>
            <Text style={styles.label}>Localisation</Text>
            <Text style={styles.statusText}>{station.location}</Text>
          </View>
        </View>

        {/* --- MESURES --- */}
        <Text style={styles.sectionTitle}>Dernières Mesures</Text>

        <View style={styles.measurementsGrid}>
          <MeasurementCard label="pH" value={station.lastMeasurement.ph} unit="" />
          <MeasurementCard label="Température" value={station.lastMeasurement.temperature} unit="°C" />
          <MeasurementCard label="Turbidité" value={station.lastMeasurement.turbidity} unit="NTU" />
          <MeasurementCard label="Conductivité" value={station.lastMeasurement.conductivity} unit="µS/cm" />
          <MeasurementCard label="O₂ dissous" value={station.lastMeasurement.dissolved_oxygen} unit="mg/L" />
        </View>

        {/* --- BOUTONS --- */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("FieldOperations", { id: station.id })}
        >
          <Text style={styles.buttonText}>Rapport de Terrain</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Calibration", { id: station.id })}
        >
          <Text style={styles.buttonText}>Calibrer les capteurs</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

/* ----------------- COMPONENT MESURE ----------------- */

function MeasurementCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  return (
    <View style={styles.measurementCard}>
      <Text style={styles.measurementLabel}>{label}</Text>
      <View style={styles.measurementValue}>
        <Text style={styles.value}>{value.toFixed(1)}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
}

/* ----------------- LABEL STATUT ----------------- */

function getStatusLabel(status: string): string {
  switch (status) {
    case 'online':
      return 'En ligne';
    case 'alert':
      return 'Alerte';
    case 'offline':
      return 'Hors ligne';
    default:
      return status;
  }
}

/* ----------------- STYLES ----------------- */

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0f1419',
  },
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  error: {
    color: '#ff3333',
    fontSize: 16,
    textAlign: 'center',
  },
  statusCard: {
    backgroundColor: '#1a1f26',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#0066ff',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  statusValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
  },
  batteryContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#0f1419',
    borderRadius: 3,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  batteryBar: {
    height: '100%',
    backgroundColor: '#0066ff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  measurementsGrid: {
    gap: 10,
    marginBottom: 20,
  },
  measurementCard: {
    backgroundColor: '#1a1f26',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  measurementLabel: {
    fontSize: 13,
    color: '#999',
  },
  measurementValue: {
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0066ff',
  },
  unit: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  button: {
    backgroundColor: '#0066ff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
