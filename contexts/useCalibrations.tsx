import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CalibrationRecord {
  id: string;
  stationId: string;
  sensorType: 'ph' | 'temperature' | 'turbidity' | 'conductivity' | 'oxygen';
  calibratedAt: string;
  calibrationValue: number;
  standardValue: number;
  technician: string;
  notes: string;
  nextCalibrationDate: string;
}

export interface FieldReport {
  id: string;
  stationId: string;
  reportedAt: string;
  reportType: 'maintenance' | 'repair' | 'inspection' | 'other';
  title: string;
  description: string;
  photos: string[];
  technician: string;
  status: 'pending' | 'completed';
}

const MOCK_CALIBRATIONS: CalibrationRecord[] = [
  {
    id: 'cal_1',
    stationId: 'WELL_001',
    sensorType: 'ph',
    calibratedAt: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
    calibrationValue: 7.0,
    standardValue: 7.0,
    technician: 'Jean Dupont',
    notes: 'Calibration réussie avec solutions 7.0 et 10.0',
    nextCalibrationDate: new Date(Date.now() + 23 * 24 * 3600000).toISOString(),
  },
];

const MOCK_REPORTS: FieldReport[] = [
  {
    id: 'report_1',
    stationId: 'WELL_001',
    reportedAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    reportType: 'maintenance',
    title: 'Maintenance préventive',
    description: 'Nettoyage des capteurs effectué. Tous les capteurs en bon état.',
    photos: [],
    technician: 'Jean Dupont',
    status: 'completed',
  },
];

export function useCalibrations() {
  const [calibrations, setCalibrations] = useState<CalibrationRecord[]>([]);
  const [reports, setReports] = useState<FieldReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [calData, repData] = await Promise.all([
        AsyncStorage.getItem('calibrations'),
        AsyncStorage.getItem('fieldReports'),
      ]);

      if (calData) setCalibrations(JSON.parse(calData));
      else setCalibrations(MOCK_CALIBRATIONS);

      if (repData) setReports(JSON.parse(repData));
      else setReports(MOCK_REPORTS);
    } catch (error) {
      console.log('[v0] Error loading calibrations:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCalibration = useCallback(async (cal: Omit<CalibrationRecord, 'id'>) => {
    const newCal = { ...cal, id: `cal_${Date.now()}` };
    const updated = [...calibrations, newCal];
    setCalibrations(updated);
    await AsyncStorage.setItem('calibrations', JSON.stringify(updated));
  }, [calibrations]);

  const addReport = useCallback(async (report: Omit<FieldReport, 'id'>) => {
    const newReport = { ...report, id: `report_${Date.now()}` };
    const updated = [...reports, newReport];
    setReports(updated);
    await AsyncStorage.setItem('fieldReports', JSON.stringify(updated));
  }, [reports]);

  return {
    calibrations,
    reports,
    loading,
    addCalibration,
    addReport,
  };
}
