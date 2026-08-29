import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // 1. Try Vercel Edge Geolocation Headers (fast, 100% reliable on Vercel deployment)
    const vercelCity = req.headers.get('x-vercel-ip-city');
    const vercelCountry = req.headers.get('x-vercel-ip-country') || 'Nigeria';
    const vercelRegion = req.headers.get('x-vercel-ip-country-region') || '';
    const vercelLat = req.headers.get('x-vercel-ip-latitude');
    const vercelLon = req.headers.get('x-vercel-ip-longitude');

    if (vercelCity && vercelCity.trim() !== '') {
      return NextResponse.json({
        success: true,
        city: decodeURIComponent(vercelCity),
        region: vercelRegion,
        country: vercelCountry,
        latitude: vercelLat ? parseFloat(vercelLat) : 9.0765,
        longitude: vercelLon ? parseFloat(vercelLon) : 7.3986,
        source: 'vercel-edge-geo',
      });
    }

    // 2. Server-side fallback IP lookup (no CORS restrictions)
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
    const ipRes = await fetch(`https://ipapi.co/${clientIp ? clientIp + '/' : ''}json/`, {
      headers: { 'User-Agent': 'MivajSports/1.0' },
      cache: 'no-store',
    });

    if (ipRes.ok) {
      const data = await ipRes.json();
      if (data && data.city) {
        return NextResponse.json({
          success: true,
          city: data.city,
          region: data.region || data.region_code || '',
          country: data.country_name || 'Nigeria',
          latitude: data.latitude || 9.0765,
          longitude: data.longitude || 7.3986,
          source: 'ipapi-server',
        });
      }
    }

    // 3. Fallback to ipwho.is
    const ipwhoRes = await fetch(`https://ipwho.is/${clientIp}`, { cache: 'no-store' });
    if (ipwhoRes.ok) {
      const whoData = await ipwhoRes.json();
      if (whoData && whoData.success && whoData.city) {
        return NextResponse.json({
          success: true,
          city: whoData.city,
          region: whoData.region || '',
          country: whoData.country || 'Nigeria',
          latitude: whoData.latitude || 9.0765,
          longitude: whoData.longitude || 7.3986,
          source: 'ipwho-server',
        });
      }
    }

    // Fallback: Nigeria Match Location
    return NextResponse.json({
      success: true,
      city: 'Nigeria Match Hub',
      region: 'West Africa',
      country: 'Nigeria',
      latitude: 9.0765,
      longitude: 7.3986,
      source: 'fallback',
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      city: 'Nigeria Match Hub',
      country: 'Nigeria',
      error: err.message,
    });
  }
}
