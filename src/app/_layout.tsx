import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, BalooBhaijaan2_400Regular, BalooBhaijaan2_500Medium, BalooBhaijaan2_600SemiBold, BalooBhaijaan2_700Bold, BalooBhaijaan2_800ExtraBold } from '@expo-google-fonts/baloo-bhaijaan-2';
import { StoreProvider, useStore } from '../lib/store';

function Gate() {
  const { ready } = useStore();
  const [fonts] = useFonts({ BalooBhaijaan2_400Regular, BalooBhaijaan2_500Medium, BalooBhaijaan2_600SemiBold, BalooBhaijaan2_700Bold, BalooBhaijaan2_800ExtraBold });
  if (!ready || !fonts) return <View style={{ flex: 1, backgroundColor: '#FFD36E', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color="#4B2CA0" size="large" /></View>;
  return <Stack id={undefined} screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />;
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <StatusBar style="dark" />
        <Gate />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
