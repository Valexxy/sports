import { NextResponse } from 'next/server';
import { getTodayMetrics, getPageviewsSeries } from '../../../lib/privacy-analytics-engine';
import { getSubscriptionCount } from '../../../lib/push-subscription-store';
import { getRealLiveAndPlayedMatches } from '../../../lib/real-sports-stream';
import { buildDynamicArchive, getLedgerStats } from '../../../lib/prediction-archive-engine';
import { can, resolveRole, UserRole } from '../../../lib/role-engine';

export const dynamic = 'force-dynamic';

function detectRole(req: Request): UserRole {
  const header = req.headers.get('x-aurascore-role');
  // In production, replace with Supabase Auth JWT verification.
  return resolveRole(header);
}

/**
 * GET -> admin dashboard aggregate (analytics, subscriptions, matches, ledger).
 * Only roles with VIEW_ANALYTICS may read it.
 */
export async function GET(req: Request) {
  const role = detectRole(req);
  if (!can(role, 'VIEW_ANALYTICS')) {
    return NextResponse.json({ success: false, error: 'Forbidden: analytics access required' }, { status: 403 });
  }

  try {
    const [today, series, pushSubs, matches, archive, stats] = await Promise.all([
      getTodayMetrics(),
      getPageviewsSeries(14),
      getSubscriptionCount(),
      getRealLiveAndPlayedMatches(),
      buildDynamicArchive(),
      getLedgerStats(),
    ]);

    const live = matches.filter((m) => m.status === 'LIVE').length;
    const scheduled = matches.filter((m) => m.status === 'SCHEDULED').length;
    const finished = matches.filter((m) => m.status === 'FINISHED').length;

    return NextResponse.json({
      success: true,
      role,
      metrics: today,
      series,
      pushSubscriptions: pushSubs,
      matches: { total: matches.length, live, scheduled, finished },
      ledger: { rows: archive.length, ...stats },
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('/api/admin GET error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * POST -> admin "super write" actions scoped by capability.
 * Only roles holding the relevant capability may invoke.
 */
export async function POST(req: Request) {
  const role = detectRole(req);
  if (!can(role, 'SUPER_WRITE')) {
    return NextResponse.json({ success: false, error: 'Forbidden: super write access required' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const action = body?.action;

    switch (action) {
      case 'ping': {
        return NextResponse.json({ success: true, role, echo: true, ts: Date.now() });
      }
      case 'refresh_caches': {
        // Force a fresh aggregation pass (warms Redis caches).
        const matches = await getRealLiveAndPlayedMatches();
        return NextResponse.json({ success: true, role, refreshedMatches: matches.length });
      }
      default: {
        return NextResponse.json({ success: false, error: `Unknown admin action: ${action}` }, { status: 400 });
      }
    }
  } catch (err: any) {
    console.error('/api/admin POST error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}