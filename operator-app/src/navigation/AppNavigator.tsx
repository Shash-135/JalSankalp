import React, { useEffect, useState } from 'react';
import { NavigationContainerRef, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ScanQRScreen from '../screens/ScanQRScreen';
import PumpDetailsScreen from '../screens/PumpDetailsScreen';
import PumpControlScreen from '../screens/PumpControlScreen';
import WorkHistoryScreen from '../screens/WorkHistoryScreen';
import MaintenanceScreen from '../screens/MaintenanceScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { getStoredToken } from '../services/authService';

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  ScanQR: undefined;
  PumpDetails: { pumpId: string } | undefined;
  PumpControl: { pump: any } | undefined;
  WorkHistory: undefined;
  Maintenance: { pump: any } | undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
export const navigationRef: NavigationContainerRef<RootStackParamList> = createNavigationContainerRef();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Login');

  useEffect(() => {
    (async () => {
      const stored = await getStoredToken();
      setInitialRoute(stored ? 'Dashboard' : 'Login');
    })();
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="ScanQR" component={ScanQRScreen} />
      <Stack.Screen name="PumpDetails" component={PumpDetailsScreen} />
      <Stack.Screen name="PumpControl" component={PumpControlScreen} />
      <Stack.Screen name="WorkHistory" component={WorkHistoryScreen} />
      <Stack.Screen name="Maintenance" component={MaintenanceScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
