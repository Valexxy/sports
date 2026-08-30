import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase-client';
import { SpamFilterEngine } from '../../../lib/spam-filter-engine';
import { TelegramModeratorService } from '../../../lib/telegram-moderator-service';

export const dynamic = 'force-dynamic';

interface MatchComment {
  id: string;
  matchId: string;
  sender: string;
  badge: string;
  club_flair?: string;
  category?: string;
  text: string;
  time: string;
  timestamp: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

// In-Memory Fallback Cache for sub-millisecond edge responses
const MATCH_COMMENTS_STORE: Record<string, MatchComment[]> = {
  'default': [
    { id: '1', matchId: 'default', sender: 'CyberStriker_99', badge: 'VIP 👑', club_flair: 'Arsenal 🔴', category: 'BANTER', text: 'Pitch momentum is high! Goal threat rising 🔥', time: '14\'', timestamp: Date.now() - 60000, status: 'APPROVED' },
    { id: '2', matchId: 'default', sender: 'AbaTactician', badge: 'PRO ⚡', club_flair: 'Real Madrid ⚪', category: 'TACTICAL', text: 'Solid defensive structure. Over 1.5 Banker looks locked.', time: '18\'', timestamp: Date.now() - 30000, status: 'APPROVED' },
  ],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get('matchId') || 'default';

  // 1. Try fetching from Supabase PostgreSQL (only APPROVED)
  try {
    const { data, error } = await supabase
      .from('fan_comments')
      .select('*')
      .eq('match_id', matchId)
      .eq('status', 'APPROVED')
      .order('created_at', { ascending: false })
      .limit(40);

    if (!error && data && data.length > 0) {
      const mappedComments: MatchComment[] = data.map((c) => ({
        id: c.id,
        matchId: c.match_id,
        sender: c.user_name,
        badge: c.badge || 'PRO ⚡',
        club_flair: c.club_flair || 'Neutral ⚖️',
        category: c.category || 'BANTER',
        text: c.text,
        time: 'Live',
        timestamp: new Date(c.created_at).getTime(),
        status: 'APPROVED',
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

  // 2. Fallback to In-Memory Store (filtered by APPROVED)
  const allInMemory = MATCH_COMMENTS_STORE[matchId] || [
    { id: '1', matchId, sender: 'CyberStriker_99', badge: 'VIP 👑', club_flair: 'Arsenal 🔴', category: 'BANTER', text: 'High pressing from both sides in this fixture! 🔥', time: '12\'', timestamp: Date.now() - 45000, status: 'APPROVED' },
    { id: '2', matchId, sender: 'PoissonAnalyst', badge: 'PRO ⚡', club_flair: 'Man Utd 🔴', category: 'TACTICAL', text: 'xG model indicates strong second-half goal probability.', time: '21\'', timestamp: Date.now() - 15000, status: 'APPROVED' },
  ];

  const comments = allInMemory.filter(c => c.status === 'APPROVED');

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
    const { matchId, matchTitle, sender, userName, comment, text, badge, flair, category, time } = body;

    const postText = (comment || text || '').trim();
    const authorName = (userName || sender || 'MatchFan').trim();
    const clubFlair = flair || 'Neutral ⚖️';
    const postCategory = category || 'BANTER';

    if (!matchId || !postText) {
      return NextResponse.json({ error: 'Missing matchId or comment text' }, { status: 400 });
    }

    // 1. Run Automated Spam & Scam Filter
    const validation = SpamFilterEngine.validate(postText);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.reason || 'Post blocked by moderation filter' }, { status: 422 });
    }

    const postId = `comm-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    const newComment: MatchComment = {
      id: postId,
      matchId,
      sender: authorName,
      badge: badge || 'PRO ⚡',
      club_flair: clubFlair,
      category: postCategory,
      text: validation.sanitizedText,
      time: time || 'Live',
      timestamp: Date.now(),
      status: 'PENDING',
    };

    // Store in local memory store
    if (!MATCH_COMMENTS_STORE[matchId]) {
      MATCH_COMMENTS_STORE[matchId] = [];
    }
    MATCH_COMMENTS_STORE[matchId].unshift(newComment);

    // 2. Persist to Supabase as PENDING
    try {
      await supabase.from('fan_comments').insert([
        {
          id: postId,
          match_id: matchId,
          user_name: authorName,
          badge: newComment.badge,
          club_flair: clubFlair,
          category: postCategory,
          text: validation.sanitizedText,
          status: 'PENDING',
          country_flag: '🇳🇬',
        },
      ]);
    } catch (dbErr) {
      console.warn('Supabase comment insert warning:', dbErr);
    }

    // 3. Dispatch to Owner Telegram for 1-Tap Inline Approval
    try {
      await TelegramModeratorService.dispatchPostForReview({
        postId,
        matchId,
        matchTitle: matchTitle || `Match ID: ${matchId}`,
        userName: authorName,
        flair: clubFlair,
        category: postCategory,
        text: validation.sanitizedText,
      });
    } catch (tgErr) {
      console.warn('Telegram moderator dispatch warning:', tgErr);
    }

    return NextResponse.json({
      status: 'PENDING',
      message: 'Post submitted for owner approval via Telegram @mivajsport',
      post: newComment,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}
