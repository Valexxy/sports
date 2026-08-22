/**
 * SERVER-SIDE FOLLOW STORE (Upstash Redis)
 * Persists which matches each clientId follows so the server can fan out
 * true server-initiated push notifications (goal alerts, kickoff, FT results)
 * even when the browser is closed.
 */

import { redisClient } from './upstash-redis-engine';

const PREFIX = 'aurascore:follow';

export interface FollowRecord {
  matchId: string;
  matchTitle: string;
  followedAt: number;
  lastHomeScore: number;
  lastAwayScore: number;
}

async function keyFor(clientId: string, matchId: string): Promise<string> {
  return `${PREFIX}:${clientId}:${matchId}`;
}

export async function followMatch(
  clientId: string,
  matchId: string,
  matchTitle: string,
  lastHomeScore = 0,
  lastAwayScore = 0,
): Promise<boolean> {
  try {
    const record: FollowRecord = {
      matchId,
      matchTitle,
      followedAt: Date.now(),
      lastHomeScore,
      lastAwayScore,
    };
    await redisClient.set(await keyFor(clientId, matchId), JSON.stringify(record), { ex: 60 * 60 * 24 * 7 });
    return true;
  } catch (err) {
    console.warn('[follow-store] followMatch error:', err);
    return false;
  }
}

export async function unfollowMatch(clientId: string, matchId: string): Promise<boolean> {
  try {
    await redisClient.del(await keyFor(clientId, matchId));
    return true;
  } catch {
    return false;
  }
}

export async function updateFollowScore(
  clientId: string,
  matchId: string,
  lastHomeScore: number,
  lastAwayScore: number,
): Promise<boolean> {
  try {
    const key = await keyFor(clientId, matchId);
    const raw = await redisClient.get<string>(key);
    if (!raw) return false;
    const record = JSON.parse(raw) as FollowRecord;
    record.lastHomeScore = lastHomeScore;
    record.lastAwayScore = lastAwayScore;
    await redisClient.set(key, JSON.stringify(record), { ex: 60 * 60 * 24 * 7 });
    return true;
  } catch {
    return false;
  }
}

export interface FollowWithClient {
  clientId: string;
  matchId: string;
  matchTitle: string;
  lastHomeScore: number;
  lastAwayScore: number;
}

/** Returns all follow records across all clients for a specific match. */
export async function getFollowersForMatch(matchId: string): Promise<FollowWithClient[]> {
  try {
    const keys = await redisClient.keys(`${PREFIX}:*:${matchId}`);
    if (!keys || keys.length === 0) return [];

    const pipeline = redisClient.pipeline();
    for (const k of keys) pipeline.get(k);
    const results = await pipeline.exec();

    const out: FollowWithClient[] = [];
    results.forEach((res, idx) => {
      try {
        if (typeof res !== 'string') return;
        const parsed = JSON.parse(res) as FollowRecord;
        const clientId = keys[idx].split(':').slice(2).join(':').replace(`:${matchId}`, '');
        out.push({ clientId, ...parsed });
      } catch {}
    });
    return out;
  } catch (err) {
    console.warn('[follow-store] getFollowersForMatch error:', err);
    return [];
  }
}

/** Returns all follow records for a single client. */
export async function getFollowsForClient(clientId: string): Promise<FollowRecord[]> {
  try {
    const keys = await redisClient.keys(`${PREFIX}:${clientId}:*`);
    if (!keys || keys.length === 0) return [];

    const pipeline = redisClient.pipeline();
    for (const k of keys) pipeline.get(k);
    const results = await pipeline.exec();

    const out: FollowRecord[] = [];
    for (const res of results) {
      try {
        if (typeof res === 'string') out.push(JSON.parse(res));
      } catch {}
    }
    return out;
  } catch {
    return [];
  }
}