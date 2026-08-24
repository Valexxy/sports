import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService, DbUser } from '../../../../lib/database-service';
import { SessionService, SESSION_COOKIE_NAME } from '../../../../lib/session-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, email, avatar, club } = body;

    const uname = username?.trim() || `Striker_${Math.floor(100 + Math.random() * 900)}`;
    const newUser: DbUser = {
      id: `usr-${Date.now()}`,
      username: uname,
      email: email?.trim() || `${uname.toLowerCase()}@mivaj.com`,
      avatar: avatar || '⚡',
      club: club || 'Arsenal',
      aura_balance: 500, // +500 Welcome Bounty
      naira_balance: 0,
      vip_tier: 'GOLD INFLUENCER ⚡',
      role: uname === 'azunnaukah' ? 'SUPER_ADMIN' : 'MEMBER',
      status: 'ACTIVE',
      total_picks: 0,
      win_rate: 0,
      created_at: new Date().toISOString(),
    };

    await DatabaseService.createOrUpdateUser(newUser);

    const token = SessionService.createToken({
      userId: newUser.id,
      username: newUser.username,
      role: newUser.role,
      vipTier: newUser.vip_tier,
    });

    const response = NextResponse.json({ success: true, user: newUser });
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 72 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
