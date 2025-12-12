import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NetInfo } from '@react-native-community/netinfo';

export interface QueuedOperation {
  id: string;
  type: 'measurement' | 'calibration' | 'field_report';
  data: any;
  timestamp: string;
  synced: boolean;
}

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [queue, setQueue] = useState<QueuedOperation[]>([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    checkConnection();
    // Listen for connectivity changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? true);
      if (state.isConnected) {
        syncQueue();
      }
    });

    loadQueue();
    return () => unsubscribe();
  }, []);

  const loadQueue = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem('sync_queue');
      if (stored) {
        setQueue(JSON.parse(stored));
      }
    } catch (error) {
      console.log('[v0] Error loading sync queue:', error);
    }
  }, []);

  const checkConnection = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();
      setIsOnline(state.isConnected ?? true);
    } catch (error) {
      console.log('[v0] Error checking connection:', error);
    }
  }, []);

  const addToQueue = useCallback(async (operation: Omit<QueuedOperation, 'id'>) => {
    const newOp: QueuedOperation = {
      ...operation,
      id: `${Date.now()}_${Math.random()}`,
    };
    const updated = [...queue, newOp];
    setQueue(updated);
    try {
      await AsyncStorage.setItem('sync_queue', JSON.stringify(updated));
    } catch (error) {
      console.log('[v0] Error adding to queue:', error);
    }
  }, [queue]);

  const syncQueue = useCallback(async () => {
    if (syncing || queue.length === 0) return;

    setSyncing(true);
    try {
      // Simulate API sync - in production, this would send to backend
      const unsyncedOps = queue.filter(op => !op.synced);
      
      for (const op of unsyncedOps) {
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 500));
        op.synced = true;
      }

      setQueue(queue);
      await AsyncStorage.setItem('sync_queue', JSON.stringify(queue));
    } catch (error) {
      console.log('[v0] Error syncing queue:', error);
    } finally {
      setSyncing(false);
    }
  }, [queue, syncing]);

  const clearSynced = useCallback(async () => {
    const remaining = queue.filter(op => !op.synced);
    setQueue(remaining);
    try {
      await AsyncStorage.setItem('sync_queue', JSON.stringify(remaining));
    } catch (error) {
      console.log('[v0] Error clearing synced:', error);
    }
  }, [queue]);

  return {
    isOnline,
    queue,
    syncing,
    addToQueue,
    syncQueue,
    clearSynced,
  };
}
