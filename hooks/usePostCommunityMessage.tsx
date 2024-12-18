import { communityApi } from "@/api/api";
import { refreshToken } from "@/lib/fetch";
import { useMutation } from "@tanstack/react-query";
export default function usePostCommunityMessage() {
  async function INNER_postCommunityMessage(
    message: string,
  ): Promise<[string, boolean]> {
    try {
      const res = await communityApi.post.$post({
        json: {
          content: message,
        },
      });

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
