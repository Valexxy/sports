import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { city, country } = await req.json();
    if (!city) {
      return NextResponse.json({ error: 'City name required' }, { status: 400 });
    }

    try {
      await supabase.from('city_clout_cheers').insert({
        city,
        country: country || 'Global',
        cheered_at: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.warn('Supabase city cheer insert fallback:', dbErr);
    }

    return NextResponse.json({ success: true, city });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Error processing cheer' }, { status: 500 });
  }
}
