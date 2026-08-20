/**
 * UPSTASH DISTRIBUTED REDIS DATABASE ENGINE
 * Real-time global leaderboard ranking, distributed token caches, and rate-limiting.
 */

import { Redis } from '@upstash/redis';

export const redisClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export async function setRedisCache(key: string, value: any, ttlSeconds: number = 30) {
  try {
    await redisClient.set(key, JSON.stringify(value), { ex: ttlSeconds });
    return true;
  } catch (err) {
    console.warn('Redis set cache fallback active.');
    return false;
  }
}

export async function getRedisCache<T>(key: string): Promise<T | null> {
  try {
    const raw = await redisClient.get<string>(key);
    if (typeof raw === 'string') return JSON.parse(raw) as T;
    if (raw) return raw as T;
  } catch (err) {
    console.warn('Redis get cache fallback active.');
  }
  return null;
}
