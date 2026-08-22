import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase-client';
import { buildDynamicArchive } from '../../../../lib/prediction-archive-engine';

export const dynamic = 'force-dynamic';

export async function GET() {
  const syncResults: Record<string, any> = {};

  try {
    // 1. Seed / Sync Historical Settlement Ledger (derived from real scores)
    const dynamicArchive = await buildDynamicArchive();
    const ledgerPayload = dynamicArchive.map((m) => ({
      id: m.id,
      match_date: m.date,
      league: m.league,
      league_flag: m.leagueFlag,
      home_team: m.homeTeam,
      away_team: m.awayTeam,
      home_score: m.homeScore,
      away_score: m.awayScore,
      pick_selection: m.prediction.selection,
      pick_market: m.prediction.market,
      pick_odds: m.prediction.odds,
      result: m.prediction.result,
      settlement_hash: m.settlementHash || '0x992b11f...88a3',
      settlement_note: m.settlementNote,
      tipster_name: m.prediction.tipsterName,
      accuracy_score: m.accuracyHeatmapScore,
    }));

    const { error: ledgerError } = await supabaseAdmin
      .from('settlement_ledger')
      .upsert(ledgerPayload, { onConflict: 'id' });

    syncResults.settlement_ledger = ledgerError ? `Error: ${ledgerError.message}` : 'Synced Successfully ✓';

    // 2. Seed / Sync Tipster Leaderboard
    const tipstersPayload = [
      {
        id: 'tip-1',
        rank: 1,
        name: '@CyberStriker_99',
        badge: 'CROWN 👑',
        win_rate: 94.2,
        profit_units: 342.8,
        streak: '12W Streak 🔥',
        avatar: '⚡',
      },
      {
        id: 'tip-2',
        rank: 2,
        name: '@BankerGod_NG',
        badge: 'DIAMOND 💎',
        win_rate: 91.8,
        profit_units: 289.4,
        streak: '8W Streak ⚡',
        avatar: '🦁',
      },
      {
        id: 'tip-3',
        rank: 3,
        name: '@OracleMaster',
        badge: 'GOLD 🏆',
        win_rate: 88.5,
        profit_units: 215.0,
        streak: '5W Streak',
        avatar: '🦅',
      },
    ];

    const { error: tipsterError } = await supabaseAdmin
      .from('tipster_leaderboard')
      .upsert(tipstersPayload, { onConflict: 'id' });

    syncResults.tipster_leaderboard = tipsterError ? `Error: ${tipsterError.message}` : 'Synced Successfully ✓';

    // 3. Seed / Sync Star Birthdays
    const birthdaysPayload = [
      {
        player_id: 'bday-1',
        player_name: 'Robert Lewandowski',
        club: 'FC Barcelona 🇪🇸',
        birth_date: 'August 21 (Tomorrow 🎂)',
        wishes_count: 1420,
      },
      {
        player_id: 'bday-2',
        player_name: 'Bernardo Silva',
        club: 'Manchester City 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        birth_date: 'August 10 (Celebrated 🌟)',
        wishes_count: 980,
      },
      {
        player_id: 'bday-3',
        player_name: 'Thierry Henry',
        club: 'Arsenal Invincibles 🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        birth_date: 'August 17 (Legend 👑)',
        wishes_count: 3450,
      },
    ];

    const { error: bdayError } = await supabaseAdmin
      .from('star_birthdays')
      .upsert(birthdaysPayload, { onConflict: 'player_id' });

    syncResults.star_birthdays = bdayError ? `Error: ${bdayError.message}` : 'Synced Successfully ✓';

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      syncResults,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
      syncResults,
    }, { status: 500 });
  }
}
