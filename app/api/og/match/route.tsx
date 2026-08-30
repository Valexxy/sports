import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const homeTeam = searchParams.get('home') || 'Arsenal';
    const awayTeam = searchParams.get('away') || 'Chelsea';
    const league = searchParams.get('league') || 'Premier League';
    const pick = searchParams.get('pick') || 'Home Win or Draw (1X)';
    const odds = searchParams.get('odds') || '1.35';
    const prob = searchParams.get('prob') || '88';
    const time = searchParams.get('time') || 'MATCHDAY';
    const cleanPick = pick.replace(/(.+) or Draw \(1X\)/i, '1X ($1)').replace(/(.+) or Draw \(X2\)/i, '2X ($1)');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#05070d',
            backgroundImage: 'radial-gradient(circle at 50% 0%, #00ff8725, transparent 60%), radial-gradient(circle at 100% 100%, #ffd70020, transparent 50%)',
            padding: '48px',
            fontFamily: 'sans-serif',
            color: 'white',
            border: '8px solid #00ff87',
            borderRadius: '24px',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid rgba(255,255,255,0.15)', paddingBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  backgroundColor: '#00ff87',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: '900',
                }}
              >
                ⚡
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '30px', fontWeight: '900', color: '#ffffff' }}>
                  MIVAJ SPORTS &bull; <span style={{ color: '#00ff87' }}>mivaj.com</span>
                </span>
                <span style={{ fontSize: '15px', color: '#94a3b8', fontWeight: '700' }}>
                  DIXON-COLES POISSON MATCHDAY RADAR
                </span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(0, 255, 135, 0.15)',
                border: '2px solid #00ff87',
                padding: '8px 18px',
                borderRadius: '14px',
                fontSize: '16px',
                color: '#ffd700',
                fontWeight: '900',
              }}
            >
              {prob}% AI CONFIDENCE 🎯
            </div>
          </div>

          {/* Match Teams Showcase */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              border: '2px solid rgba(0, 255, 135, 0.3)',
              borderRadius: '20px',
              padding: '32px 24px',
              margin: '16px 0',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '18px', color: '#00ff87', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px' }}>
              🏆 {league} &bull; {time}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', width: '100%' }}>
              <span style={{ fontSize: '42px', fontWeight: '900', color: '#ffffff', textAlign: 'right', flex: 1 }}>
                {homeTeam}
              </span>
              <span style={{ fontSize: '28px', fontWeight: '900', color: '#ffd700', padding: '6px 16px', backgroundColor: '#000', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
                VS
              </span>
              <span style={{ fontSize: '42px', fontWeight: '900', color: '#ffffff', textAlign: 'left', flex: 1 }}>
                {awayTeam}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                padding: '12px 28px',
                borderRadius: '16px',
                border: '2px solid #ffd700',
                marginTop: '12px',
              }}
            >
              <span style={{ fontSize: '16px', color: '#94a3b8', fontWeight: '700' }}>RECOMMENDED VALUE PICK:</span>
              <span style={{ fontSize: '24px', color: '#ffd700', fontWeight: '900' }}>{cleanPick}</span>
              <span style={{ fontSize: '22px', color: '#00ff87', fontWeight: '900' }}>@{odds}</span>
            </div>
          </div>

          {/* High-FOMO Telegram Viral Call-To-Action Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#00ff87',
              borderRadius: '18px',
              padding: '16px 24px',
              color: '#000',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '19px', fontWeight: '900', color: '#000000' }}>
                🚀 GET DAILY 15.00x MASTER BANKER SLIP ON TELEGRAM!
              </span>
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#0f172a' }}>
                100% Free &bull; Zero Fees &bull; Audited Referee Ledger &bull; Sub-Second Goal Tremors
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#000',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '12px',
                fontWeight: '900',
                fontSize: '15px',
              }}
            >
              <span>👉 Join Free:</span>
              <span style={{ color: '#00ff87' }}>t.me/mivajsport</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 675,
      }
    );
  } catch (err: any) {
    return new Response(`Failed to generate match card: ${err?.message}`, { status: 500 });
  }
}
