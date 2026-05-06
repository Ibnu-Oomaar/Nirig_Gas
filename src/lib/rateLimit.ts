// src/lib/rateLimit.ts
// Simple in-memory rate limiter for API routes

const requests = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  identifier: string,
  limit = 100,
  windowMs = 60_000
): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = requests.get(identifier);

  if (!entry || now > entry.resetAt) {
    requests.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count };
}

// Clean up expired entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of requests.entries()) {
      if (now > val.resetAt) requests.delete(key);
    }
  }, 5 * 60_000);
}
