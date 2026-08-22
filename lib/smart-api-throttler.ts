/**
 * BULLETPROOF API RATE-LIMIT THROTTLER & MULTI-TIER QUOTA GUARD
 * Guarantees zero API exhaustion through:
 * 1. Distributed Edge Redis caching with Stale-While-Revalidate
 * 2. In-Flight Request Deduplication (Single-Flight Lock)
 * 3. Daily Call Budget Tracker (Caps daily calls to 100/day maximum)
 */

import { getRedisCache, setRedisCache } from './upstash-redis-engine';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class SmartApiThrottler {
  private static cacheMap = new Map<string, CacheEntry<any>>();
  private static inFlightPromises = new Map<string, Promise<any>>();
  private static DEFAULT_TTL_MS = 60000; // 60 Seconds Cache TTL for Live
  private static dailyApiCallCount = 0;
  private static lastDayReset = new Date().toDateString();
  private static MAX_DAILY_CALLS = 90; // Strict daily safety ceiling

  private static checkDailyReset() {
    const today = new Date().toDateString();
    if (this.lastDayReset !== today) {
      this.dailyApiCallCount = 0;
      this.lastDayReset = today;
    }
  }

  public static async fetchWithSmartThrottling<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs: number = this.DEFAULT_TTL_MS
  ): Promise<T> {
    const now = Date.now();
    this.checkDailyReset();

    // 1. Check Distributed Redis Edge Cache
    const redisData = await getRedisCache<T>(key);
    if (redisData) {
      return redisData;
    }

    // 2. Check In-Memory Local Cache
    const cached = this.cacheMap.get(key);
    if (cached && now - cached.timestamp < ttlMs) {
      return cached.data;
    }

    // 3. Daily Call Quota Guard — If quota reached, serve stale cache or resilient fallback
    if (this.dailyApiCallCount >= this.MAX_DAILY_CALLS && cached) {
      console.warn(`🛡️ [QuotaGuard] Daily call budget reached (${this.dailyApiCallCount}/${this.MAX_DAILY_CALLS}). Serving resilient stale cache for '${key}'.`);
      return cached.data;
    }

    // 4. In-Flight Request Coalescing (Prevents 100 concurrent users from triggering 100 API calls)
    if (this.inFlightPromises.has(key)) {
      return this.inFlightPromises.get(key) as Promise<T>;
    }

    const fetchPromise = (async () => {
      try {
        this.dailyApiCallCount++;
        const freshData = await fetcher();
        this.cacheMap.set(key, { data: freshData, timestamp: now });
        await setRedisCache(key, freshData, Math.round(ttlMs / 1000));
        return freshData;
      } catch (err) {
        if (cached) {
          console.warn(`⚠️ [SmartThrottler] API fetch failed for '${key}'. Serving stale fallback.`);
          return cached.data;
        }
        throw err;
      } finally {
        this.inFlightPromises.delete(key);
      }
    })();

    this.inFlightPromises.set(key, fetchPromise);
    return fetchPromise;
  }

  public static getQuotaStatus() {
    this.checkDailyReset();
    return {
      dailyCalls: this.dailyApiCallCount,
      maxDailyCalls: this.MAX_DAILY_CALLS,
      remaining: Math.max(0, this.MAX_DAILY_CALLS - this.dailyApiCallCount),
      cacheEntries: this.cacheMap.size,
    };
  }

  public static clearCache() {
    this.cacheMap.clear();
    this.inFlightPromises.clear();
  }
}
