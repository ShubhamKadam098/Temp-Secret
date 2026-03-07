import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/env";
import type { Duration } from "@upstash/ratelimit";

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

export const createRatelimit = (requests: number, window: Duration) => {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
  });
};

export const publicRateLimit = createRatelimit(10, "60 s");

export const secretViewRateLimit = createRatelimit(30, "60 s");
