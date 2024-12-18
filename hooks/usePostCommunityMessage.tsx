import { communityApi } from "@/api/api";
import { refreshToken } from "@/lib/fetch";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";
const NEXT_PUBLIC_COMMUNITY_URL="https://ffbv7v2te1.execute-api.us-east-1.amazonaws.com/prod";
export default function usePostCommunityMessage() {
  async function INNER_postCommunityMessage(
    message: string,
  ): Promise<[string, boolean]> {
    try {
      const token = await AsyncStorage.getItem('PP_TOKEN')
      const res = await fetch(`${NEXT_PUBLIC_COMMUNITY_URL}/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
          // Add any other headers if needed, e.g., Authorization
        },
        body: JSON.stringify({
          content: message
        })
      })

      if (res.status === 201) {
        return ["Message posted successfully", false];
      }
      if (res.status === 401) {
        return ["Unauthorized", true];
      }
      throw new Error("An error occurred while posting the message");
    } catch (e) {
      console.error(e);
      throw new Error("Something went wrong");
    }
  }

  async function postCommunityMessage(messageContent: string) {
    let [message, isAuthError] =
      await INNER_postCommunityMessage(messageContent);
    if (isAuthError) {
      await refreshToken();
      [message, isAuthError] = await INNER_postCommunityMessage(messageContent);
    }
    return message;
  }
  return useMutation({
    mutationKey: ["postCommunityMessage"],
    mutationFn: (data: { message: string }) => {
      return postCommunityMessage(data.message);
    },
  });
}
