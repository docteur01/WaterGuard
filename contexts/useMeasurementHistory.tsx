import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Measurement } from './useStations';

export interface HistoryPoint {
  timestamp: string;
  measurements: Measurement;
}

export function useMeasurementHistory(stationId: string) {
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [stationId]);

  const loadHistory = useCallback(async () => {
    try {
      const key = `history_${stationId}`;
      const cached = await AsyncStorage.getItem(key);
      
      if (cached) {
        setHistory(JSON.parse(cached));
      } else {
        // Generate mock historical data
        const mockHistory = generateMockHistory();
        setHistory(mockHistory);
        await AsyncStorage.setItem(key, JSON.stringify(mockHistory));
      }
    } catch (error) {
      console.log('[v0] Error loading history:', error);
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  return {
    history,
    loading,
    getRange: (hours: number) => {
      const cutoff = new Date(Date.now() - hours * 3600000);
      return history.filter(h => new Date(h.timestamp) >= cutoff);
    },
    refreshHistory: loadHistory,
  };
}

function generateMockHistory(): HistoryPoint[] {
  const data: HistoryPoint[] = [];
  const now = new Date();

  for (let i = 72; i >= 0; i--) {
    data.push({
      timestamp: new Date(now.getTime() - i * 3600000).toISOString(),
      measurements: {
        ph: 7.2 + (Math.random() - 0.5) * 0.6,
        temperature: 24.5 + (Math.random() - 0.5) * 3,
        turbidity: 2.1 + (Math.random() - 0.5) * 2,
        conductivity: 850 + (Math.random() - 0.5) * 100,
        dissolved_oxygen: 6.8 + (Math.random() - 0.5) * 1,
      },
    });
  }

  return data;
}
