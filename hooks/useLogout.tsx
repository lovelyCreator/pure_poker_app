import { useMutation } from "@tanstack/react-query";

import { authApi } from "@/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { env } from "@/env";
export default function useLogout() {
  async function logout() {
    // const res = await authApi.general.logout.$post();
    const token = await AsyncStorage.getItem('PP_TOKEN');
    const res = await fetch(`${env.NEXT_PUBLIC_AUTH_API_URL}/general/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        // Add any other headers if needed, e.g., Authorization
      },
    });
    if (!res.ok) {
      throw new Error("Invalid credentials");
    }
    localStorage.removeItem("PP_TOKEN");
    window.location.href = "/sign-in";
    if (!res.ok) {
      throw new Error("Invalid credentials");
    }
  }
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: () => {
      return logout();
    },
  });
}
