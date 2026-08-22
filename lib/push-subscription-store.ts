/**
 * PUSH SUBSCRIPTION STORE (Upstash Redis-backed)
 * Stores browser Web Push subscriptions so the server can fan out real,
 * server-initiated notifications even when the app/phone is asleep.
 *
 * Each subscription is keyed by a generated stable client id so a single
 * returning visitor does not accumulate duplicate endpoints.
 */

import { redisClient } from './upstash-redis-engine';
import { PushSubscriptionPayload } from './web-push-sender';

export interface StoredSubscription extends PushSubscriptionPayload {
  clientId: string;
  createdAt: number;
  userAgent?: string;
}

const PREFIX = 'aurascore:push:subscriptions';
const META_PREFIX = 'aurascore:push:meta';

function hashKey(clientId: string): string {
  return `${PREFIX}:${clientId}`;
}

export async function addSubscription(
  clientId: string,
  subscription: PushSubscriptionPayload,
  userAgent?: string,
): Promise<boolean> {
  try {
    const record: StoredSubscription = {
      clientId,
      ...subscription,
      createdAt: Date.now(),
      userAgent,
    };
    await redisClient.set(hashKey(clientId), JSON.stringify(record));
    return true;
  } catch (err) {
    console.warn('[push-store] addSubscription error:', err);
    return false;
  }
}

export async function removeSubscription(clientId: string): Promise<boolean> {
  try {
    await redisClient.del(hashKey(clientId));
    return true;
  } catch (err) {
    console.warn('[push-store] removeSubscription error:', err);
    return false;
  }
}

export async function disableSubscription(clientId: string): Promise<boolean> {
  // Keeps the record but marks it disabled so broadcasts skip it.
  try {
    await redisClient.set(`${META_PREFIX}:disabled:${clientId}`, '1', { ex: 60 * 60 * 24 * 30 });
    return true;
  } catch {
    return false;
  }
}

export async function getAllSubscriptions(): Promise<StoredSubscription[]> {
  try {
    const keys = await redisClient.keys(`${PREFIX}:*`);
    if (!keys || keys.length === 0) return [];

    const disabledKeys = await redisClient.keys(`${META_PREFIX}:disabled:*`);
    const disabledSet = new Set(disabledKeys.map((k) => k.replace(`${META_PREFIX}:disabled:`, '')));

    const pipeline = redisClient.pipeline();
    for (const key of keys) {
      pipeline.get(key);
    }
    const results = await pipeline.exec();

    const subs: StoredSubscription[] = [];
    for (const res of results) {
      try {
        if (typeof res !== 'string') continue;
        const parsed = JSON.parse(res) as StoredSubscription;
        if (parsed && parsed.clientId && !disabledSet.has(parsed.clientId)) {
          subs.push(parsed);
        }
      } catch {}
    }
    return subs;
  } catch (err) {
    console.warn('[push-store] getAllSubscriptions error:', err);
    return [];
  }
}

export async function getSubscriptionCount(): Promise<number> {
  try {
    const keys = await redisClient.keys(`${PREFIX}:*`);
    return keys?.length || 0;
  } catch {
    return 0;
  }
}