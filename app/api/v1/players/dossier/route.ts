import { NextResponse } from 'next/server';
import { getCompleteNativePlayerDossier } from '../../../../../lib/player-intelligence-engine';

export const dynamic = 'force-dynamic';
export const maxDuration = 15;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');
  const sport = searchParams.get('sport') || 'SOCCER';
  const team = searchParams.get('team') || 'Elite Club';

  if (!name) {
    return NextResponse.json({ success: false, error: 'Player name is required' }, { status: 400 });
  }

  const dossier = await getCompleteNativePlayerDossier(name, sport, team);

  return NextResponse.json({
    success: true,
    player: dossier,
  });
}
