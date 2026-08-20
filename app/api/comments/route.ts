import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

interface MatchComment {
  id: string;
  matchId: string;
  sender: string;
  badge: string;
  text: string;
  time: string;
  timestamp: number;
}

// In-Memory Fallback Cache for sub-millisecond edge responses
const MATCH_COMMENTS_STORE: Record<string, MatchComment[]> = {
  'default': [
    { id: '1', matchId: 'default', sender: 'CyberStriker_99', badge: 'VIP 👑', text: 'Pitch momentum is high! Goal threat rising 🔥', time: '14\'', timestamp: Date.now() - 60000 },
    { id: '2', matchId: 'default', sender: 'AbaTactician', badge: 'PRO ⚡', text: 'Solid defensive structure. Over 1.5 Banker looks locked.', time: '18\'', timestamp: Date.now() - 30000 },
  ],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId') || 'default';

  // 1. Try fetching from Supabase PostgreSQL
  try {
    const { data, error } = await supabase
      .from('fan_comments')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (!error && data && data.length > 0) {
      const mappedComments: MatchComment[] = data.map((c) => ({
        id: c.id,
        matchId: c.match_id,
        sender: c.user_name,
        badge: c.badge || 'PRO ⚡',
        text: c.text,
        time: 'Live',
        timestamp: new Date(c.created_at).getTime(),
      }));

      return NextResponse.json({
        matchId,
        comments: mappedComments,
        total: mappedComments.length,
        source: 'supabase_postgres',
        status: 'success',
      });
    }
  } catch (err) {
    console.warn('Supabase comments fetch fallback:', err);
  }

  // 2. Fallback to In-Memory Store
  const comments = MATCH_COMMENTS_STORE[matchId] || [
    { id: '1', matchId, sender: 'CyberStriker_99', badge: 'VIP 👑', text: 'High pressing from both sides in this fixture! 🔥', time: '12\'', timestamp: Date.now() - 45000 },
    { id: '2', matchId, sender: 'PoissonAnalyst', badge: 'PRO ⚡', text: 'xG model indicates strong second-half goal probability.', time: '21\'', timestamp: Date.now() - 15000 },
  ];

  return NextResponse.json({
    matchId,
    comments,
    total: comments.length,
    source: 'in_memory_edge',
    status: 'success',
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { matchId, sender, text, badge, time } = body;

    if (!matchId || !text) {
      return NextResponse.json({ error: 'Missing matchId or text' }, { status: 400 });
    }

    const newComment: MatchComment = {
      id: `comm-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      matchId,
      sender: sender || 'CyberStriker_99',
      badge: badge || 'PRO ⚡',
      text,
      time: time || 'Live',
      timestamp: Date.now(),
    };

    // Store in local memory
    if (!MATCH_COMMENTS_STORE[matchId]) {
      MATCH_COMMENTS_STORE[matchId] = [];
    }
    MATCH_COMMENTS_STORE[matchId].unshift(newComment);

    // Persist asynchronously to Supabase
    try {
      await supabase.from('fan_comments').insert([
        {
          match_id: matchId,
          user_name: newComment.sender,
          badge: newComment.badge,
          text: newComment.text,
          country_flag: '🇳🇬',
        },
      ]);
    } catch (dbErr) {
      console.warn('Supabase comment insert warning:', dbErr);
    }

    return NextResponse.json({
      status: 'success',
      comment: newComment,
      total: MATCH_COMMENTS_STORE[matchId].length,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}
