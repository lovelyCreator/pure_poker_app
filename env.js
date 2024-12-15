import { z } from 'zod';
import { config } from 'dotenv';

config(); // Load environment variables from .env

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
  NEXT_PUBLIC_AUTH_API_URL: process.env.AUTH_API_URL,
  NEXT_PUBLIC_POKER_WEB_SOCKET_URL: process.env.POKER_WEB_SOCKET_URL,
  NEXT_PUBLIC_COMMUNITY_URL: process.env.COMMUNITY_URL,
  NEXT_PUBLIC_GROUP_URL: process.env.GROUP_URL,
  NEXT_PUBLIC_GROUP_WEB_SOCKET_URL: process.env.GROUP_WEB_SOCKET_URL,
  NEXT_PUBLIC_POKER_URL: process.env.POKER_URL,
  NEXT_PUBLIC_RADAR_TOKEN: process.env.RADAR_TOKEN,
});