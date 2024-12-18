import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import Home from './home';
import React from 'react';
import Providers from '@/components/providers';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Providers>

    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'SignIn', headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="ad-redirect" options={{ title: 'Ad Redirect'}} />
        <Stack.Screen name="home" options={{ title: 'Home', headerShown: false}} />
        <Stack.Screen name="account" options={{ title: 'Account', headerShown: false}} />
        <Stack.Screen name="community" options={{ title: 'Community', headerShown: false}} />
        <Stack.Screen name="groups" options={{ title: 'Groups', headerShown: false}} />
        <Stack.Screen name="layout" options={{ title: 'Layout', headerShown: false}} />
        <Stack.Screen name="play-poker" options={{ title: 'Play-poker', headerShown: false}} />
        <Stack.Screen name="reward" options={{ title: 'Reward', headerShown: false}} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    </Providers>
  );
}
