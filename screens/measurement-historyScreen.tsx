import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useStations } from '../contexts/useStations';
import { Calendar } from 'lucide-react-native';

export default function MeasurementHistoryScreen() {
  const { stations } = useStations();
  const [selectedStationId, setSelectedStationId] = useState(stations[0]?.id || '');
  const [timeRange, setTimeRange] = useState<'24h' | '72h' | '7d'>('24h');

  const chartWidth = Dimensions.get('window').width - 32;

  const chartData = useMemo(() => {
    const generateData = (baseValue: number, variance: number, points: number) => {
      return Array.from({ length: points }, () =>
        Math.max(0, baseValue + (Math.random() - 0.5) * variance)
      );
    };

    const timePoints = timeRange === '24h' ? 24 : timeRange === '72h' ? 36 : 84;

    return {
      labels: Array.from({ length: Math.min(timePoints, 7) }, (_, i) => `${i}h`),
      datasets: [
        {
          data: generateData(7.0, 1.5, timePoints),
          color: () => '#0066ff',
          strokeWidth: 2,
        },
      ],
    };
  }, [timeRange]);

  const selectedStation = stations.find(s => s.id === selectedStationId);

  if (!selectedStation) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Aucune station trouvée</Text>
      </View>
    );
  }

  const stats = {
    phMin: 6.8,
    phMax: 7.6,
    phAvg: 7.2,
    tempMin: 22.1,
    tempMax: 26.5,
    tempAvg: 24.3,
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Historique des Mesures</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Calendar size={18} color="#0066ff" />
          <Text style={styles.sectionTitle}>Période</Text>
        </View>
        <View style={styles.timeRangeButtons}>
          {(['24h', '72h', '7d'] as const).map(range => (
            <TouchableOpacity
              key={range}
              style={[
                styles.timeButton,
                timeRange === range && styles.timeButtonActive,
              ]}
              onPress={() => setTimeRange(range)}
            >
              <Text
                style={[
                  styles.timeButtonText,
                  timeRange === range && styles.timeButtonTextActive,
                ]}
              >
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.chartTitle}>Évolution du pH</Text>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={220}
          chartConfig={{
            backgroundColor: '#1a1f26',
            backgroundGradientFrom: '#1a1f26',
            backgroundGradientTo: '#1a1f26',
            color: () => '#0066ff',
            labelColor: () => '#999',
            style: { borderRadius: 8 },
            propsForLabels: { fontSize: 11 },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.statsGrid}>
        <StatCard label="pH Min" value={stats.phMin.toFixed(2)} color="#33aa33" />
        <StatCard label="pH Max" value={stats.phMax.toFixed(2)} color="#ff6666" />
        <StatCard label="pH Moyen" value={stats.phAvg.toFixed(2)} color="#0066ff" />
        <StatCard label="Temp Min" value={`${stats.tempMin}°C`} color="#33aa33" />
        <StatCard label="Temp Max" value={`${stats.tempMax}°C`} color="#ff6666" />
        <StatCard label="Temp Moyen" value={`${stats.tempAvg}°C`} color="#0066ff" />
      </View>

      <View style={styles.card}>
        <TouchableOpacity style={styles.exportButton}>
          <Text style={styles.exportButtonText}>Exporter en CSV</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a1f26',
    borderBottomWidth: 1,
    borderBottomColor: '#2d3139',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  card: {
    backgroundColor: '#1a1f26',
    margin: 16,
    borderRadius: 8,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  timeRangeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#0f1419',
    borderWidth: 1,
    borderColor: '#2d3139',
    alignItems: 'center',
  },
  timeButtonActive: {
    backgroundColor: '#0066ff',
    borderColor: '#0066ff',
  },
  timeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  timeButtonTextActive: {
    color: '#fff',
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: '#1a1f26',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  exportButton: {
    backgroundColor: '#0066ff',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  exportButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  spacer: {
    height: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
});
