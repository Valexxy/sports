import { NextResponse } from 'next/server';
import { getRealLiveAndPlayedMatches } from '../../../lib/real-sports-stream';
import { setRedisCache, getRedisCache } from '../../../lib/upstash-redis-engine';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Check Upstash Redis Database Cache first
    const cached = await getRedisCache<any>('live_stadium_matches_db');
    if (cached && Array.isArray(cached) && cached.length > 0) {
      return NextResponse.json({ success: true, count: cached.length, source: 'upstash_redis_db', matches: cached });
    }

    // 2. Fetch fresh real matches from verified live streams
    const matches = await getRealLiveAndPlayedMatches();

    if (matches && matches.length > 0) {
      // Store in Upstash Redis database (30s TTL)
      await setRedisCache('live_stadium_matches_db', matches, 30);
      return NextResponse.json({ success: true, count: matches.length, source: 'live_apis', matches });
    }

    return NextResponse.json({ success: true, count: 0, source: 'empty', matches: [] });
  } catch (err: any) {
    console.error('API /api/matches error:', err);
    return NextResponse.json({ success: false, error: err.message, matches: [] }, { status: 500 });
  }
}
