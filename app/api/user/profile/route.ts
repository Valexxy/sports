import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '../../../../lib/database-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username') || 'azunnaukah';
    const user = await DatabaseService.getUser(username);
    const referrals = await DatabaseService.getReferrals(username);

    return NextResponse.json({
      success: true,
      user: user || {
        username,
        email: `${username}@mivaj.com`,
        avatar: '⚡',
        club: 'Arsenal',
        aura_balance: 1450,
        vip_tier: 'PLATINUM PRODIGY 👑',
      },
      referrals,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await DatabaseService.createOrUpdateUser(body);
    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
