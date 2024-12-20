import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_AUTH_API_URL: z.string().url(),
  NEXT_PUBLIC_POKER_WEB_SOCKET_URL: z.string().url(),
  NEXT_PUBLIC_COMMUNITY_URL: z.string().url(),
  NEXT_PUBLIC_GROUP_URL: z.string().url(),
  NEXT_PUBLIC_GROUP_WEB_SOCKET_URL: z.string().url(),
  NEXT_PUBLIC_POKER_URL: z.string().url(),
  NEXT_PUBLIC_RADAR_TOKEN: z.string(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_AUTH_API_URL: "https://8kf7l869y9.execute-api.us-east-1.amazonaws.com/prod",
  NEXT_PUBLIC_COMMUNITY_URL: "https://3tfwtptzwc.execute-api.us-east-1.amazonaws.com/prod",
  NEXT_PUBLIC_GROUP_URL: "https://62ovwga0q8.execute-api.us-east-1.amazonaws.com/prod",
  NEXT_PUBLIC_GROUP_WEB_SOCKET_URL: "wss://3uftds06c8.execute-api.us-east-1.amazonaws.com/dev",
  NEXT_PUBLIC_POKER_URL: "https://b3krmcd7ai.execute-api.us-east-1.amazonaws.com/prod/",
  NEXT_PUBLIC_POKER_WEB_SOCKET_URL: "wss://4ca1ht5gi7.execute-api.us-east-1.amazonaws.com/dev",
  // NEXT_PUBLIC_POKER_WEB_SOCKET_URL: "wss://a9xf088cxk.execute-api.us-east-1.amazonaws.com/dev",
  NEXT_PUBLIC_RADAR_TOKEN: "prj_test_pk_cf656bda4d701461dc853a8d2cfadd1cb4884553",

});

// export const env = envSchema.parse({
//   NEXT_PUBLIC_AUTH_API_URL: "https://905ok7ze53.execute-api.us-east-1.amazonaws.com/prod",
//   NEXT_PUBLIC_COMMUNITY_URL: "https://ffbv7v2te1.execute-api.us-east-1.amazonaws.com/prod",
//   NEXT_PUBLIC_GROUP_URL: "https://mit6px8qoa.execute-api.us-east-1.amazonaws.com/prod",
//   NEXT_PUBLIC_GROUP_WEB_SOCKET_URL: "wss://wnny3m7es7.execute-api.us-east-1.amazonaws.com/dev",
//   NEXT_PUBLIC_POKER_URL: "https://2buvf2r3gk.execute-api.us-east-1.amazonaws.com/prod/",
//   NEXT_PUBLIC_POKER_WEB_SOCKET_URL: "wss://a9xf088cxk.execute-api.us-east-1.amazonaws.com/dev",
//   // NEXT_PUBLIC_POKER_WEB_SOCKET_URL: "wss://a9xf088cxk.execute-api.us-east-1.amazonaws.com/dev",
//   NEXT_PUBLIC_RADAR_TOKEN: "prj_test_pk_cf656bda4d701461dc853a8d2cfadd1cb4884553",

// });