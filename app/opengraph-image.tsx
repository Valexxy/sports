import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Mivaj Sports | 100% Free Daily Banker Predictions & Live Audio Center';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #050b07 0%, #031508 50%, #0a1f0d 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          position: 'relative',
          padding: '40px',
        }}
      >
        {/* Glow Circles */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(0, 230, 118, 0.15)',
            filter: 'blur(90px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-50px',
            left: '-50px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255, 215, 0, 0.15)',
            filter: 'blur(90px)',
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(0, 230, 118, 0.15)',
            border: '2px solid #00e676',
            borderRadius: '9999px',
            padding: '8px 24px',
            marginBottom: '24px',
          }}
        >
          <span style={{ fontSize: '20px', fontWeight: '900', color: '#00e676', letterSpacing: '2px' }}>
            ⚡ 100% FREE VIP MATCHDAY HUB
          </span>
        </div>

        {/* Main Brand Title */}
        <h1
          style={{
            fontSize: '68px',
            fontWeight: '900',
            textAlign: 'center',
            margin: '0 0 16px 0',
            background: 'linear-gradient(to right, #ffffff, #00e676, #ffd700)',
            backgroundClip: 'text',
            color: 'transparent',
            letterSpacing: '-1px',
          }}
        >
          MIVAJ SPORTS
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '28px',
            color: '#a0aec0',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '0 0 36px 0',
            lineHeight: '1.4',
          }}
        >
          Daily 10.00 Odds Banker Accumulators • Live Pidgin Audio Commentary • Cut-1 Assurance Slips
        </p>

        {/* Features Row */}
        <div
          style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '12px 28px',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#00e676',
            }}
          >
            ✓ 94.8% AI Model Accuracy
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '12px 28px',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#ffd700',
            }}
          >
            🛡️ Cut-1 Moneyback Shield
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '12px 28px',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#00e5ff',
            }}
          >
            🇳🇬 Native Nigerian Audio
          </div>
        </div>

        {/* Domain Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            fontSize: '18px',
            color: '#718096',
            fontWeight: 'bold',
            letterSpacing: '1px',
          }}
        >
          HTTPS://MIVAJ.COM
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
