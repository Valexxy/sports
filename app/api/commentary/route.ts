/**
 * REALTIME COMMENTARY API
 * Fetches live per-match commentary from ESPN public API
 * Caches in Redis for 1M+ visitors/minute scalability
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchRealLiveCommentary, extractEspnEventId, RealCommentaryEvent } from '@/lib/real-live-commentary';
import { getRedisCache, setRedisCache } from '@/lib/upstash-redis-engine';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId');
    const league = searchParams.get('league') || 'Premier League';
    const homeTeam = searchParams.get('homeTeam') || undefined;
    const awayTeam = searchParams.get('awayTeam') || undefined;

    if (!matchId) {
      return NextResponse.json(
        { error: 'matchId is required' },
        { status: 400 }
      );
    }

    // Check Redis cache first (for 1M+ visitors/minute scalability)
    const cacheKey = `commentary:${matchId}`;
    const cached = await getRedisCache<RealCommentaryEvent[]>(cacheKey);
    
    if (cached && cached.length > 0) {
      return NextResponse.json({
        success: true,
        commentary: cached,
        count: cached.length,
        source: 'redis-cache',
        timestamp: new Date().toISOString(),
      });
    }

    // Extract ESPN event ID
    const espnEventId = extractEspnEventId(matchId);
    const eventId = espnEventId || (matchId.match(/^\d+$/) ? matchId : null);

    if (!eventId) {
      return NextResponse.json({
        success: true,
        commentary: [],
        count: 0,
        message: 'No ESPN event ID found for this match',
        timestamp: new Date().toISOString(),
      });
    }

    // Fetch real commentary from ESPN public API
    const commentary = await fetchRealLiveCommentary(eventId, league, homeTeam, awayTeam);

    // Cache in Redis for 15 seconds (realtime freshness)
    if (commentary.length > 0) {
      await setRedisCache(cacheKey, commentary, 15);
    }

    return NextResponse.json({
      success: true,
      commentary,
      count: commentary.length,
      source: 'espn-live',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Commentary API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        commentary: [],
      },
      { status: 500 }
    );
  }
}