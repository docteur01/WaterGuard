export interface AlertThreshold {
  ph: {
    min: number;
    max: number;
  };
  temperature: {
    min: number;
    max: number;
  };
  turbidity: {
    max: number;
  };
  conductivity: {
    max: number;
  };
  dissolved_oxygen: {
    min: number;
  };
}

export interface Alert {
  id: string;
  stationId: string;
  type: 'pH' | 'temperature' | 'turbidity' | 'conductivity' | 'dissolved_oxygen' | 'battery';
  severity: 'low' | 'medium' | 'high';
  message: string;
  value: number;
  threshold: number;
  timestamp: string;
  acknowledged: boolean;
}

export interface Station {
  id: string;
  name: string;
}

export const DEFAULT_ALERT_THRESHOLDS: AlertThreshold = {
  ph: { min: 6.5, max: 8.5 },
  temperature: { min: 15, max: 30 },
  turbidity: { max: 5 },
  conductivity: { max: 1500 },
  dissolved_oxygen: { min: 4 },
};

export const getStationName = (stationId: string, stations: Station[]): string => {
  return stations.find(s => s.id === stationId)?.name || 'Station inconnue';
};
