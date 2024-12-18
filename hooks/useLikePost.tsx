import { communityApi } from "@/api/api";
import { useMutation } from "@tanstack/react-query";

export default function useLikePost() {
  async function INNER_likePost(postId: string) {
    const res = await communityApi.like.$post({
      json: {
        postId: postId,
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
    const res = await communityApi.like[":id"].$delete({
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
