import type React from "react"
import { createContext, useState, useContext, useEffect, useCallback } from "react"
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as ApiService from '../utils/ApiService'

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'manager' | 'technician' | 'viewer';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Mock users for demo
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'Ada@gmail.com': {
    password: '123',
    user: {
      id: '1',
      email: 'Ada@gmail.com',
      name: 'BADA',
      role: 'super_admin',
    },
  },
  'manager@waterguard.com': {
    password: 'demo123',
    user: {
      id: '2',
      email: 'manager@waterguard.com',
      name: 'Manager User',
      role: 'manager',
    },
  },
  'tech@waterguard.com': {
    password: 'demo123',
    user: {
      id: '3',
      email: 'tech@waterguard.com',
      name: 'Technicien',
      role: 'technician',
    },
  },
};

let authState: { user: User | null; isAuthenticated: boolean } = {
  user: null,
  isAuthenticated: false,
};

export function useAuth(): AuthContextType {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        authState = { user: parsedUser, isAuthenticated: true };
      }
    } catch (error) {
      console.log('[v0] Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    const mockUser = MOCK_USERS[email];
    
    if (!mockUser || mockUser.password !== password) {
      throw new Error('Email ou mot de passe incorrect');
    }

    await AsyncStorage.setItem('user', JSON.stringify(mockUser.user));
    setUser(mockUser.user);
    authState = { user: mockUser.user, isAuthenticated: true };
    //router.replace('/(app)/(tabs)/dashboard');
  }, [router]);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
    authState = { user: null, isAuthenticated: false };
    //router.replace('/(auth)/login');
  }, [router]);

  return {
    user,
    loading,
    isAuthenticated: authState.isAuthenticated,
    login,
    logout,
  };
}
