type Bucket = {
  hits: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

interface RateLimitInput {
  key: string;
  limit: number;
  windowMs: number;
}

export function assertRateLimit(input: RateLimitInput): void {
  const { key, limit, windowMs } = input;
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, {
      hits: 1,
      resetAt: now + windowMs
    });
    return;
  }

  if (existing.hits >= limit) {
    throw new Error("Rate limit exceeded.");
  }

  existing.hits += 1;
}
