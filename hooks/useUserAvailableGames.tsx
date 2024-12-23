import { AvailableGame } from "@/types/poker";
// import axios from "axios";
import { useSuspenseQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { env } from "@/env";

// Function to get available games
export default function useAvailableGames(
  groupIds: string[],
  username: string,
) {
  let arr: AvailableGame[] = [];
  async function getAvailableGames() {
    const token = await AsyncStorage.getItem('PP_TOKEN');

    const res = await fetch(`${env.NEXT_PUBLIC_POKER_URL}availableGames`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        // Add any other headers if needed, e.g., Authorization
      },
      body: JSON.stringify({ groupIds, playerId: username })
    });
    if (res.ok) {      
      arr = await res.json() as AvailableGame[];
      console.log(`res`, arr)
      return arr;
    }
    if (!res.ok) {
      const error = await res.json();
      // if (Array.isArray(error)) {
      //   throw new Error("An unknown error occurred");
      // } else {
        throw new Error(error.message);
      // }
      
    }
  }

  return useSuspenseQuery({
    queryKey: ["availableGames", groupIds],
    queryFn: () => getAvailableGames(),
    // refetchInterval: 1000 * 60 * 5,  // Optional, depends on how frequently you need to refresh
  });
}
