import { authApi } from "@/api/api";
import { handleResponse } from "@/lib/fetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
const NEXT_PUBLIC_AUTH_API_URL="https://905ok7ze53.execute-api.us-east-1.amazonaws.com/prod"

export default function useRegister() {
  async function register(
    email: string,
    username: string,
    password: string,
    unblockCode: string,
    referralCode?: string,
  ) {
    try {
      //eslint-disable-next-line
      const token = await AsyncStorage.getItem('PP_TOKEN');
      const res = await fetch(`${NEXT_PUBLIC_AUTH_API_URL}/general/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
          // Add any other headers if needed, e.g., Authorization
        },
        body: JSON.stringify({
          email, username, password, unblockCode, referralCode
        })
      });
      handleResponse(res);
      if (!res.ok) {
        const error = (await res.json() as {message: string;});
        throw new Error(error.message);
      }
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  }
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data: {
      email: string;
      username: string;
      password: string;
      unblockCode: string;
      referralCode?: string;
    }) => {
      return register(
        data.email,
        data.username,
        data.password,
        data.unblockCode,
        data.referralCode,
      );
    },
  });
}
