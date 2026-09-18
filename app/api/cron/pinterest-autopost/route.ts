import { NextResponse } from 'next/server';
import { getRealLiveAndPlayedMatches } from '../../../../lib/real-sports-stream';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(req: Request) {
  const token = process.env.PINTEREST_ACCESS_TOKEN;
  const boardId = process.env.PINTEREST_BOARD_ID;

  if (!token || !boardId) {
    return NextResponse.json({ success: false, message: 'Pinterest credentials missing.' });
  }

  try {
    const matches = await getRealLiveAndPlayedMatches();
    // In a real scenario we would generate a winning slip image. For now, post a text pin or static image.
    const match = matches.find(m => m.status === 'FINISHED' && m.prediction?.topPick?.selection);

    if (!match) {
      return NextResponse.json({ success: true, message: 'No completed matches to pin.' });
    }

    const title = WINNER!  vs ;
    const description = Mivaj AI correctly predicted . Get more free VIP picks in our Telegram!;
    const link = 'https://t.me/mivajsport';
    // Fallback placeholder image if we don't have dynamic generation
    const imageUrl = 'https://mivaj.com/images/og-image.jpg'; 

    const payload = {
      board_id: boardId,
      title: title.substring(0, 100),
      description: description.substring(0, 500),
      link: link,
      media_source: {
        source_type: "image_url",
        url: imageUrl
      }
    };

    const res = await fetch('https://api.pinterest.com/v5/pins', {
      method: 'POST',
      headers: { 
        'Authorization': Bearer ,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(Pinterest API error:  );
    }

    return NextResponse.json({ success: true, message: 'Pinned successfully.' });
  } catch (err: any) {
    console.error('Pinterest Autopost Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
