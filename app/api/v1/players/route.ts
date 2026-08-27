import { NextResponse } from 'next/server';
import { STAR_PLAYERS_CATALOG } from '../../../../lib/player-catalog';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.toLowerCase();
  const sport = searchParams.get('sport')?.toUpperCase();
  const team = searchParams.get('team')?.toLowerCase();

  let filtered = STAR_PLAYERS_CATALOG;

  if (sport && sport !== 'ALL') {
    filtered = filtered.filter(p => p.sport === sport);
  }

  if (team) {
    filtered = filtered.filter(p => p.team_name.toLowerCase().includes(team));
  }

  if (query) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.team_name.toLowerCase().includes(query) ||
      p.country.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
}
