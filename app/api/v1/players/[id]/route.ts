import { NextResponse } from 'next/server';
import { STAR_PLAYERS_CATALOG } from '../../../../../lib/player-catalog';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const player = STAR_PLAYERS_CATALOG.find(p => p.id === id || p.external_id === id);

  if (!player) {
    return NextResponse.json({ success: false, error: 'Player not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: player });
}
