import { NextResponse } from 'next/server';

const IN_MEMORY_WISHES: Record<string, any[]> = {};

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const playerId = params.id;
  const list = IN_MEMORY_WISHES[playerId] || [
    {
      id: 'w-seed-1',
      player_id: playerId,
      sender_name: 'NaijaSuperFan ⚡',
      wish_message: 'Happy Birthday King! More goals, more trophies, and pure greatness! 🔥🎂',
      moderation_status: 'APPROVED',
      likes_count: 24,
      created_at: new Date().toISOString()
    }
  ];

  return NextResponse.json({ success: true, count: list.length, data: list });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const playerId = params.id;
  try {
    const body = await request.json();
    const { sender_name, wish_message } = body;

    // Strict local safety check
    const text = (wish_message || '').toLowerCase();
    const blocked = ['fool', 'idiot', 'useless', 'trash', 'werey', 'mumu', 'ode', '419', 'http://', 'https://'];
    
    for (const b of blocked) {
      if (text.includes(b)) {
        return NextResponse.json({
          error: 'CONTENT_MODERATION_FAILED',
          message: `Message rejected: contains restricted term '${b}'`
        }, { status: 400 });
      }
    }

    const newWish = {
      id: `w-${Date.now()}`,
      player_id: playerId,
      sender_name: (sender_name || 'Fan').trim(),
      wish_message: wish_message.trim(),
      moderation_status: 'APPROVED',
      likes_count: 0,
      created_at: new Date().toISOString()
    };

    if (!IN_MEMORY_WISHES[playerId]) {
      IN_MEMORY_WISHES[playerId] = [];
    }
    IN_MEMORY_WISHES[playerId].unshift(newWish);

    return NextResponse.json({ success: true, message: 'Wish approved and posted!', data: newWish });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
