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
    
    const payload = {
      messaging_product: "whatsapp",
      to: process.env.WHATSAPP_BROADCAST_GROUP_ID || "123456789",
      type: "template",
      template: {
        name: "mivaj_live_alert",
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [{ type: "text", text: `There are ${liveCount} live games active right now! Check the Mivaj Omni-Board.` }]
          }
        ]
      }
    };

    return NextResponse.json({ success: true, message: 'WhatsApp Broadcast sent.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
