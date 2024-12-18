"use client";
import { pokerApi } from "@/api/api";
import { AvailableGame } from "@/types/poker";
// import axios from "axios";
import { useSuspenseQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NEXT_PUBLIC_POKER_URL="https://2buvf2r3gk.execute-api.us-east-1.amazonaws.com/prod/" ;

// Function to get available games
export default function useAvailableGames(
  groupIds: string[],
  username: string,
) {
  async function getAvailableGames() {
    const token = await AsyncStorage.getItem('PP_TOKEN');
    const res = await fetch(`${NEXT_PUBLIC_POKER_URL}/poker`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        // Add any other headers if needed, e.g., Authorization
      },
      body: JSON.stringify({ groupIds, playerId: username })
    });
    if (res.ok) {
      return (await res.json()) as AvailableGame[];
    }
    if (!res.ok) {
      const error = await res.json();
      if (Array.isArray(error)) {
        throw new Error("An unknown error occurred");
      } else {
        throw new Error(error.message);
      }
    }
    return [];
  }

  return useSuspenseQuery({
    queryKey: ["available-games", groupIds],
    queryFn: () => getAvailableGames(),
    // refetchInterval: 1000 * 60 * 5,  // Optional, depends on how frequently you need to refresh
  });
}
