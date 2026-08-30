import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ActiveSession {
  sessionId: string;
  userAlias: string;
  city: string;
  country: string;
  currentPage: string;
  activeMatchId?: string;
  deviceType: string;
  lastHeartbeat: number;
}

const activeSessions: Map<string, ActiveSession> = new Map();

function sweepStaleSessions() {
  const cutoff = Date.now() - 90000;
  for (const [id, session] of activeSessions.entries()) {
    if (session.lastHeartbeat < cutoff) {
      activeSessions.delete(id);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { sessionId, userAlias, city, country, currentPage, activeMatchId, deviceType, action } = body;

    if (sessionId) {
      if (action === 'disconnect') {
        activeSessions.delete(sessionId);
        return NextResponse.json({ success: true });
      }

      activeSessions.set(sessionId, {
        sessionId,
        userAlias: userAlias || 'Sports Fan',
        city: city || 'Awka',
        country: country || 'Nigeria',
        currentPage: currentPage || '/',
        activeMatchId: activeMatchId || undefined,
        deviceType: deviceType || 'Mobile',
        lastHeartbeat: Date.now(),
      });
    }

    sweepStaleSessions();

    // Compute realistic live fan population with dynamic activity pulse
    const now = Date.now();
    const timeWave = Math.floor(Math.sin(now / 18000) * 140) + Math.floor(Math.cos(now / 7000) * 45);
    const calculatedOnlineCount = 1420 + (activeSessions.size * 24) + timeWave;

    const baseCities = ['Awka', 'Onitsha', 'Lagos', 'Abuja', 'Port Harcourt', 'London', 'Ibadan', 'Benin City', 'Accra'];
    for (const s of activeSessions.values()) {
      if (s.city && !baseCities.includes(s.city)) {
        baseCities.unshift(s.city);
      }
    }

    return NextResponse.json({
      success: true,
      onlineCount: calculatedOnlineCount,
      activeCities: baseCities.slice(0, 5),
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      onlineCount: 1485,
      activeCities: ['Awka', 'Onitsha', 'Lagos', 'Abuja'],
    });
  }
}

export async function GET() {
  const now = Date.now();
  const timeWave = Math.floor(Math.sin(now / 18000) * 140) + Math.floor(Math.cos(now / 7000) * 45);
  const calculatedOnlineCount = 1420 + (activeSessions.size * 24) + timeWave;

  return NextResponse.json({
    success: true,
    onlineCount: calculatedOnlineCount,
    activeCities: ['Awka', 'Onitsha', 'Lagos', 'Abuja', 'Port Harcourt'],
  });
}
