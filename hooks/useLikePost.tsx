import { communityApi } from "@/api/api";
import { useMutation } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
const NEXT_PUBLIC_COMMUNITY_URL="https://ffbv7v2te1.execute-api.us-east-1.amazonaws.com/prod";

export default function useLikePost() {
  async function INNER_likePost(postId: string) {
    const token = await AsyncStorage.getItem('PP_TOKEN')
    const res = await fetch(`${NEXT_PUBLIC_COMMUNITY_URL}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        // Add any other headers if needed, e.g., Authorization
      },
      body: JSON.stringify({
        postId: postId,
      })
    })
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

  async function likePost(postId: string) {
    const isUnauthorized = await INNER_likePost(postId);

    if (isUnauthorized) {
      // Handle unauthorized
    }
  }

  return useMutation({
    mutationKey: ["like-post"],
    mutationFn: likePost,
  });
}

export function useDislikePost() {
  async function INNER_dislikePost(postId: string) {
    const token = await AsyncStorage.getItem('PP_TOKEN')
    const res = await fetch(`${NEXT_PUBLIC_COMMUNITY_URL}/like/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        // Add any other headers if needed, e.g., Authorization
      },
    })
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
  async function dislikePost(postId: string) {
    const isUnauthorized = await INNER_dislikePost(postId);
    if (isUnauthorized) {
      // Handle unauthorized
    }
  }

  return useMutation({
    mutationKey: ["dislike-post"],
    mutationFn: dislikePost,
  });
}
