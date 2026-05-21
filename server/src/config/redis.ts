import { Redis } from "ioredis";
import { logger } from "../utils/logger.js";

interface ICache {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
}

// ─────────────────────────────────────────────────────────
// Fallback In-Memory Cache (used when Redis is unavailable)
// ─────────────────────────────────────────────────────────
class InMemoryCache implements ICache {
  private store = new Map<string, { value: string; expiresAt: number | null }>();

  public async get<T>(key: string): Promise<T | null> {
    const record = this.store.get(key);
    if (!record) return null;

    if (record.expiresAt && record.expiresAt < Date.now()) {
      this.store.delete(key);
      return null;
    }

    try {
      return JSON.parse(record.value) as T;
    } catch {
      return null;
    }
  }

  public async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.store.set(key, { value: JSON.stringify(value), expiresAt });
  }

  public async del(key: string): Promise<void> {
    this.store.delete(key);
  }
}

// ─────────────────────────────────────────────────────────
// Redis-Backed Cache
// ─────────────────────────────────────────────────────────
class RedisCache implements ICache {
  constructor(private client: Redis) {}

  public async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (err) {
      logger.error("Redis GET operation failed:", err);
      return null;
    }
  }

  public async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    try {
      const data = JSON.stringify(value);
      if (ttlSeconds) {
        await this.client.set(key, data, "EX", ttlSeconds);
      } else {
        await this.client.set(key, data);
      }
    } catch (err) {
      logger.error("Redis SET operation failed:", err);
    }
  }

  public async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (err) {
      logger.error("Redis DEL operation failed:", err);
    }
  }
}

// ─────────────────────────────────────────────────────────
// Cache Client Initialization
// ─────────────────────────────────────────────────────────
let cacheClient: ICache;

const initCache = (): ICache => {
  const REDIS_URL = process.env.REDIS_URL;

  // If no Redis URL configured or running in test mode, use in-memory immediately
  if (!REDIS_URL || process.env.NODE_ENV === "test") {
    logger.info("Using In-Memory cache (no REDIS_URL configured).");
    return new InMemoryCache();
  }

  try {
    const client = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => {
        // Stop retrying after 1 attempt — fall back silently
        if (times > 1) return null;
        return 200;
      },
      connectTimeout: 3000,
      lazyConnect: true,
    });

    // Suppress unhandled error events — these are the spam source
    client.on("error", (err) => {
      logger.debug(`Redis connection error (suppressed): ${err.message}`);
    });

    // Attempt connection
    client.connect().then(() => {
      logger.info("✅ Redis cache connected successfully.");
    }).catch(() => {
      logger.warn("⚠️ Redis unavailable. Falling back to In-Memory cache.");
      client.disconnect(false);
      cacheClient = new InMemoryCache();
    });

    return new RedisCache(client);
  } catch {
    logger.warn("⚠️ Cannot initialize Redis. Using In-Memory cache.");
    return new InMemoryCache();
  }
};

cacheClient = initCache();

export { cacheClient as cache };
