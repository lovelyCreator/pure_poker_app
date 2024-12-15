import { env } from "@/env";
import { type Span } from "@/utils/logging";

export async function getGroupUrl(
  groupId: string,
  userId: string,
  o_span: Span,
) {
  const span = o_span.span("getGroupUrl", { groupId, userId });

  const queryParams = [
    `groupId=${encodeURIComponent(groupId)}`,
    `userId=${userId}`,
  ];

  span.info("Constructing GroupUrl");

  const queryString = `?${queryParams.join("&")}`;
  const groupUrl = `${env.NEXT_PUBLIC_GROUP_WEB_SOCKET_URL}/${queryString}`;

  span.info("GroupUrl:", groupUrl);
  return groupUrl;
}
