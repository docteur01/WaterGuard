import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity, StyleSheet, Switch, TextInput } from 'react-native';
import { Bell, Lock, Sliders, FileText, LogOut } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../contexts/AuthContext';
import { useAlertThresholds } from '../contexts/useAlertThresholds';


export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { thresholds, updateThresholds, resetToDefaults } = useAlertThresholds();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
  });

  const navigation = useNavigation();

  const [tempThresholds, setTempThresholds] = useState(thresholds);

  useEffect(() => {
    setTempThresholds(thresholds);
  }, [thresholds]);

  const handleSaveThresholds = async () => {
    await updateThresholds(tempThresholds);

    Toast.show({
      type: 'success',
      text1: 'Succès',
      text2: "Seuils d'alerte mis à jour",
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: () => {
            logout();  // ton logout du contexte

            Toast.show({
              type: 'success',
              text1: 'Déconnecté',
              text2: 'Vous avez été déconnecté.',
            });

            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          } 
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Paramètres</Text>
      </View>

      <View style={styles.userCard}>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <Text style={styles.userRole}>{getRoleLabel(user?.role)}</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setExpandedSection(expandedSection === 'notif' ? null : 'notif')}
        >
          <Bell size={20} color="#0066ff" />
          <Text style={styles.sectionTitle}>Notifications</Text>
        </TouchableOpacity>

        {expandedSection === 'notif' && (
          <>
            <SettingToggle
              label="Notifications push"
              value={notifications.push}
              onToggle={val => setNotifications({ ...notifications, push: val })}
            />
            <SettingToggle
              label="Alertes par email"
              value={notifications.email}
              onToggle={val => setNotifications({ ...notifications, email: val })}
            />
            <SettingToggle
              label="Alertes par SMS"
              value={notifications.sms}
              onToggle={val => setNotifications({ ...notifications, sms: val })}
            />
          </>
        )}
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setExpandedSection(expandedSection === 'thresholds' ? null : 'thresholds')}
        >
          <Sliders size={20} color="#ff6666" />
          <Text style={styles.sectionTitle}>Seuils d'Alerte</Text>
        </TouchableOpacity>

        {expandedSection === 'thresholds' && (
          <View style={styles.thresholdContainer}>
            <ThresholdInput
              label="pH minimum"
              value={tempThresholds.ph.min}
              onChangeText={val =>
                setTempThresholds({
                  ...tempThresholds,
                  ph: { ...tempThresholds.ph, min: parseFloat(val) || 0 },
                })
              }
            />
            <ThresholdInput
              label="pH maximum"
              value={tempThresholds.ph.max}
              onChangeText={val =>
                setTempThresholds({
                  ...tempThresholds,
                  ph: { ...tempThresholds.ph, max: parseFloat(val) || 0 },
                })
              }
            />
            <ThresholdInput
              label="Température min (°C)"
              value={tempThresholds.temperature.min}
              onChangeText={val =>
                setTempThresholds({
                  ...tempThresholds,
                  temperature: { ...tempThresholds.temperature, min: parseFloat(val) || 0 },
                })
              }
            />
            <ThresholdInput
              label="Température max (°C)"
              value={tempThresholds.temperature.max}
              onChangeText={val =>
                setTempThresholds({
                  ...tempThresholds,
                  temperature: { ...tempThresholds.temperature, max: parseFloat(val) || 0 },
                })
              }
            />
            <ThresholdInput
              label="Turbidité max (NTU)"
              value={tempThresholds.turbidity.max}
              onChangeText={val =>
                setTempThresholds({
                  ...tempThresholds,
                  turbidity: { max: parseFloat(val) || 0 },
                })
              }
            />
            <ThresholdInput
              label="Conductivité max (µS/cm)"
              value={tempThresholds.conductivity.max}
              onChangeText={val =>
                setTempThresholds({
                  ...tempThresholds,
                  conductivity: { max: parseFloat(val) || 0 },
                })
              }
            />
            <ThresholdInput
              label="Oxygène dissous min (mg/L)"
              value={tempThresholds.dissolved_oxygen.min}
              onChangeText={val =>
                setTempThresholds({
                  ...tempThresholds,
                  dissolved_oxygen: { min: parseFloat(val) || 0 },
                })
              }
            />

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={handleSaveThresholds}
              >
                <Text style={styles.buttonText}>Enregistrer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => {
                  resetToDefaults();
                  setExpandedSection(null);
                }}
              >
                <Text style={styles.buttonTextSecondary}>Réinitialiser</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.linkButton}>
          <Lock size={18} color="#0066ff" />
          <Text style={styles.linkText}>Modifier le mot de passe</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton}>
          <FileText size={18} color="#0066ff" />
          <Text style={styles.linkText}>Mentions légales</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={18} color="#fff" />
        <Text style={styles.logoutButtonText}>Déconnexion</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.version}>WaterGuard v1.0.0</Text>
        <Text style={styles.footerText}>© 2025 Gestion des Puits</Text>
      </View>
    </ScrollView>
  );
}

function SettingToggle({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: (val: boolean) => void;
}) {
  return (
    <View style={styles.settingItem}>
      <Text style={styles.settingLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#2d3139', true: '#0066ff' }}
        thumbColor={value ? '#fff' : '#999'}
      />
    </View>
  );
}

function ThresholdInput({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: number;
  onChangeText: (text: string) => void;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value.toString()}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        placeholderTextColor="#666"
      />
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
  userCard: {
    backgroundColor: '#1a1f26',
    margin: 16,
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#0066ff',
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: '#999',
    marginBottom: 8,
  },
  userRole: {
    fontSize: 12,
    color: '#0066ff',
    fontWeight: '600',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    flex: 1,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1f26',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 13,
    color: '#ccc',
    flex: 1,
  },
  thresholdContainer: {
    backgroundColor: '#1a1f26',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#0f1419',
    borderWidth: 1,
    borderColor: '#2d3139',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 14,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#0066ff',
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: '#2d3139',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonTextSecondary: {
    color: '#0066ff',
    fontWeight: '600',
    fontSize: 14,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1f26',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 8,
    gap: 10,
  },
  linkText: {
    fontSize: 13,
    color: '#0066ff',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#ff3333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 20,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  version: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  footerText: {
    fontSize: 11,
    color: '#666',
  },
});
