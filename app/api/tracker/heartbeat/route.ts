import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

// In-memory active presence cache with 90-second sliding expiration window
interface ActiveSession {
  sessionId: string;
  userAlias: string;
  city: string;
  country: string;
  currentPage: string;
  activeMatchId?: string;
  deviceType: string;
  lastHeartbeat: number;
}

const activeSessions: Map<string, ActiveSession> = new Map();

// Periodic sweep of sessions inactive for > 90 seconds
function sweepStaleSessions() {
  const cutoff = Date.now() - 90000;
  for (const [id, session] of activeSessions.entries()) {
    if (session.lastHeartbeat < cutoff) {
      activeSessions.delete(id);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, userAlias, city, country, currentPage, activeMatchId, deviceType, action } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    if (action === 'disconnect') {
      activeSessions.delete(sessionId);
      return NextResponse.json({ success: true });
    }

    // 1. Record / Update Active Session in Fast Memory
    activeSessions.set(sessionId, {
      sessionId,
      userAlias: userAlias || 'Sports Fan',
      city: city || 'Awka',
      country: country || 'Nigeria',
      currentPage: currentPage || '/',
      activeMatchId: activeMatchId || undefined,
      deviceType: deviceType || 'Desktop',
      lastHeartbeat: Date.now(),
    });

    sweepStaleSessions();

    // 2. Compute Live Global Metrics
    const onlineCount = Math.max(activeSessions.size, 1);
    const activeCitiesSet = new Set<string>();
    const matchCounts = new Map<string, number>();

    for (const session of activeSessions.values()) {
      if (session.city) activeCitiesSet.add(session.city);
      if (session.activeMatchId) {
        matchCounts.set(session.activeMatchId, (matchCounts.get(session.activeMatchId) || 0) + 1);
      }
    }

    const activeCities = Array.from(activeCitiesSet).slice(0, 10);
    const trendingMatches = Array.from(matchCounts.keys()).slice(0, 5);

    // 3. Background Async Logging to Supabase if Admin Client Available
    if (supabaseAdmin) {
      supabaseAdmin
        .from('live_active_users')
        .upsert({
          session_id: sessionId,
          user_alias: userAlias || 'Sports Fan',
          city: city || 'Awka',
          country: country || 'Nigeria',
          current_page: currentPage || '/',
          active_match_id: activeMatchId || null,
          device_type: deviceType || 'Desktop',
          last_heartbeat: new Date().toISOString(),
        })
        .catch(() => {});
    }

    return NextResponse.json({
      success: true,
      onlineCount,
      activeCities,
      trendingMatches,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      onlineCount: Math.max(activeSessions.size, 1),
      activeCities: ['Awka', 'Onitsha', 'Lagos'],
    });
  }
}

export async function GET() {
  sweepStaleSessions();
  return NextResponse.json({
    onlineCount: Math.max(activeSessions.size, 1),
    activeCities: Array.from(new Set(Array.from(activeSessions.values()).map((s) => s.city))).slice(0, 10),
  });
}
