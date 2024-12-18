import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
const NEXT_PUBLIC_AUTH_API_URL="https://905ok7ze53.execute-api.us-east-1.amazonaws.com/prod"

export default function useUpdateProfile() {
  const queryClient = useQueryClient();
  async function updateProfile(update: { email?: string; password?: string; profilePicture?: string; }) {
    const token = await AsyncStorage.getItem('PP_TOKEN');
    const res = await fetch(`${NEXT_PUBLIC_AUTH_API_URL}/general/validate_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        // Add any other headers if needed, e.g., Authorization
      },
      body: JSON.stringify({update})
    });
    if (res.ok) {
      queryClient
        .invalidateQueries({
          queryKey: ["user"],
        })
        .then(() => {
          console.log("Profile updated");
        })
        .catch((e) => {
          console.error("Error updating profile", e);
        });
      return res;
    }
    if (!res.ok) {
      const error = (await res.json() as {message: string;});
      throw new Error(error.message);
    }
    throw new Error("Error updating profile");
  }

  return useMutation({
    mutationKey: ["update-profile"],
    mutationFn: updateProfile,
  });
}
