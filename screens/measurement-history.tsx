import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useStations } from '../contexts/useStations';
import { useMeasurementHistory } from '../contexts/useMeasurementHistory';
import { ChevronLeft, Download } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function MeasurementHistoryScreen() {
  const { id } = useLocalSearchParams();
  const { getStation } = useStations();
  const { history, getRange } = useMeasurementHistory(id as string);
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<24 | 72 | 168>(24);

  const station = getStation(id as string);
  const data = getRange(timeRange);

  if (!station) {
    return <View style={styles.container}><Text style={styles.error}>Station non trouvée</Text></View>;
  }

  const calculateStats = (measurements: typeof history) => {
    if (measurements.length === 0) return null;

    const phValues = measurements.map(m => m.measurements.ph);
    const tempValues = measurements.map(m => m.measurements.temperature);
    const o2Values = measurements.map(m => m.measurements.dissolved_oxygen);

    return {
      ph: {
        avg: (phValues.reduce((a, b) => a + b, 0) / phValues.length).toFixed(2),
        min: Math.min(...phValues).toFixed(2),
        max: Math.max(...phValues).toFixed(2),
      },
      temp: {
        avg: (tempValues.reduce((a, b) => a + b, 0) / tempValues.length).toFixed(1),
        min: Math.min(...tempValues).toFixed(1),
        max: Math.max(...tempValues).toFixed(1),
      },
      o2: {
        avg: (o2Values.reduce((a, b) => a + b, 0) / o2Values.length).toFixed(2),
        min: Math.min(...o2Values).toFixed(2),
        max: Math.max(...o2Values).toFixed(2),
      },
    };
  };

  const stats = calculateStats(data);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Historique</Text>
        <TouchableOpacity>
          <Download size={24} color="#0066ff" />
        </TouchableOpacity>
      </View>

      <View style={styles.timeRangeSelector}>
        {([24, 72, 168] as const).map(range => (
          <TouchableOpacity
            key={range}
            style={[styles.timeButton, timeRange === range && styles.timeButtonActive]}
            onPress={() => setTimeRange(range)}
          >
            <Text
              style={[
                styles.timeButtonText,
                timeRange === range && styles.timeButtonTextActive,
              ]}
            >
              {range === 24 ? '24h' : range === 72 ? '3j' : '7j'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {stats && (
        <View style={styles.statsGrid}>
          <StatCard title="pH" stat={stats.ph} />
          <StatCard title="Température" stat={stats.temp} />
          <StatCard title="O₂ dissous" stat={stats.o2} />
        </View>
      )}

      <View style={styles.dataSection}>
        <Text style={styles.sectionTitle}>Données ({data.length} points)</Text>
        <View style={styles.dataTable}>
          <View style={styles.dataHeader}>
            <Text style={[styles.dataCell, { width: '30%' }]}>Heure</Text>
            <Text style={[styles.dataCell, { width: '20%' }]}>pH</Text>
            <Text style={[styles.dataCell, { width: '25%' }]}>Temp</Text>
            <Text style={[styles.dataCell, { width: '25%' }]}>O₂</Text>
          </View>
          {data.slice(0, 20).map((point, idx) => (
            <View key={idx} style={styles.dataRow}>
              <Text style={[styles.dataCell, { width: '30%', fontSize: 10 }]}>
                {new Date(point.timestamp).toLocaleTimeString('fr-FR')}
              </Text>
              <Text style={[styles.dataCell, { width: '20%', color: '#0066ff' }]}>
                {point.measurements.ph.toFixed(1)}
              </Text>
              <Text style={[styles.dataCell, { width: '25%', color: '#0066ff' }]}>
                {point.measurements.temperature.toFixed(1)}°
              </Text>
              <Text style={[styles.dataCell, { width: '25%', color: '#0066ff' }]}>
                {point.measurements.dissolved_oxygen.toFixed(1)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function StatCard({ title, stat }: any) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <View style={styles.statValues}>
        <View style={styles.statValue}>
          <Text style={styles.statLabel}>Moy</Text>
          <Text style={styles.statNumber}>{stat.avg}</Text>
        </View>
        <View style={styles.statValue}>
          <Text style={styles.statLabel}>Min</Text>
          <Text style={styles.statNumber}>{stat.min}</Text>
        </View>
        <View style={styles.statValue}>
          <Text style={styles.statLabel}>Max</Text>
          <Text style={styles.statNumber}>{stat.max}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  error: {
    color: '#ff3333',
    textAlign: 'center',
    marginTop: 20,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#1a1f26',
    borderWidth: 1,
    borderColor: '#2d3139',
    alignItems: 'center',
  },
  timeButtonActive: {
    backgroundColor: '#0066ff',
    borderColor: '#0066ff',
  },
  timeButtonText: {
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
  },
  timeButtonTextActive: {
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1f26',
    borderRadius: 8,
    padding: 10,
  },
  statTitle: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    marginBottom: 8,
  },
  statValues: {
    gap: 6,
  },
  statValue: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 9,
    color: '#666',
  },
  statNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0066ff',
    marginTop: 2,
  },
  dataSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  dataTable: {
    backgroundColor: '#1a1f26',
    borderRadius: 6,
    overflow: 'hidden',
  },
  dataHeader: {
    flexDirection: 'row',
    backgroundColor: '#0f1419',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3139',
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3139',
  },
  dataCell: {
    fontSize: 11,
    color: '#ccc',
  },
});
