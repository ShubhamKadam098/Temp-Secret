import Redis from "ioredis";
import { RateLimiterRedis, RateLimiterRes } from "rate-limiter-flexible";
import { env } from "@/env";

const shouldUseTls =
  env.REDIS_HOST.includes("upstash.io") || env.REDIS_PORT === 6380;

const redisOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  enableOfflineQueue: false,
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  tls: shouldUseTls ? {} : undefined,
};

export const redis = new Redis(redisOptions);

let redisConnectionPromise: Promise<void> | null = null;

export const ensureRedisReady = async () => {
  if (redis.status === "ready") {
    return;
  }

  if (!redisConnectionPromise) {
    redisConnectionPromise = (async () => {
      if (redis.status === "wait" || redis.status === "end") {
        await redis.connect();
        return;
      }

      await new Promise<void>((resolve, reject) => {
        const handleReady = () => {
          cleanup();
          resolve();
        };

        const handleError = (error: Error) => {
          cleanup();
          reject(error);
        };

        const handleEnd = () => {
          cleanup();
          reject(new Error("Redis connection closed before becoming ready"));
        };

        const cleanup = () => {
          redis.off("ready", handleReady);
          redis.off("error", handleError);
          redis.off("end", handleEnd);
        };

        redis.once("ready", handleReady);
        redis.once("error", handleError);
        redis.once("end", handleEnd);
      });
    })().finally(() => {
      redisConnectionPromise = null;
    });
  }

  await redisConnectionPromise;
};

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

export const consumeRateLimit = async (
  limiter: RateLimiterRedis,
  key: string
) => {
  await ensureRedisReady();
  return limiter.consume(key);
};

export const isRateLimitExceeded = (
  error: unknown
): error is RateLimiterRes => {
  if (!error || typeof error !== "object") {
    return false;
  }

  return (
    "msBeforeNext" in error &&
    "remainingPoints" in error &&
    "consumedPoints" in error
  );
};
