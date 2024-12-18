"use client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { communityApi } from "@/api/api";
import { S3Image } from "@/types/community";

export default function useNewsLetter(communityName: string) {
  // Internal function to fetch newsletter messages
  async function INNER_fetchNewsLetter(
    pageParam: string,
  ): Promise<[S3Image[]| null, boolean]> {
    const res = await communityApi.newsLetter.$get({
      query: { communityName, page: pageParam },
    });

    if (!res.ok) {
      if (res.status === 401) {
        return [null, true];
      }
      // throw new Error(`Failed to fetch newsletter messages: ${res.statusText}`);
      return [[], false];
    }

    const data = await res.json();
    const images = data.images.map((url: string) => ({ url }));
    return [images, false]; // Return messages and unauthorized status as false
  }

  // Main fetch function to handle errors and responses
  async function fetchNewsLetter(pageParam: number) {
    const [images, isUnauthorized] = await INNER_fetchNewsLetter(pageParam.toString());

    if (isUnauthorized) {
      throw new Error("Unauthorized");
    }

    if (!images) {
      throw new Error("An error occurred while fetching newsletter images");
    }

    return { images, hasNextPage: images.length === 20 }; // Assuming 20 images per page
  }

  return useSuspenseInfiniteQuery({
    queryKey: ["newsletter", communityName],
    queryFn: ({ pageParam = 0 }) => fetchNewsLetter(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.images.length / 20 : undefined,
    staleTime: 60000,
    retry: 1,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    initialPageParam: 0,
  });
}
