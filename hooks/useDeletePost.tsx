import { communityApi } from "@/api";
import { useMutation } from "@tanstack/react-query";

export function useDeletePost() {
  async function INNER_deletePost(postId: string) {
    const res = await communityApi.post[":id"].$delete({
      param: {
        id: postId,
      },
    });

    if (res.ok) {
      return false;
    }
    if (res.status === 401) {
      return true;
    }
    if (!res.ok) {
      const error = await res.json();
      if ("message" in error) {
        throw new Error(error.message);
      } else {
        throw new Error("Unknown error");
      }
    }
  }

  async function deletePost(postId: string) {
    const isUnauthorized = await INNER_deletePost(postId);

    if (isUnauthorized) {
      // Handle unauthorized access, e.g., show a toast or redirect to login.
    }
  }

  return useMutation({
    mutationKey: ["delete-post"],
    mutationFn: deletePost,
  });
}
