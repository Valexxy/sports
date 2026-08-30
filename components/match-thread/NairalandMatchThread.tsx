'use client';
import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Clock, Check, AlertCircle, Globe, Flame, Shield, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';

const CLUB_FLAIRS = [
  { label: 'Arsenal 🔴', value: 'Arsenal 🔴' },
  { label: 'Chelsea 🔵', value: 'Chelsea 🔵' },
  { label: 'Man Utd 🔴', value: 'Man Utd 🔴' },
  { label: 'Liverpool 🔴', value: 'Liverpool 🔴' },
  { label: 'Man City 🩵', value: 'Man City 🩵' },
  { label: 'Real Madrid ⚪', value: 'Real Madrid ⚪' },
  { label: 'Barcelona 🔵🔴', value: 'Barcelona 🔵🔴' },
  { label: 'Bayern ⚪🔴', value: 'Bayern ⚪🔴' },
  { label: 'PSG 🔵', value: 'PSG 🔵' },
  { label: 'Super Eagles 🦅🇳🇬', value: 'Super Eagles 🦅🇳🇬' },
  { label: 'Neutral ⚖️', value: 'Neutral ⚖️' },
];

const CATEGORIES = [
  { label: '🔥 Banter', value: 'BANTER' },
  { label: '📊 Tactical', value: 'TACTICAL' },
  { label: '🚩 VAR Robbery', value: 'VAR_ROBBERY' },
  { label: '🌍 World View', value: 'WORLD_VIEW' },
];

interface Post {
  id: string;
  sender?: string;
  user_name?: string;
  club_flair?: string;
  badge?: string;
  category?: string;
  text?: string;
  comment?: string;
  created_at?: string;
  timestamp?: number;
  status?: string;
}

interface NairalandMatchThreadProps {
  matchId: string;
  matchTitle: string;
}

export const NairalandMatchThread: React.FC<NairalandMatchThreadProps> = ({ matchId, matchTitle }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userName, setUserName] = useState('Fan');
  const [flair, setFlair] = useState('Neutral ⚖️');
  const [category, setCategory] = useState('BANTER');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [pendingPosts, setPendingPosts] = useState<Post[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('mivaj_user_nickname');
      if (stored) setUserName(stored);
    } catch {}
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/comments?matchId=${encodeURIComponent(matchId)}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.comments || []);
      }
    } catch {}
  };

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 8000);
    return () => clearInterval(interval);
  }, [matchId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      phoneHardware.triggerHaptic('SELECTION');
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId,
          matchTitle,
          userName,
          flair,
          category,
          comment: text.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.status === 'PENDING') {
          const newPending: Post = {
            id: data.post?.id || `pending-${Date.now()}`,
            user_name: userName,
            sender: userName,
            club_flair: flair,
            category,
            text: text.trim(),
            comment: text.trim(),
            created_at: new Date().toISOString(),
            status: 'PENDING',
          };
          setPendingPosts((prev) => [newPending, ...prev]);
          setFeedback({ type: 'success', msg: '⏳ Post submitted! Sent to Telegram @mivajsport for owner approval.' });
          try {
            confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
            stadiumAudio.playWhistle();
          } catch {}
        } else {
          setFeedback({ type: 'success', msg: '✅ Post live in thread!' });
          fetchPosts();
        }
        setText('');
      } else {
        setFeedback({ type: 'error', msg: data.error || 'Post blocked by moderation filter' });
      }
    } catch {
      setFeedback({ type: 'error', msg: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setFeedback(null), 6000);
    }
  };

  const allPosts = [
    ...pendingPosts.filter((p) => !posts.find((lp) => lp.id === p.id)),
    ...posts,
  ];

  return (
    <div className="space-y-3 font-mono text-xs">
      {/* Nairaland Style Thread Header */}
      <div className="flex items-center justify-between px-1 bg-black/60 p-2.5 rounded-2xl border border-white/10">
        <div className="flex items-center space-x-2 min-w-0">
          <Globe className="w-4 h-4 text-stadiumGreen flex-shrink-0" />
          <div className="truncate">
            <span className="text-[10px] text-gray-400">Mivaj Sports › </span>
            <span className="text-white font-bold text-[11px] truncate">{matchTitle || 'Match Banter Thread'}</span>
          </div>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/30 font-bold flex-shrink-0">
          {posts.length} Live Posts
        </span>
      </div>

      {/* Post Form */}
      <form onSubmit={handleSubmit} className="space-y-2 bg-black/50 rounded-2xl p-3 border border-white/10 shadow-inner">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex gap-1.5 flex-wrap">
            <select
              value={flair}
              onChange={(e) => setFlair(e.target.value)}
              className="bg-black/80 border border-white/15 rounded-xl text-[10px] text-gray-200 px-2 py-1 focus:outline-none focus:border-stadiumGreen"
            >
              {CLUB_FLAIRS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-black/80 border border-white/15 rounded-xl text-[10px] text-gray-200 px-2 py-1 focus:outline-none focus:border-stadiumGreen"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <span className="text-[9px] text-gray-500 font-sans">
            👤 Posting as <b className="text-stadiumGreen">@{userName}</b>
          </span>
        </div>

        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Drop your banter, tactical analysis, or VAR opinion here... (600 chars max, anti-spam protected)"
            className="w-full bg-black/70 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white placeholder-gray-500 focus:outline-none focus:border-stadiumGreen resize-none leading-relaxed"
            rows={3}
            maxLength={600}
          />
          <span className="absolute bottom-2 right-2 text-[9px] text-gray-500">{text.length}/600</span>
        </div>

        {feedback && (
          <div
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center space-x-1.5 ${
              feedback.type === 'success'
                ? 'bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/30'
                : 'bg-crimson/20 text-red-400 border border-crimson/30'
            }`}
          >
            {feedback.type === 'success' ? <Check className="w-3.5 h-3.5 flex-shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />}
            <span>{feedback.msg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || text.trim().length < 3}
          className="w-full py-2.5 rounded-xl bg-stadiumGreen hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center space-x-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shadow-md"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{submitting ? 'Verifying & Submitting...' : 'Post Match Banter'}</span>
        </button>
      </form>

      {/* Posts Feed */}
      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-0.5">
        {allPosts.length === 0 && (
          <div className="text-center text-gray-500 py-8 text-[11px]">
            No banter in this match thread yet. Drop the first tactical hot take! 🔥
          </div>
        )}
        {allPosts.map((post, idx) => {
          const postText = post.text || post.comment || '';
          const author = post.sender || post.user_name || 'Fan';
          const postFlair = post.club_flair || 'Neutral ⚖️';
          const postCategory = post.category || 'BANTER';
          const isPending = post.status === 'PENDING';

          return (
            <div
              key={post.id || idx}
              className={`rounded-2xl p-3 border space-y-1.5 transition-all ${
                isPending
                  ? 'bg-amber-900/15 border-amber-500/40 shadow-sm'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/15'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[9px] text-gray-500 font-mono">#{idx + 1}</span>
                  <span className="font-bold text-stadiumGreen">@{author}</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] text-gray-300">
                    {postFlair}
                  </span>
                  <span className="text-[9px] text-gray-500 uppercase">{postCategory.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {isPending && (
                    <span className="flex items-center space-x-0.5 text-[9px] text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">
                      <Clock className="w-2.5 h-2.5" />
                      <span>Pending Approval</span>
                    </span>
                  )}
                  <span className="text-[9px] text-gray-500 font-mono">
                    {post.created_at ? new Date(post.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : 'Live'}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-gray-200 leading-relaxed font-sans">{postText}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
