import { NextRequest } from 'next/server';
import { getRealLiveAndPlayedMatches } from '../../../lib/real-sports-stream';

export const dynamic = 'force-dynamic';

/**
 * AURASCORE REAL-TIME DATA STREAM (SSE)
 * Pushes ONLY real verified match data pulled live from ESPN public APIs.
 * No simulated events, no fake latency, no fabricated scores.
 */
export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: any) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
        } catch (e) {
          /* client disconnected */
        }
      };

      // 1. Initial Connection Event
      send({
        type: 'ENGINE_CONNECTED',
        timestamp: Date.now(),
        protocol: 'SSE-Real-Data-v3.0',
        message: 'Connected to AuraScore Real-Time Match Data Stream (100% verified live sources)',
      });

      let lastSnapshotKey = '';
      const tick = async () => {
        try {
          const matches = await getRealLiveAndPlayedMatches();
          const live = matches.filter((m) => m.status === 'LIVE');
          const snapshotKey = matches
            .map((m) => `${m.id}:${m.homeScore}-${m.awayScore}`)
            .join('|');

          send({
            type: 'MATCH_SNAPSHOT',
            timestamp: Date.now(),
            liveCount: live.length,
            totalCount: matches.length,
            matches: matches.slice(0, 8).map((m) => ({
              id: m.id,
              homeTeam: m.homeTeam,
              awayTeam: m.awayTeam,
              homeScore: m.homeScore,
              awayScore: m.awayScore,
              status: m.status,
              matchTime: m.matchTime,
              league: m.league,
            })),
          });

          // Only emit a "LIVE_UPDATE" when an actual score changed
          if (lastSnapshotKey !== '' && snapshotKey !== lastSnapshotKey) {
            const changed = matches.filter((m) => m.status === 'LIVE');
            send({
              type: 'SCORE_UPDATE',
              timestamp: Date.now(),
              liveUpdates: changed.map((m) => ({
                id: m.id,
                homeTeam: m.homeTeam,
                awayTeam: m.awayTeam,
                homeScore: m.homeScore,
                awayScore: m.awayScore,
                matchTime: m.matchTime,
              })),
            });
          }
          lastSnapshotKey = snapshotKey;
        } catch (e) {
          send({ type: 'STREAM_ERROR', timestamp: Date.now(), message: 'Snapshot fetch failed' });
        }
      };

      // Immediate first snapshot
      await tick();

      // Poll real APIs every 15s for live score changes
      const interval = setInterval(tick, 15000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        try { controller.close(); } catch (e) {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
