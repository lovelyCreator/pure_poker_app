import { groupApi } from "@/api/api";
import { refreshToken } from "@/lib/fetch";
import type { Group } from "@/types/group";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSuspenseQuery } from "@tanstack/react-query";

const NEXT_PUBLIC_GROUP_URL="https://mit6px8qoa.execute-api.us-east-1.amazonaws.com/prod";
export default function useUserGroups() {
    async function INNER_getUserGroups() {
      const token = await AsyncStorage.getItem('PP_TOKEN')
      const res = await fetch(`${NEXT_PUBLIC_GROUP_URL}/getUserGroups`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
          // Add any other headers if needed, e.g., Authorization
        },
      });
      if (res.status === 401) {
        return [null, true];
      }
      if (res.ok) {
        return [await res.json(), false];
      }
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }
      throw new Error("Unknown error");
    }
  
    async function getUserGroups() {
      let res = await INNER_getUserGroups();
      if (res[1]) {
        await refreshToken();
        res = await INNER_getUserGroups();
      }
      if (res[1]) {
        return [];
      }
      return res[0].groups as Group[];
    }
    return useSuspenseQuery({
      queryKey: ["user-groups"],
      queryFn: () => getUserGroups(),
      // refetchInterval: 1000 * 60 * 5,
    });
  }
  