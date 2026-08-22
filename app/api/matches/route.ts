import { NextResponse } from 'next/server';
import { getRealLiveAndPlayedMatches } from '../../../lib/real-sports-stream';
import { setRedisCache, getRedisCache } from '../../../lib/upstash-redis-engine';

// In-memory process cache to protect Redis and External APIs at massive scale
let inMemoryCache: { data: any[]; timestamp: number } | null = null;
const MEMORY_CACHE_TTL_MS = 20 * 1000; // 20 seconds

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const now = Date.now();

    // TIER 1: In-Memory Instance Cache (0ms latency, zero external calls)
    if (inMemoryCache && (now - inMemoryCache.timestamp) < MEMORY_CACHE_TTL_MS) {
      return new NextResponse(
        JSON.stringify({ success: true, count: inMemoryCache.data.length, source: 'in_memory_edge', matches: inMemoryCache.data }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, s-maxage=25, stale-while-revalidate=90',
            'X-Cache-Tier': 'MEMORY_HOT',
          },
        }
      );
    }

    // TIER 2: Upstash Redis Database Cache (Global multi-region synchronization)
    const cached = await getRedisCache<any>('live_stadium_matches_db');
    if (cached && Array.isArray(cached) && cached.length > 0) {
      inMemoryCache = { data: cached, timestamp: now };
      return new NextResponse(
        JSON.stringify({ success: true, count: cached.length, source: 'upstash_redis_db', matches: cached }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, s-maxage=25, stale-while-revalidate=90',
            'X-Cache-Tier': 'REDIS_GLOBAL',
          },
        }
      );
    }

    // TIER 3: Fetch fresh real matches from verified live streams
    const matches = await getRealLiveAndPlayedMatches();

    if (matches && matches.length > 0) {
      inMemoryCache = { data: matches, timestamp: now };
      // Store in Upstash Redis database (30s TTL)
      await setRedisCache('live_stadium_matches_db', matches, 30);

      return new NextResponse(
        JSON.stringify({ success: true, count: matches.length, source: 'live_apis', matches }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, s-maxage=25, stale-while-revalidate=90',
            'X-Cache-Tier': 'ORIGIN_FRESH',
          },
        }
      );
    }

    return NextResponse.json({ success: true, count: 0, source: 'empty', matches: [] });
  } catch (err: any) {
    console.error('API /api/matches error:', err);
    // Graceful fallback to stale in-memory cache if origin fails
    if (inMemoryCache) {
      return NextResponse.json({ success: true, count: inMemoryCache.data.length, source: 'stale_memory_fallback', matches: inMemoryCache.data });
    }
    return NextResponse.json({ success: false, error: err.message, matches: [] }, { status: 500 });
  }
}
