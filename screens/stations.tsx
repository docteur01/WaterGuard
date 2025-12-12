import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Search, MapPin } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import { useStations } from '../contexts/useStations';

export default function StationsScreen() {
  const { stations } = useStations();
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'alert' | 'offline'>('all');

  const filtered = stations.filter(station => {
    const matchesSearch =
      station.name.toLowerCase().includes(searchText.toLowerCase()) ||
      station.location.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === 'all' || station.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Stations</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Search size={18} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Chercher une station..."
            placeholderTextColor="#666"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <View style={styles.filters}>
        {(['all', 'online', 'alert', 'offline'] as const).map(status => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              filterStatus === status && styles.filterButtonActive,
            ]}
            onPress={() => setFilterStatus(status)}
          >
            <Text
              style={[
                styles.filterText,
                filterStatus === status && styles.filterTextActive,
              ]}
            >
              {getFilterLabel(status)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('StationDetail', { id: item.id })}
          >
            <View style={styles.stationCard}>
              <View style={styles.stationHeader}>
                <View style={styles.statusIndicator}>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          item.status === 'online'
                            ? '#00d084'
                            : item.status === 'alert'
                            ? '#ff3333'
                            : '#666',
                      },
                    ]}
                  />
                </View>

                <View style={styles.stationInfo}>
                  <Text style={styles.stationName}>{item.name}</Text>
                  <View style={styles.locationRow}>
                    <MapPin size={12} color="#999" />
                    <Text style={styles.stationLocation}>{item.location}</Text>
                  </View>
                </View>

                {item.alertCount > 0 && (
                  <View style={styles.alertBadge}>
                    <Text style={styles.alertCount}>{item.alertCount}</Text>
                  </View>
                )}
              </View>

              <View style={styles.measurements}>
                <View style={styles.measurement}>
                  <Text style={styles.measurementLabel}>pH</Text>
                  <Text style={styles.measurementValue}>{item.lastMeasurement.ph.toFixed(1)}</Text>
                </View>
                <View style={styles.measurement}>
                  <Text style={styles.measurementLabel}>Temp</Text>
                  <Text style={styles.measurementValue}>{item.lastMeasurement.temperature.toFixed(1)}°</Text>
                </View>
                <View style={styles.measurement}>
                  <Text style={styles.measurementLabel}>O₂</Text>
                  <Text style={styles.measurementValue}>{item.lastMeasurement.dissolved_oxygen.toFixed(1)}</Text>
                </View>
                <View style={styles.measurement}>
                  <Text style={styles.measurementLabel}>Bat</Text>
                  <Text style={styles.measurementValue}>{item.battery}%</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}

        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

function getFilterLabel(status: string): string {
  switch (status) {
    case 'online':
      return 'En ligne';
    case 'alert':
      return 'Alertes';
    case 'offline':
      return 'Hors ligne';
    default:
      return 'Tous';
  }
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
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1f26',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#2d3139',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    color: '#fff',
    fontSize: 14,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#1a1f26',
    borderWidth: 1,
    borderColor: '#2d3139',
  },
  filterButtonActive: {
    backgroundColor: '#0066ff',
    borderColor: '#0066ff',
  },
  filterText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  stationCard: {
    backgroundColor: '#1a1f26',
    borderRadius: 8,
    marginVertical: 6,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#0066ff',
  },
  stationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  statusIndicator: {
    marginRight: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stationLocation: {
    fontSize: 12,
    color: '#999',
  },
  alertBadge: {
    backgroundColor: '#ff3333',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  alertCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  measurements: {
    flexDirection: 'row',
    gap: 8,
  },
  measurement: {
    flex: 1,
    backgroundColor: '#0f1419',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  measurementLabel: {
    fontSize: 10,
    color: '#999',
    marginBottom: 2,
  },
  measurementValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0066ff',
  },
});
