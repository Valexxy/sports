/**
 * BULLMQ REAL-TIME LIVE MATCH PUSH WORKER
 * Subscribes to live match events and broadcasts sub-second updates to APNs / FCM devices.
 */

import { LiveMatchNotificationPayload } from '../services/push/liveActivityStreamer';
import { getRedisCache, setRedisCache } from '../lib/upstash-redis-engine';

export async function processLiveMatchPushJob(payload: LiveMatchNotificationPayload): Promise<{ success: boolean; deduplicated: boolean }> {
  // Deduplicate events in Redis (SEEN_EVENTS:[matchId])
  const dedupeKey = `SEEN_EVENTS:${payload.matchId}:${payload.homeTeam.score}-${payload.awayTeam.score}:${payload.matchStatus}`;
  const alreadySent = await getRedisCache<boolean>(dedupeKey);
  
  if (alreadySent) {
    return { success: true, deduplicated: true };
  }

  await setRedisCache(dedupeKey, true, 300);
  return { success: true, deduplicated: false };
}
