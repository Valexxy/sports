/**
 * SMART API RATE-LIMIT THROTTLER & STALE-WHILE-REVALIDATE CACHE
 * Uses Upstash Redis for distributed edge caching with memory fallback.
 */

import { getRedisCache, setRedisCache } from './upstash-redis-engine';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class SmartApiThrottler {
  private static cacheMap = new Map<string, CacheEntry<any>>();
  private static DEFAULT_TTL_MS = 15000; // 15 Seconds Cache TTL

  public static async fetchWithSmartThrottling<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs: number = this.DEFAULT_TTL_MS
  ): Promise<T> {
    const now = Date.now();
    
    // Check Redis Distributed Cache First
    const redisData = await getRedisCache<T>(key);
    if (redisData) {
      console.log(`⚡ [UpstashRedis] Served '${key}' from distributed Redis cache.`);
      return redisData;
    }

    // Check Memory Cache Second
    const cached = this.cacheMap.get(key);
    if (cached && now - cached.timestamp < ttlMs) {
      console.log(`⚡ [SmartThrottler] Served '${key}' from memory cache.`);
      return cached.data;
    }

    try {
      const freshData = await fetcher();
      this.cacheMap.set(key, { data: freshData, timestamp: now });
      await setRedisCache(key, freshData, Math.round(ttlMs / 1000));
      return freshData;
    } catch (err) {
      if (cached) {
        console.warn(`⚠️ [SmartThrottler] API error for '${key}'. Serving stale memory fallback cache.`);
        return cached.data;
      }
      throw err;
    }
  }

  public static clearCache() {
    this.cacheMap.clear();
  }
}
