import { env } from '@/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Type definitions (replace with your actual types)
type AuthAppRoutes = {}; // Replace with your actual Auth API routes
type GroupAppRoutes = {}; // Replace with your actual Group API routes
type CommunityAppRoutes = {}; // Replace with your actual Community API routes
type PokerAppRoutes = {}; // Replace with your actual Poker API routes

// Helper function to make API requests
async function makeApiRequest<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: any,
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`API request failed: ${response.status} - ${JSON.stringify(errorData)}`);
  }
  return await response.json();
}


// API clients using fetch and AsyncStorage
export const authApi = {
  async get<T>(path: keyof AuthAppRoutes, params?: any): Promise<T> {
    const token = await AsyncStorage.getItem('PP_TOKEN');
    return makeApiRequest<T>(`${env.NEXT_PUBLIC_AUTH_API_URL}${path}`, 'GET', params, token);
  },
  // Add other methods (POST, PUT, DELETE) as needed
};

export const groupApi = {
  async get<T>(path: keyof GroupAppRoutes, params?: any): Promise<T> {
    const token = await AsyncStorage.getItem('PP_TOKEN');
    return makeApiRequest<T>(`${env.NEXT_PUBLIC_GROUP_URL}${path}`, 'GET', params, token);
  },
  // Add other methods as needed
};

export const communityApi = {
  async get<T>(path: keyof CommunityAppRoutes, params?: any): Promise<T> {
    const token = await AsyncStorage.getItem('PP_TOKEN');
    return makeApiRequest<T>(`${env.NEXT_PUBLIC_COMMUNITY_URL}${path}`, 'GET', params, token);
  },
  // Add other methods as needed
};

export const pokerApi = {
  async get<T>(path: keyof PokerAppRoutes, params?: any): Promise<T> {
    const token = await AsyncStorage.getItem('PP_TOKEN');
    return makeApiRequest<T>(`${env.NEXT_PUBLIC_POKER_URL}${path}`, 'GET', params, token);
  },
  // Add other methods as needed
};