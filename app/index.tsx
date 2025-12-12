// App.tsx
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// contexts
import { useAuth } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import AppToast from '../contexts/AppToast';

// Screens
import StartScreen from '../navigation/StartScreen';
import OnboardingScreen from '../navigation/OnboardingScreen';
import LoginScreen from '../screens/auth/login';


import HomeScreen from '../screens/HomeScreen';
import AdminScreen from '../screens/admin';
import AlertsScreen from '../screens/alerts';
import MeasurementHistoryScreen from '../screens/measurement-history';
import SettingsScreen from '../screens/settings';
import StationsScreen from '../screens/stations';

import StationDetailScreen from '../screens/station-detail';
import FieldOperationsScreen from '../screens/field-operations';
import CalibrationScreen from '../screens/calibration'; 

import TestScreen from '../test/TestScreen';

export type RootStackParamList = {
  StartScreen: undefined;
  Onboarding: undefined;
  MainTabs: undefined;
  Login: undefined;
  
  Accueil: undefined;  
  AdminScreen: undefined;
  AlertsScreen: undefined;
  MeasurementHistoryScreen: undefined;
  SettingsScreen: undefined;
  StationsScreen: undefined;

  StationDetail: undefined;
  Calibration: undefined;
  FieldOperations: undefined;

  Test: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      initialRouteName="Accueil"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0066ff',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: '#1a1f26',
          borderTopColor: '#2d3139',
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
      }}
    >
      <Tab.Screen
        name="Accueil"
        component={HomeScreen}
        options={{
          title: 'Accueil',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Stations"
        component={StationsScreen}
        options={{
          title: 'Stations',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'map' : 'map-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          title: 'Alertes',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'alert-circle' : 'alert-circle-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/**
      <Tab.Screen
        name="History"
        component={MeasurementHistoryScreen}
        options={{
          title: 'Historique',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'time' : 'time-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      */}

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Paramètres',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} size={size} color={color} />
          ),
        }}
      />

      {user?.role === 'super_admin' && (
        <Tab.Screen
          name="Admin"
          component={AdminScreen}
          options={{
            title: 'Admin',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? 'shield' : 'shield-outline'} size={size} color={color} />
            ),
          }}
        />
      )}

      {__DEV__ && (
        <Tab.Screen
          name="Test"
          component={TestScreen}
          options={{
            title: 'Test',
            tabBarBadge: 'dev',
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons name={focused ? 'flask' : 'flask-outline'} size={size} color={color} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { user, loading } = useAuth();
  const [isFirstLaunch, setIsFirstLaunch] = React.useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      setIsFirstLaunch(hasSeenOnboarding === null);
    })();
  }, []);

  // Attente du chargement auth + onboarding check
  if (loading || isFirstLaunch === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#0066ff" />
      </View>
    );
  }

  const handleFinishOnboarding = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    setIsFirstLaunch(false);
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StartScreen" component={StartScreen} />
      <Stack.Screen name="Onboarding">
        {(props) => <OnboardingScreen {...props} onFinish={handleFinishOnboarding} />}
      </Stack.Screen>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Login" component={LoginScreen} />

      {/* les pages */}
      <Stack.Screen name="Accueil" component={HomeScreen} />
      <Stack.Screen name="AdminScreen" component={AdminScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="StationsScreen" component={StationsScreen} />

      <Stack.Screen name="StationDetail" component={StationDetailScreen} />
      <Stack.Screen name="Calibration" component={CalibrationScreen} />
      <Stack.Screen name="FieldOperations" component={FieldOperationsScreen} />


      <Stack.Screen name="Test" component={TestScreen} />

    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <LanguageProvider>
            <StatusBar style="light" />
              <SafeAreaView style={{ flex: 1, backgroundColor: '#4b6580ff' }}>
                <AppNavigator />
              </SafeAreaView>
            <AppToast />
          </LanguageProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}