import { pokerApi } from "@/api/api";
import { refreshToken } from "@/lib/fetch";
import type { GameState } from "@/types/poker";

import { useSuspenseQuery } from "@tanstack/react-query";

export default function useGameState(gameId: string) {
  async function INNER_getGameState(
    gameId: string,
  ): Promise<[GameState | null, boolean]> {
    const res = await pokerApi.poker.$get({ query: { gameId } });
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
