import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import Home from './home';
import React from 'react';
import Providers from '@/components/providers';
import AuthProvider from '@/hooks/useAuth';
import LoadingPage from '@/components/page/loading';
import PlayPoker from './playPoker';

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
      <Suspense fallback={<LoadingPage />}>
        <AuthProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack initialRouteName='index'>
              <Stack.Screen name="index" options={{ title: 'SignIn', headerShown: false }} />
              {/* <Stack.Screen name="(auth)" options={{ headerShown: false }} /> */}
              <Stack.Screen name="+not-found" options={{ headerShown: false}}/>
              {/* <Stack.Screen name="ad-redirect" options={{ title: 'Ad Redirect'}} /> */}
              <Stack.Screen name="home" options={{ title: 'Home', headerShown: false}} />
              {/* <Stack.Screen name="account" options={{ title: 'Account', headerShown: false}} />
              <Stack.Screen name="community" options={{ title: 'Community', headerShown: false}} />
              <Stack.Screen name="groups" options={{ title: 'Groups', headerShown: false}} />
              <Stack.Screen name="layout" options={{ title: 'Layout', headerShown: false}} /> */}
              <Stack.Screen 
                name="playPoker" 
                options={{ title: 'PlayPoker', headerShown: false }} 
                initialParams={{ gameId: null }} 
              />
              <Stack.Screen name="reward" options={{ title: 'Reward', headerShown: false}} />
            </Stack>
          </ThemeProvider>
        </AuthProvider>
        </Suspense>
        <StatusBar hidden={true} />
    </Providers>
  );
}
