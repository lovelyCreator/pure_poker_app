import { type User } from "@/types/user";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSuspenseQuery } from "@tanstack/react-query";
import { handleResponse } from "@/lib/fetch";
import { env } from "@/env";

export default function useUserDetails() {


  async function INNER_FetchUserDetails(): Promise<[User | null, boolean]> {
    try {
      const token = await AsyncStorage.getItem('PP_TOKEN');
      console.log("Token---------------------> ", token)
      const res = await fetch(`${env.NEXT_PUBLIC_AUTH_API_URL}/general/validate_token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
          // Add any other headers if needed, e.g., Authorization
        },
      });
      
      await handleResponse(res);
      if (res.status === 404) {
        console.log("404 FetchUser")
        // throw new Error("Invalid credentials");
        return [null, true];
      }
      if (res.status === 401) {
        console.log("401 FetchUser")
        return [null, true];
      }
      if (res.ok) {
        const user = await res.json();
        console.log("200 FetchUser")
        // user.chips = Number(centsToDollars(user.chips));
        return [user as User, false];
      }
      console.log("500 FetchUser")
      // throw new Error("Invalid credentials");
      return [null, true];
    } catch (e) {
    //   router.push("/sign-in");
      return [null, true];
    }
  }

  async function fetchUserDetails() {
    const [user, isLoggedOut] = await INNER_FetchUserDetails();
    if (isLoggedOut) {
      return null;
    }
    return user;
  }

  return useSuspenseQuery({
    queryKey: ["user"],
    queryFn: fetchUserDetails,
  });
  // return {'user': fetchUserDetails()}
}
