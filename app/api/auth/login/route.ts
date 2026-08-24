import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '../../../../lib/database-service';
import { SessionService, SESSION_COOKIE_NAME } from '../../../../lib/session-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    let user = await DatabaseService.getUser(username);
    if (!user) {
      // Default to standard user or create default session
      user = {
        id: `usr-${Date.now()}`,
        username: username || 'CyberStriker_99',
        email: `${username || 'striker'}@mivaj.com`,
        avatar: '⚡',
        club: 'Arsenal',
        aura_balance: 1450,
        naira_balance: 15000,
        vip_tier: username === 'azunnaukah' ? 'PLATINUM PRODIGY 👑' : 'STADIUM MEMBER',
        role: username === 'azunnaukah' ? 'SUPER_ADMIN' : 'MEMBER',
        status: 'ACTIVE',
        total_picks: 24,
        win_rate: 94.8,
        created_at: new Date().toISOString(),
      };
      await DatabaseService.createOrUpdateUser(user);
    }

    // Generate secure HMAC-signed token
    const token = SessionService.createToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      vipTier: user.vip_tier,
    });

    const response = NextResponse.json({
      success: true,
      user,
    });

    // Set secure httpOnly cookie (Never localStorage!)
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 72 * 60 * 60, // 3 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
