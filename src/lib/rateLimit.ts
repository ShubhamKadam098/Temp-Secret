import Redis from "ioredis";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { env } from "@/env";

const redisOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  enableOfflineQueue: false,
};

export const redis = new Redis(redisOptions);

export const createRatelimit = (requests: number, windowMs: number) => {
  return new RateLimiterRedis({
    storeClient: redis,
    keyPrefix: "ratelimit",
    points: requests,
    duration: windowMs / 1000,
  });
};

export const publicRateLimit = createRatelimit(10, 60 * 1000);

export const secretViewRateLimit = createRatelimit(30, 60 * 1000);
