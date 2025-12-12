import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStations } from './useStations';

export interface Alert {
  id: string;
  stationId: string;
  type: 'ph_low' | 'ph_high' | 'temperature' | 'turbidity' | 'conductivity' | 'oxygen' | 'battery';
  message: string;
  value: number;
  threshold: number;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedAt?: string;
}

const MOCK_ALERTS: Alert[] = [
  {
    id: 'alert_1',
    stationId: 'WELL_002',
    type: 'ph_low',
    message: 'pH trop bas détecté',
    value: 6.1,
    threshold: 6.5,
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    acknowledged: false,
  },
  {
    id: 'alert_2',
    stationId: 'WELL_002',
    type: 'oxygen',
    message: 'Oxygène dissous faible',
    value: 4.2,
    threshold: 5.0,
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    acknowledged: false,
  },
  {
    id: 'alert_3',
    stationId: 'WELL_004',
    type: 'battery',
    message: 'Batterie faible',
    value: 15,
    threshold: 20,
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    acknowledged: true,
    acknowledgedAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

export function useAlerts() {
  const { stations } = useStations();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = useCallback(async () => {
    try {
      const cached = await AsyncStorage.getItem('alerts');
      if (cached) {
        setAlerts(JSON.parse(cached));
      } else {
        setAlerts(MOCK_ALERTS);
        await AsyncStorage.setItem('alerts', JSON.stringify(MOCK_ALERTS));
      }
    } catch (error) {
      console.log('[v0] Error loading alerts:', error);
      setAlerts(MOCK_ALERTS);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAlertWithStationName = useCallback((alert: Alert) => {
    const station = stations.find(s => s.id === alert.stationId);
    return {
      ...alert,
      stationName: station?.name || 'Station inconnue',
    };
  }, [stations]);

  const acknowledgeAlert = useCallback(async (alertId: string) => {
    const updated = alerts.map(a =>
      a.id === alertId
        ? {
            ...a,
            acknowledged: true,
            acknowledgedAt: new Date().toISOString(),
          }
        : a
    );
    setAlerts(updated);
    await AsyncStorage.setItem('alerts', JSON.stringify(updated));
  }, [alerts]);

  const deleteAlert = useCallback(async (alertId: string) => {
    const updated = alerts.filter(a => a.id !== alertId);
    setAlerts(updated);
    await AsyncStorage.setItem('alerts', JSON.stringify(updated));
  }, [alerts]);

  const getUnacknowledgedCount = useCallback(() => {
    return alerts.filter(a => !a.acknowledged).length;
  }, [alerts]);

  return {
    alerts: alerts.map(getAlertWithStationName),
    loading,
    acknowledgeAlert,
    deleteAlert,
    getUnacknowledgedCount,
    refreshAlerts: loadAlerts,
  };
}
