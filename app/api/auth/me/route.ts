import { NextRequest, NextResponse } from 'next/server';
import { DataAccessLayer } from '../../../../lib/dal';
import { DatabaseService } from '../../../../lib/database-service';

export async function GET() {
  try {
    const session = await DataAccessLayer.getCurrentSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const user = await DatabaseService.getUser(session.username);
    return NextResponse.json({
      authenticated: true,
      user: user || {
        username: session.username,
        role: session.role,
        vip_tier: session.vipTier,
        aura_balance: 1450,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
