"use client";
import { pokerApi } from "@/api/api";
import { AvailableGame } from "@/types/poker";
// import axios from "axios";
import { useSuspenseQuery } from "@tanstack/react-query";

// Function to get available games
export default function useAvailableGames(
  groupIds: string[],
  username: string,
) {
  async function getAvailableGames() {
    const res = await pokerApi.availableGames.$post({
      json: { groupIds, playerId: username },
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
