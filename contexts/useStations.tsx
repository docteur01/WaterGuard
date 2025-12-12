import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Measurement {
  ph: number;
  temperature: number;
  turbidity: number;
  conductivity: number;
  dissolved_oxygen: number;
}

export interface Station {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'alert';
  lastMeasurement: Measurement;
  lastUpdate: string;
  latitude: number;
  longitude: number;
  alertCount: number;
  battery: number;
}

const MOCK_STATIONS: Station[] = [
  {
    id: 'WELL_001',
    name: 'Puits Municipal #1',
    location: 'Centre-ville',
    status: 'online',
    lastMeasurement: {
      ph: 7.2,
      temperature: 24.5,
      turbidity: 2.1,
      conductivity: 850,
      dissolved_oxygen: 6.8,
    },
    lastUpdate: new Date(Date.now() - 5 * 60000).toISOString(),
    latitude: 3.8667,
    longitude: 11.5167,
    alertCount: 0,
    battery: 92,
  },
  {
    id: 'WELL_002',
    name: 'Puits Nord',
    location: 'Zone Nord',
    status: 'alert',
    lastMeasurement: {
      ph: 6.1,
      temperature: 22.0,
      turbidity: 5.3,
      conductivity: 920,
      dissolved_oxygen: 4.2,
    },
    lastUpdate: new Date(Date.now() - 15 * 60000).toISOString(),
    latitude: 3.9,
    longitude: 11.52,
    alertCount: 2,
    battery: 45,
  },
  {
    id: 'WELL_003',
    name: 'Puits Est',
    location: 'Zone Est',
    status: 'online',
    lastMeasurement: {
      ph: 7.5,
      temperature: 25.2,
      turbidity: 1.8,
      conductivity: 780,
      dissolved_oxygen: 7.1,
    },
    lastUpdate: new Date(Date.now() - 2 * 60000).toISOString(),
    latitude: 3.85,
    longitude: 11.6,
    alertCount: 0,
    battery: 87,
  },
  {
    id: 'WELL_004',
    name: 'Puits Ouest',
    location: 'Zone Ouest',
    status: 'offline',
    lastMeasurement: {
      ph: 7.0,
      temperature: 23.0,
      turbidity: 2.5,
      conductivity: 810,
      dissolved_oxygen: 6.5,
    },
    lastUpdate: new Date(Date.now() - 2 * 3600000).toISOString(),
    latitude: 3.83,
    longitude: 11.48,
    alertCount: 1,
    battery: 15,
  },
];

export function useStations() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = useCallback(async () => {
    try {
      const cached = await AsyncStorage.getItem('stations');
      if (cached) {
        setStations(JSON.parse(cached));
      } else {
        setStations(MOCK_STATIONS);
        await AsyncStorage.setItem('stations', JSON.stringify(MOCK_STATIONS));
      }
    } catch (error) {
      console.log('[v0] Error loading stations:', error);
      setStations(MOCK_STATIONS);
    } finally {
      setLoading(false);
    }
  }, []);

  const getStation = useCallback((id: string) => {
    return stations.find(s => s.id === id);
  }, [stations]);

  const updateStationMeasurement = useCallback(async (stationId: string, measurement: Measurement) => {
    const updated = stations.map(s => 
      s.id === stationId 
        ? {
            ...s,
            lastMeasurement: measurement,
            lastUpdate: new Date().toISOString(),
            status: 'online' as const,
          }
        : s
    );
    setStations(updated);
    await AsyncStorage.setItem('stations', JSON.stringify(updated));
  }, [stations]);

  return {
    stations,
    loading,
    getStation,
    updateStationMeasurement,
    refreshStations: loadStations,
  };
}
