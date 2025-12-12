import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AlertThreshold, DEFAULT_ALERT_THRESHOLDS } from '../types/alerts';

export function useAlertThresholds() {
  const [thresholds, setThresholds] = useState<AlertThreshold>(DEFAULT_ALERT_THRESHOLDS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThresholds();
  }, []);

  const loadThresholds = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem('alert_thresholds');
      if (stored) {
        setThresholds(JSON.parse(stored));
      }
    } catch (error) {
      console.log('[v0] Error loading thresholds:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateThresholds = useCallback(async (newThresholds: Partial<AlertThreshold>) => {
    const updated = { ...thresholds, ...newThresholds };
    setThresholds(updated);
    try {
      await AsyncStorage.setItem('alert_thresholds', JSON.stringify(updated));
    } catch (error) {
      console.log('[v0] Error saving thresholds:', error);
    }
  }, [thresholds]);

  const resetToDefaults = useCallback(async () => {
    setThresholds(DEFAULT_ALERT_THRESHOLDS);
    try {
      await AsyncStorage.setItem('alert_thresholds', JSON.stringify(DEFAULT_ALERT_THRESHOLDS));
    } catch (error) {
      console.log('[v0] Error resetting thresholds:', error);
    }
  }, []);

  return { thresholds, loading, updateThresholds, resetToDefaults };
}
