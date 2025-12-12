import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Alert as RNAlert,
} from 'react-native';

import { useStations } from '../contexts/useStations';
import { useAlerts } from '../contexts/useAlerts';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react-native';

export default function AdminScreen() {
  const { stations } = useStations();
  const { alerts } = useAlerts();
  const [activeTab, setActiveTab] = useState<'stations' | 'users' | 'settings'>('stations');
  const [newStationName, setNewStationName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddStation = () => {
    if (!newStationName) {
      RNAlert.alert('Erreur', 'Veuillez entrer un nom');
      return;
    }
    RNAlert.alert('Succès', 'Station ajoutée (démo)');
    setNewStationName('');
    setShowAddForm(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Administration</Text>
      </View>

      <View style={styles.tabs}>
        {(['stations', 'users', 'settings'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab === 'stations' && 'Stations'}
              {tab === 'users' && 'Utilisateurs'}
              {tab === 'settings' && 'Paramètres'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'stations' && (
          <>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddForm(!showAddForm)}
            >
              <Plus size={20} color="#fff" />
              <Text style={styles.addButtonText}>Ajouter une station</Text>
            </TouchableOpacity>

            {showAddForm && (
              <View style={styles.formBox}>
                <TextInput
                  style={styles.input}
                  placeholder="Nom de la station"
                  placeholderTextColor="#666"
                  value={newStationName}
                  onChangeText={setNewStationName}
                />
                <TouchableOpacity
                  style={styles.formButton}
                  onPress={handleAddStation}
                >
                  <Text style={styles.formButtonText}>Créer</Text>
                </TouchableOpacity>
              </View>
            )}

            <FlatList
              data={stations}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.stationItem}>
                  <View style={styles.stationHeader}>
                    <View>
                      <Text style={styles.stationName}>{item.name}</Text>
                      <Text style={styles.stationMeta}>{item.location}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            item.status === 'online'
                              ? '#00d08466'
                              : item.status === 'alert'
                              ? '#ff333366'
                              : '#66666666',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          {
                            color:
                              item.status === 'online'
                                ? '#00d084'
                                : item.status === 'alert'
                                ? '#ff3333'
                                : '#999',
                          },
                        ]}
                      >
                        {item.status === 'online' ? 'En ligne' : item.status === 'alert' ? 'Alerte' : 'Hors ligne'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.stationActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Edit size={16} color="#0066ff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Trash2 size={16} color="#ff3333" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </>
        )}

        {activeTab === 'users' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gestion des Utilisateurs</Text>
            <View style={styles.usersList}>
              {[
                { name: 'Admin User', role: 'Super Admin', email: 'admin@waterguard.com' },
                { name: 'Manager User', role: 'Gestionnaire', email: 'manager@waterguard.com' },
                { name: 'Technicien', role: 'Technicien', email: 'tech@waterguard.com' },
              ].map((user, idx) => (
                <View key={idx} style={styles.userItem}>
                  <View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <Text style={styles.userRole}>{user.role}</Text>
                  </View>
                  <TouchableOpacity style={styles.editUserButton}>
                    <Edit size={16} color="#0066ff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'settings' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Paramètres Globaux</Text>
            <View style={styles.settingsList}>
              <SettingItem label="Seuil pH min" value="6.5" />
              <SettingItem label="Seuil pH max" value="8.5" />
              <SettingItem label="Temp max (°C)" value="30" />
              <SettingItem label="Turbidité max (NTU)" value="5" />
              <SettingItem label="O₂ min (mg/L)" value="5" />
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function SettingItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.settingItem}>
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={styles.settingValue}>
        <TextInput
          style={styles.settingInput}
          value={value}
          editable={false}
        />
        <TouchableOpacity style={styles.editButton}>
          <Edit size={16} color="#0066ff" />
        </TouchableOpacity>
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
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  addButton: {
    backgroundColor: '#0066ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  formBox: {
    backgroundColor: '#1a1f26',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#2d3139',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#0f1419',
    marginBottom: 10,
  },
  formButton: {
    backgroundColor: '#00d084',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  formButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  stationItem: {
    backgroundColor: '#1a1f26',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  stationMeta: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  stationActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2d3139',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  usersList: {
    gap: 10,
  },
  userItem: {
    backgroundColor: '#1a1f26',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 11,
    color: '#0066ff',
    fontWeight: '500',
  },
  editUserButton: {
    padding: 8,
  },
  settingsList: {
    gap: 10,
  },
  settingItem: {
    backgroundColor: '#1a1f26',
    borderRadius: 8,
    padding: 12,
  },
  settingLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  settingValue: {
    flexDirection: 'row',
    gap: 8,
  },
  settingInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#2d3139',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0066ff',
    fontWeight: '600',
    backgroundColor: '#0f1419',
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#2d3139',
    borderRadius: 6,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
});
