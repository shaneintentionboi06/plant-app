import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { Colors } from '@/constants/theme';

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Inject Google Fonts link dynamically for web rendering
      const linkId = 'botanical-fonts';
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href =
          'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap';
        document.head.appendChild(link);
      }

      // Base body styling
      if (document.body) {
        document.body.style.backgroundColor = Colors.surface;
        document.body.style.margin = '0';
        document.body.style.fontFamily = '"Plus Jakarta Sans", sans-serif';
      }

      // Page Title
      document.title = 'Botanical Living | Rare Plants & Handcrafted Vessels';
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.surface },
        }}
      />
    </SafeAreaProvider>
  );
}
