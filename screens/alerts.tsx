import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert as RNAlert,
} from 'react-native';
import { useAlerts } from '../contexts/useAlerts';
import { AlertCircle, Check, Trash2 } from 'lucide-react-native';
 
export default function AlertsScreen() {
  const { alerts, acknowledgeAlert, deleteAlert, getUnacknowledgedCount } = useAlerts();
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  const unacknowledged = alerts.filter(a => !a.acknowledged);
  const acknowledged = alerts.filter(a => a.acknowledged);
  const displayed = showAcknowledged ? acknowledged : unacknowledged;

  const handleAcknowledge = (alert: any) => {
    acknowledgeAlert(alert.id);
    RNAlert.alert('Succès', 'Alerte acquittée');
  };

  const handleDelete = (alertId: string) => {
    RNAlert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer cette alerte?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: () => {
            deleteAlert(alertId);
            RNAlert.alert('Succès', 'Alerte supprimée');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Alertes</Text>
          <Text style={styles.subtitle}>{unacknowledged.length} non acquittée(s)</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, !showAcknowledged && styles.tabActive]}
          onPress={() => setShowAcknowledged(false)}
        >
          <Text
            style={[styles.tabText, !showAcknowledged && styles.tabTextActive]}
          >
            Non acquittées ({unacknowledged.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, showAcknowledged && styles.tabActive]}
          onPress={() => setShowAcknowledged(true)}
        >
          <Text
            style={[styles.tabText, showAcknowledged && styles.tabTextActive]}
          >
            Acquittées ({acknowledged.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayed}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.alertCard, item.acknowledged && styles.alertCardAcknowledged]}>
            <View style={styles.alertHeader}>
              <View style={styles.alertIconContainer}>
                <AlertCircle size={20} color={item.acknowledged ? '#666' : '#ff3333'} />
              </View>
              <View style={styles.alertInfo}>
                <Text style={styles.alertStation}>{item.stationName}</Text>
                <Text style={styles.alertMessage}>{item.message}</Text>
                <Text style={styles.alertTime}>{formatTime(item.timestamp)}</Text>
              </View>
            </View>

            <View style={styles.alertValue}>
              <Text style={styles.alertValueText}>{item.value.toFixed(1)}</Text>
              <Text style={styles.alertThreshold}>Seuil: {item.threshold}</Text>
            </View>

            {!item.acknowledged && (
              <TouchableOpacity
                style={styles.acknowledgeButton}
                onPress={() => handleAcknowledge(item)}
              >
                <Check size={16} color="#fff" />
                <Text style={styles.acknowledgeText}>Acquitter</Text>
              </TouchableOpacity>
            )}
            {item.acknowledged && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Trash2 size={16} color="#fff" />
                <Text style={styles.deleteText}>Supprimer</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <AlertCircle size={48} color="#666" />
            <Text style={styles.emptyText}>
              {showAcknowledged ? 'Aucune alerte acquittée' : 'Aucune alerte'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) return `il y a ${diffMins}m`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `il y a ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `il y a ${diffDays}j`;
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
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#999',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#1a1f26',
    borderBottomWidth: 1,
    borderBottomColor: '#2d3139',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#0066ff',
  },
  tabText: {
    fontSize: 13,
    color: '#999',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  alertCard: {
    backgroundColor: '#1a1f26',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#ff3333',
  },
  alertCardAcknowledged: {
    borderLeftColor: '#00d084',
    opacity: 0.6,
  },
  alertHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  alertIconContainer: {
    marginRight: 10,
    marginTop: 2,
  },
  alertInfo: {
    flex: 1,
  },
  alertStation: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  alertMessage: {
    fontSize: 13,
    color: '#ccc',
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 11,
    color: '#666',
  },
  alertValue: {
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#0f1419',
    borderRadius: 4,
  },
  alertValueText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ff3333',
  },
  alertThreshold: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  acknowledgeButton: {
    backgroundColor: '#00d084',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    paddingVertical: 8,
    gap: 6,
  },
  acknowledgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#ff3333',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    paddingVertical: 8,
    gap: 6,
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    marginTop: 12,
  },
});
