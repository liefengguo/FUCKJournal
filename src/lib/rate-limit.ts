type RateLimitOptions = {
  scope: string;
  identifier: string;
  limit: number;
  windowMs: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  ok: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

const globalForRateLimit = globalThis as typeof globalThis & {
  __codexRateLimitStore?: Map<string, RateLimitEntry>;
};

function getStore() {
  if (!globalForRateLimit.__codexRateLimitStore) {
    globalForRateLimit.__codexRateLimitStore = new Map();
  }

  return globalForRateLimit.__codexRateLimitStore;
}

function cleanupStore(store: Map<string, RateLimitEntry>, now: number) {
  store.forEach((entry, key) => {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  });
}

export function getEnvNumber(name: string, fallback: number) {
  const value = process.env[name];

  if (!value) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function checkRateLimit({
  scope,
  identifier,
  limit,
  windowMs,
}: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const store = getStore();
  const key = `${scope}:${identifier}`;

  cleanupStore(store, now);

  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    const entry = {
      count: 1,
      resetAt: now + windowMs,
    };
    store.set(key, entry);

    return {
      ok: true,
      limit,
      remaining: Math.max(limit - 1, 0),
      resetAt: entry.resetAt,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  existing.count += 1;
  store.set(key, existing);

  const remaining = Math.max(limit - existing.count, 0);

  return {
    ok: existing.count <= limit,
    limit,
    remaining,
    resetAt: existing.resetAt,
    retryAfterSeconds: Math.max(Math.ceil((existing.resetAt - now) / 1000), 1),
  };
}
