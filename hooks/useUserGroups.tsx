import { groupApi } from "@/api/api";
import { refreshToken } from "@/lib/fetch";
import type { Group } from "@/types/group";
import { useSuspenseQuery } from "@tanstack/react-query";


export default function useUserGroups() {
    async function INNER_getUserGroups() {
      const res = await groupApi.getUserGroups.$get();
      //@ts-expect-error - Middleware aren't accounted for in the types so we know more than the types
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
      // @ts-expect-error - We know that res[0] is object with groups the array of groups
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return res[0].groups as Group[];
    }
    return useSuspenseQuery({
      queryKey: ["user-groups"],
      queryFn: () => getUserGroups(),
      // refetchInterval: 1000 * 60 * 5,
    });
  }
  