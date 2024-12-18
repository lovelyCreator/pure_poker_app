"use client";
import { groupApi } from "@/api/api";
import { refreshToken } from "@/lib/fetch";
import type { GroupDetails } from "@/types/group";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function useGroupDetails(groupId: string) {
  // Inner function to handle the actual API call
  async function INNER_getGroupDetails() {
    const res = await groupApi.getGroupDetails.$get({ query: { groupId } });

    // Handle token expiration and retry
    //@ts-expect-error - Middleware aren't accounted for in the types so we know more than the types
    if (res.status === 401) {
      return [null, true]; // Token expired, need refresh
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

  // Main function to handle token refreshing and final API call
  async function getGroupDetails() {
    if (!groupId) {
      return null;
    }
    let res = await INNER_getGroupDetails();
    if (res[1]) {
      await refreshToken();
      res = await INNER_getGroupDetails();
    }
    if (res[1]) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return res[0] as GroupDetails;
  }

  return useSuspenseQuery({
    queryKey: ["group-details", groupId],
    queryFn: () => getGroupDetails(),
  });
}
