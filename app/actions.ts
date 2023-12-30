"use server";

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { cookies } from "next/headers";

const redis = new Redis({
  url: "https://mutual-eel-38811.upstash.io",
  token:
    "AZebASQgMjczMWRhYTQtYmM1ZS00YWZiLThmNzktMDEyZDRmZmM3NDRmNjM1ODk5OGJiNzlmNGZhYWEwZmM4YTkyZjI5NTcyMDg=",
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});

export async function useRatelimit() {
  const ip_address = cookies().get("ip_address")?.value as string;

  console.log(ip_address);

  const { success, limit, reset, remaining } = await ratelimit.limit(
    ip_address
  );

  if (!success) {
    return {
      success: false,
      message: "Too many requests",
    };
  }

  return {
    success: true,
    message: `You have ${remaining} requests left. For ip ${ip_address}.`,
  };
}
