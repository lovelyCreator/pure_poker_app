import { type User } from "@/types/user";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigation } from '@react-navigation/native';
import { authApi } from "@/api/api";
import { centsToDollars } from "@/utils/magnitudeConversion";
import { handleResponse, refreshToken } from "@/lib/fetch";

export default function useUserDetails() {

  console.log("useUserDetails ========>")
  const navigation = useNavigation();

  async function INNER_FetchUserDetails(): Promise<[User | null, boolean]> {
    try {
      const NEXT_PUBLIC_AUTH_API_URL="https://905ok7ze53.execute-api.us-east-1.amazonaws.com/prod"
      const token = await AsyncStorage.getItem('PP_TOKEN');

      console.log("token => ", token)

      const res = await fetch(`${NEXT_PUBLIC_AUTH_API_URL}/general/validate_token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
          // Add any other headers if needed, e.g., Authorization
        },
      });
      
      handleResponse(res);
      if (res.status === 404) {
        navigation.navigate("index");
        // throw new Error("Invalid credentials");
        return [null, true];
      }
      if (res.status === 401) {
        return [null, true];
      }
      if (res.ok) {
        const user = await res.json();
        // user.chips = Number(centsToDollars(user.chips));
        return [user as User, false];
      }
      // throw new Error("Invalid credentials");
      return [null, true];
    } catch (e) {
    //   router.push("/sign-in");
        navigation.navigate("index");
      return [null, true];
    }
  }

  async function fetchUserDetails() {
    console.log("fetchUserDetails ==========> ")
    const [user, isLoggedOut] = await INNER_FetchUserDetails();
    if (isLoggedOut) {
      return null;
    }
    return user;
  }

  // return useSuspenseQuery({
  //   queryKey: ["user"],
  //   queryFn: fetchUserDetails,
  //   retry: 1,
  //   retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  // });
  return {'user': fetchUserDetails()}
}
