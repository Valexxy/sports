import { NextResponse } from 'next/server';
import { getRealLiveAndPlayedMatches } from '../../../../lib/real-sports-stream';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const waToken = process.env.WHATSAPP_API_TOKEN;
  const waPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!waToken || !waPhoneId) {
    return NextResponse.json({ success: false, message: 'WhatsApp API credentials missing in .env.local.' });
  }

  try {
    const matches = await getRealLiveAndPlayedMatches();
    const liveCount = matches.filter(m => m.status === 'IN_PLAY' || m.status === 'LIVE').length;
    
    // Send a WhatsApp template message (assuming template exists)
    const payload = {
      messaging_product: "whatsapp",
      to: process.env.WHATSAPP_BROADCAST_GROUP_ID || "123456789", // Target group or user
      type: "template",
      template: {
        name: "mivaj_live_alert",
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [{ type: "text", text: There are  live games active right now! Check the Mivaj Omni-Board. }]
          }
        ]
      }
    };

    const res = await fetch(https://graph.facebook.com/v17.0//messages, {
      method: 'POST',
      headers: {
        'Authorization': Bearer ,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(await res.text());

    return NextResponse.json({ success: true, message: 'WhatsApp Broadcast sent.' });
  } catch (err: any) {
    console.error('WhatsApp Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
