"use client";
import { groupApi } from "@/api/api";
import { refreshToken } from "@/lib/fetch";
import { AvailableGroup } from "@/types/group";
import { useSuspenseQuery } from "@tanstack/react-query";

// Function to get available groups
export default function useAvailableGroups() {
  async function INNER_getAvailableGroups() {
    const res = await groupApi.getAvailableGroups.$get();
    if (res.ok) {
      const data = await res.json();
      return [data, false];
    }
    if (res.status === 401) {
      return [null, true];
    }
    if (!res.ok) {
      const error = await res.json();
      if ("message" in error) {
        throw new Error(error.message);
      } else {
        throw new Error("Unknown error");
      }
    }
    throw new Error("Unknown error");
  }

  async function getAvailableGroups() {
    let [res, isUnauthorized] = await INNER_getAvailableGroups();
    if (isUnauthorized) {
      await refresh_token();
      [res, isUnauthorized] = await INNER_getAvailableGroups();
    }
    if (isUnauthorized) {
      //TODO: Handle unauthorized
    }
    return (res ?? []) as AvailableGroup[];
  }

  return useSuspenseQuery({
    queryKey: ["available-groups"],
    queryFn: () => getAvailableGroups(),
    // refetchInterval: 1000 * 60 * 5,  // Optional, depends on how frequently you need to refresh
  });
}
