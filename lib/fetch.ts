import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '@/api/api'; // Assuming you have your API client set up
import { Alert } from 'react-native'; // For displaying alerts
import { useNavigation } from '@react-navigation/native'; // For navigation
import axios from '@/api/axios';

const NEXT_PUBLIC_AUTH_API_URL="https://905ok7ze53.execute-api.us-east-1.amazonaws.com/prod"

// Type definition for ClientResponse (adapt as needed)
interface ClientResponse<T> {
  ok: boolean;
  status: number;
  headers: {
    get: (name: string) => string | null;
  };
}

/**
 * Handle the response from the server
 * @param response
 * @returns boolean - true if the token has been updated
 * @throws Error
 */
export async function handleResponse(response: ClientResponse<unknown>): Promise<boolean> {
  const token = response.headers.get('x-access-token');
  if (token) {
    await AsyncStorage.setItem('PP_TOKEN', token);
    return true;
  }
  return false;
}

export async function refreshToken(): Promise<boolean> {
  const navigation = useNavigation(); // Get navigation object

  try {
    // const res = await authApi.general.validate_token.$get();
    const res = await fetch(`${NEXT_PUBLIC_AUTH_API_URL}/general/validate_token`, get);
    const tokenUpdated = await handleResponse(res);

    if (res.status === 401 || res.status === 404) {
      // Navigate to sign-in screen
      navigation.navigate('/'); // Replace 'SignIn' with your screen name
      Alert.alert('Session Expired', 'Please sign in again.');
      return false;
    }
    return tokenUpdated; // Return true only if token was updated
  } catch (error) {
    console.error('Error refreshing token:', error);
    Alert.alert('Error', 'Failed to refresh token. Please try again later.');
    return false;
  }
}