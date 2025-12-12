import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useStations } from '../contexts/useStations';
import { AlertCircle, TrendingUp } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const { stations, loading, refreshStations } = useStations();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refreshStations().then(() => setRefreshing(false));
  }, [refreshStations]);

  const alertCount = stations.filter(s => s.status === 'alert').length;
  const onlineCount = stations.filter(s => s.status === 'online').length;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour, {user?.name}</Text>
          <Text style={styles.role}>{getRoleLabel(user?.role)}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={[styles.statCard, styles.statOnline]}>
          <View style={styles.statContent}>
            <Text style={styles.statNumber}>{onlineCount}</Text>
            <Text style={styles.statLabel}>En ligne</Text>
          </View>
          <View style={styles.statIcon}>
            <TrendingUp size={28} color="#00d084" />
          </View>
        </View>

        <View style={[styles.statCard, styles.statAlert]}>
          <View style={styles.statContent}>
            <Text style={styles.statNumber}>{alertCount}</Text>
            <Text style={styles.statLabel}>Alertes</Text>
          </View>
          <View style={styles.statIcon}>
            <AlertCircle size={28} color="#ff3333" />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stations (total: {stations.length})</Text>
        <View style={styles.stationsList}>
          {stations.map(station => (
            <View key={station.id} style={styles.stationCard}>
              <View style={styles.stationHeader}>
                <View style={styles.stationNameContainer}>
                  <View
                    style={[
                      styles.statusDot,
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
                  <View>
                    <Text style={styles.stationName}>{station.name}</Text>
                    <Text style={styles.stationLocation}>{station.location}</Text>
                  </View>
                </View>
                <Text style={styles.batteryText}>🔋 {station.battery}%</Text>
              </View>

              <View style={styles.measurementGrid}>
                <MeasurementBox label="pH" value={station.lastMeasurement.ph.toFixed(1)} />
                <MeasurementBox label="Temp" value={`${station.lastMeasurement.temperature.toFixed(1)}°C`} />
                <MeasurementBox label="Turb" value={station.lastMeasurement.turbidity.toFixed(1)} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function MeasurementBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.measurementBox}>
      <Text style={styles.measurementLabel}>{label}</Text>
      <Text style={styles.measurementValue}>{value}</Text>
    </View>
  );
}

function getRoleLabel(role?: string): string {
  switch (role) {
    case 'super_admin':
      return 'Super Administrateur';
    case 'manager':
      return 'Gestionnaire';
    case 'technician':
      return 'Technicien';
    default:
      return 'Utilisateur';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#1a1f26',
    borderBottomWidth: 1,
    borderBottomColor: '#2d3139',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  role: {
    fontSize: 12,
    color: '#999',
  },
  logoutBtn: {
    backgroundColor: '#ff3333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  logoutText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statOnline: {
    backgroundColor: '#00d084',
    opacity: 0.15,
    borderLeftWidth: 3,
    borderLeftColor: '#00d084',
  },
  statAlert: {
    backgroundColor: '#ff3333',
    opacity: 0.15,
    borderLeftWidth: 3,
    borderLeftColor: '#ff3333',
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#aaa',
  },
  statIcon: {
    opacity: 0.7,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  stationsList: {
    gap: 10,
  },
  stationCard: {
    backgroundColor: '#1a1f26',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#0066ff',
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stationNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  stationLocation: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  batteryText: {
    fontSize: 12,
    color: '#aaa',
  },
  measurementGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  measurementBox: {
    flex: 1,
    backgroundColor: '#0f1419',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  measurementLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
  },
  measurementValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0066ff',
  },
});
