import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// In-memory fallback for development
const memoryStorage = new Map();

// Create Redis instance with fallback
let redis: Redis | undefined;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = Redis.fromEnv();
  }
} catch (error) {
  console.warn("Redis not configured, using in-memory rate limiting for development");
}

// Create a new ratelimiter that allows 10 requests per 10 seconds for general API usage
export const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "10 s"),
      analytics: true,
    })
  : null;

// Stricter rate limit for expensive operations (player data fetching)
export const strictRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      analytics: true,
    })
  : null;

// Rate limit for search operations
export const searchRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "60 s"),
      analytics: true,
    })
  : null;

// Helper function to get client IP
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const real = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (real) {
    return real;
  }

  // Fallback for development
  return "127.0.0.1";
}

// Simple in-memory rate limiting for development
function simpleRateLimit(identifier: string, windowMs: number, maxRequests: number): boolean {
  const now = Date.now();
  const key = identifier;

  if (!memoryStorage.has(key)) {
    memoryStorage.set(key, []);
  }

  const requests = memoryStorage.get(key)!;
  const validRequests = requests.filter((time: number) => now - time < windowMs);

  if (validRequests.length >= maxRequests) {
    return false; // Rate limit exceeded
  }

  validRequests.push(now);
  memoryStorage.set(key, validRequests);
  return true; // Request allowed
}

// Rate limiting middleware function
export async function withRateLimit(
  request: Request,
  identifier?: string,
  limiter: Ratelimit | null = ratelimit
) {
  const id = identifier || getClientIP(request);

  // If Redis is available, use Upstash rate limiting
  if (limiter) {
    const { success, limit, reset, remaining } = await limiter.limit(id);

    if (!success) {
      return new Response(
        JSON.stringify({
          error: "Too Many Requests",
          message: "Rate limit exceeded. Please try again later.",
          limit,
          reset: new Date(reset),
          remaining,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
            "Retry-After": Math.round((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }
  } else {
    // Fallback to simple in-memory rate limiting for development
    const allowed = simpleRateLimit(id, 60000, 10); // 10 requests per minute

    if (!allowed) {
      return new Response(
        JSON.stringify({
          error: "Too Many Requests",
          message: "Rate limit exceeded. Please try again later.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
          },
        }
      );
    }
  }

  return null; // No rate limit exceeded
}