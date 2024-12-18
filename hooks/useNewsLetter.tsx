"use client";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { communityApi } from "@/api/api";
import { S3Image } from "@/types/community";
import AsyncStorage from "@react-native-async-storage/async-storage";
const NEXT_PUBLIC_COMMUNITY_URL="https://ffbv7v2te1.execute-api.us-east-1.amazonaws.com/prod";
interface NewsletterQuery {
  communityName: string;
  page: number;
}

// Define the expected response type (adjust as necessary based on your API response)
interface NewsletterResponse {
  // Define the structure of the response here
  // For example:
  data: any; // Replace 'any' with the actual type
}
export default function useNewsLetter(communityName: string) {
  // Internal function to fetch newsletter messages
  async function INNER_fetchNewsLetter(
    pageParam: string,
  ): Promise<[S3Image[]| null, boolean]> {
    const query = { communityName, page: pageParam };
    const baseUrl = NEXT_PUBLIC_COMMUNITY_URL; // Replace with your actual API endpoint
    
    // Create a URL object
    const url = new URL(baseUrl);

    // Append query parameters from the query object
    Object.keys(query).forEach(key => url.searchParams.append(key, query[key as keyof NewsletterQuery]));
    const token = await AsyncStorage.getItem('PP_TOKEN')
    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        // Add any other headers if needed, e.g., Authorization
      },
    })

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
