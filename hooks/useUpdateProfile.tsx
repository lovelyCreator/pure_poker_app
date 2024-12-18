import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/api";

export default function useUpdateProfile() {
  const queryClient = useQueryClient();
  async function updateProfile(update: { email?: string; password?: string; profilePicture?: string; }) {
    const res = await authApi.modification.update_profile.$post({
      json: update,
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
