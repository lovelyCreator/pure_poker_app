// hooks/useUnreadCounts.ts
import { useState, useEffect } from 'react';
import { groupApi } from "@/api/api";
import { useAuth } from "@/hooks/useAuth"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
const NEXT_PUBLIC_GROUP_URL="https://mit6px8qoa.execute-api.us-east-1.amazonaws.com/prod";

export default function useUnreadCounts() {
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuth();

  useEffect(() => {
    async function fetchUnreadCounts() {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('PP_TOKEN')
        const res = await fetch(`${NEXT_PUBLIC_GROUP_URL}/unreadMessagesPerGroup`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            // Add any other headers if needed, e.g., Authorization
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUnreadCounts(data.unreadCounts);
        } else {
          setError(res.statusText);
          console.error('Failed to fetch unread counts:', res.statusText);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Unknown error');
          console.error('Error fetching unread counts:', err.message);
        } else {
          setError('An unexpected error occurred');
          console.error('Error fetching unread counts:', err);
        }
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) {
      void fetchUnreadCounts();
    }
  }, [user?.id]);

  return { unreadCounts, loading, error, setUnreadCounts };
}
