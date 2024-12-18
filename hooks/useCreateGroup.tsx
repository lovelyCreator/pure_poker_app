import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { groupApi } from "@/api/api";
import { refreshToken } from "@/lib/fetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
const NEXT_PUBLIC_GROUP_URL="https://mit6px8qoa.execute-api.us-east-1.amazonaws.com/prod";

export default function useCreateGroup() {
  const queryClient = useQueryClient();

  // Inner function to handle the actual API request
  async function INNER_createGroup(
    groupName: string,
    description: string,
    privacy: "public" | "private"
  ): Promise<[string, boolean]> {
    const token = await AsyncStorage.getItem('PP_TOKEN')
    const res = await fetch(`${NEXT_PUBLIC_GROUP_URL}/createGroup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        // Add any other headers if needed, e.g., Authorization
      },
      body: JSON.stringify({
        groupName,
        description,
        privacy,
      })
    });
    // const res = await groupApi.createGroup.$post({
    //   json: {
    //     groupName,
    //     description,
    //     privacy,
    //   },
    // });

    // Handle success case
    if (res.status === 200) {
      // Invalidate cache to refetch and re-render the group list
      queryClient
        .invalidateQueries({
          queryKey: ["user-groups"],
        })
        .then(() => {
          console.log("Group list updated");
        })
        .catch((e) => {
          console.error(e);
        });
      return ["Group created successfully", false];
    }

    // Handle error cases
    if (res.status === 400 || res.status === 500) {
      const error = await res.json();
      return [error.message || "Failed to create group", true];
    }

    // Handle authentication error
    if (res.status === 401) {
      return ["Unauthorized", true];
    }

    return ["Unexpected error occurred. Please try again later.", true];
  }

  // Main function to handle the group creation and retry on auth error
  async function createGroup(
    groupName: string,
    description: string,
    privacy: "public" | "private"
  ) {
    let [message, isError] = await INNER_createGroup(
      groupName,
      description,
      privacy
    );

    // Retry if authentication error occurs
    if (isError && message === "Unauthorized") {
      await refreshToken();
      [message, isError] = await INNER_createGroup(
        groupName,
        description,
        privacy
      );
      await queryClient.invalidateQueries({
        queryKey: ["user-groups"],
      });
    }

    return [isError, message];
  }

  // Hook's mutation function
  return useMutation({
    mutationFn: (data: {
      groupName: string;
      description: string;
      privacy: "public" | "private";
    }) => {
      return createGroup(data.groupName, data.description, data.privacy);
    },
    mutationKey: ["createGroup"],
  });
}
