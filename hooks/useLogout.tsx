import { useMutation } from "@tanstack/react-query";

import { authApi } from "@/api/api";

export default function useLogout() {
  async function logout() {
    const res = await authApi.general.logout.$post();
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
