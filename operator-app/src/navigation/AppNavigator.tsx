import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../constants';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ScanQRScreen from '../screens/ScanQRScreen';
import PumpDetailsScreen from '../screens/PumpDetailsScreen';
import PumpControlScreen from '../screens/PumpControlScreen';
import WorkHistoryScreen from '../screens/WorkHistoryScreen';
import MaintenanceScreen from '../screens/MaintenanceScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  ScanQR: undefined;
  PumpDetails: { pump: any };
  PumpControl: { pumpId: string };
  WorkHistory: undefined;
  Maintenance: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer
      theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: COLORS.background } }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '800', fontSize: 17 },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        {!token ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Dashboard"   component={DashboardScreen}   options={{ title: 'Dashboard', headerShown: false }} />
            <Stack.Screen name="ScanQR"      component={ScanQRScreen}      options={{ title: 'Scan QR Code' }} />
            <Stack.Screen name="PumpDetails" component={PumpDetailsScreen} options={{ title: 'Pump Details' }} />
            <Stack.Screen name="PumpControl" component={PumpControlScreen} options={{ title: 'Pump Control' }} />
            <Stack.Screen name="WorkHistory" component={WorkHistoryScreen} options={{ title: 'Work History' }} />
            <Stack.Screen name="Maintenance" component={MaintenanceScreen} options={{ title: 'Maintenance Report' }} />
            <Stack.Screen name="Settings"    component={SettingsScreen}    options={{ title: 'Settings' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
