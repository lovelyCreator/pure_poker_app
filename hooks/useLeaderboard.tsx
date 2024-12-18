"use client";
import { pokerApi } from "@/api/api";
import { LeaderboardData } from "@/types/community";
import { useSuspenseQuery } from "@tanstack/react-query";

// Function to fetch the leaderboard data
export default function useLeaderboard() {
  async function getLeaderboard() {
    const res = await pokerApi.leaderboard.$get();
    if (res.ok) {
        return (await res.json()) as LeaderboardData;
    }
    return {
      dailyGains: [],
      weeklyGains: [],
      monthlyGains: [],
      yearlyGains: [],
      allTimeGains: [],
    };
  }

  return useSuspenseQuery({
    queryKey: ["leaderboard"],
    queryFn: getLeaderboard,
  });
}
