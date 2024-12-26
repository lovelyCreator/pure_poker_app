
"use client"; // If you are using Next.js or similar
import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useEffect } from 'react';
import 'react-native-reanimated';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useColorScheme } from '@/hooks/useColorScheme'; // Assuming this is your custom hook
import Home from './home';
import React from 'react';
import Providers from '@/components/providers'; // Ensure this is correctly set up
import AuthProvider from '@/hooks/useAuth'; // Ensure this is correctly set up
import LoadingPage from '@/components/page/loading'; // Loading component for suspense
import PlayPoker from './playPoker';
import SignIn from './index';
import NotFound from './notFound';
import useUserDetails from '@/hooks/useFetchUserFetails';
import NotLoggedIn from '@/app/notLoggedIn';
import { Toaster } from '@/components/ui/sonner';
const Stack = createNativeStackNavigator();


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
    return null; // Show nothing while fonts are loading
  }

  return (
    <Providers>
      <Suspense fallback={<LoadingPage />}>
        <AuthProvider>
          <Stack.Navigator>
            <Stack.Screen name='notFound' options={{ headerShown: false }} component={NotFound} />
            <Stack.Screen name='home' options={{ headerShown: false }} component={Home} />
            <Stack.Screen name='playPoker' options={{ headerShown: false }} component={PlayPoker} initialParams={{ gameId: null }} />
            <Stack.Screen name='index' options={{ headerShown: false }} component={SignIn} />
          </Stack.Navigator>
        </AuthProvider>
      </Suspense>
      <StatusBar hidden={true} />
      {/* <Toaster theme="dark" position="top-right" duration={2500} /> */}
    </Providers>
  );
}