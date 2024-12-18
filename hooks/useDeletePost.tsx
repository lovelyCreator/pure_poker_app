import { communityApi } from "@/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
const NEXT_PUBLIC_COMMUNITY_URL="https://ffbv7v2te1.execute-api.us-east-1.amazonaws.com/prod";

export function useDeletePost() {
  async function INNER_deletePost(postId: string) {
    const token = await AsyncStorage.getItem('PP_TOKEN')
    const res = await fetch(`${NEXT_PUBLIC_COMMUNITY_URL}/post/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        // Add any other headers if needed, e.g., Authorization
      },
    });
    // const res = await communityApi.post[":id"].$delete({
    //   param: {
    //     id: postId,
    //   },
    // });

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
