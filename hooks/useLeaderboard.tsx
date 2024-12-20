"use client";
import { pokerApi } from "@/api/api";
import { LeaderboardData } from "@/types/community";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSuspenseQuery } from "@tanstack/react-query";
import { env } from "@/env";

// Function to fetch the leaderboard data
export default function useLeaderboard() {
  async function getLeaderboard() {
    const token = AsyncStorage.getItem('PP_TOKEN');
    const res = await fetch(`${env.NEXT_PUBLIC_POKER_URL}leaderboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        // Add any other headers if needed, e.g., Authorization
      },
    })
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
