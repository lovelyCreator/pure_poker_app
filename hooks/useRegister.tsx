import { authApi } from "@/api";
import { handleResponse } from "@/lib/fetch";
import { useMutation } from "@tanstack/react-query";

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
      const res = await authApi.general.register.$post({
        json: {
          email,
          username,
          password,
          unblockCode,
          referralCode,
        },
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
