import { pokerApi } from "@/api/api";
import { refreshToken } from "@/lib/fetch";
import type { GameState } from "@/types/poker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useSuspenseQuery } from "@tanstack/react-query";
const NEXT_PUBLIC_POKER_URL="https://2buvf2r3gk.execute-api.us-east-1.amazonaws.com/prod/" ;

export default function useGameState(gameId: string) {
  async function INNER_getGameState(
    gameId: string,
  ): Promise<[GameState | null, boolean]> {
    const token = await AsyncStorage.getItem('PP_TOKEN')
    // const res = await pokerApi.poker.$get({ query: { gameId } });
    const res = await fetch(`${NEXT_PUBLIC_POKER_URL}/poker/${gameId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        // Add any other headers if needed, e.g., Authorization
      },
    });
    if (res.ok) {
      return [await res.json(), false];
    }
    if (res.status === 401) {
      return [null, true];
    }
    if (res.status === 404) {
      return [null, true];
    }
    if (!res.ok) {
      const error = await res.json();
      if ("message" in error) {
        // eslint-disable-next-line
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
    return [null, false]; // Default return to satisfy TypeScript
  }
  async function getGameState(gameId: string): Promise<GameState | null> {
    let [res, isUnauthorized] = await INNER_getGameState(gameId);
    if (isUnauthorized) {
      await refreshToken();
      [res, isUnauthorized] = await INNER_getGameState(gameId);
      if (!isUnauthorized) {
        window.location.reload();
      }
    }
    return res;
  }

  return useSuspenseQuery({
    queryKey: ["getGameState", gameId],
    queryFn: () => getGameState(gameId),
    staleTime: 1,
  });
}
