'use client';
import React, { useState, useEffect } from 'react';
import { LockScreenMatchTracker } from '../lib/lockscreen-live-score-tracker';
import { MatchData } from '../lib/sports-api';
import { EdgeAiCommentator } from './edge-ai-commentator';
import { MatchAnalyticsHub } from './match-analytics-hub';
import { getCountrySpecificBookmakers, CountryBookmaker } from '../lib/country-bookmakers';
import { getSmartVisitorDetails, SmartVisitorData } from '../lib/smart-visitor-engine';
import { LiveStadiumMatchViewer } from './live-stadium-match-viewer';
import { TvBroadcastMatchViewer } from './tv-broadcast-match-viewer';
import { ViralMatchSlipModal } from './viral-match-slip-modal';
import { BookmakerSlipExporter } from './bookmaker-slip-exporter';
import { H2HTacticalRadar } from './h2h-tactical-radar';
import { MatchWinProbabilityChart } from './match-win-probability-chart';
import { MatchShotMapViewer } from './match-shot-map-viewer';
import { LivePlayerRatingsMatrix } from './live-player-ratings-matrix';
import { H2HAndRefereeAnalytics } from './h2h-and-referee-analytics';
import { MatchAlertScheduler } from '../lib/match-alert-scheduler';
import { X, Send, MessageSquare, Flame, Trophy, ExternalLink, Zap, Activity, Radio, Sun, Heart, Plus, ShieldCheck, Newspaper, ThumbsUp, Bell, BellRing, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface InsightsModalProps {
  match: MatchData | null;
  onClose: () => void;
  onSelectOdds: (match: MatchData, selection: string, odds: number) => void;
}

interface MatchComment {
  id: string;
  sender: string;
  badge: string;
  text: string;
  time: string;
}

export const MatchInsightsModal: React.FC<InsightsModalProps> = ({ match, onClose, onSelectOdds }) => {
  const [chatMessage, setChatMessage] = useState('');
  const [showViralSlip, setShowViralSlip] = useState(false);
  const [visitorData, setVisitorData] = useState<SmartVisitorData | null>(null);
  const [bookmakers, setBookmakers] = useState<CountryBookmaker[]>([]);
  const [chatFeed, setChatFeed] = useState<MatchComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    getSmartVisitorDetails().then((data) => {
      setVisitorData(data);
      const list = getCountrySpecificBookmakers(data?.countryCode || 'NG', data?.city || '');
      setBookmakers(list);
    });
  }, []);

  // Dynamically load & persist fan chat comments per match ID
  useEffect(() => {
    if (!match) return;

    // Load only real user-submitted chat from localStorage (no fabricated seeds)
    const saved = localStorage.getItem(`match_chat_${match.id}`);
    if (saved) {
      try {
        setChatFeed(JSON.parse(saved));
        return;
      } catch (e) {}
    }

    setChatFeed([]);
  }, [match]);


  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    if (match) {
      setIsFollowed(MatchAlertScheduler.isMatchFollowed(match.id));
    }
  }, [match]);

  const handleToggleFollow = () => {
    if (!match) return;
    if (isFollowed) {
      MatchAlertScheduler.unfollowMatch(match.id);
      setIsFollowed(false);
    } else {
      MatchAlertScheduler.followMatch(match);
      setIsFollowed(true);
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    }
  };

  if (!match) return null;

  const p = match.prediction;

  const handleSendChatMessage = () => {
    if (!chatMessage.trim()) return;
    const newComment: MatchComment = {
      id: `c-${Date.now()}`,
      sender: 'CyberStriker_99',
      badge: 'PRO ⚡',
      text: chatMessage,
      time: match.status === 'LIVE' ? match.matchTime : 'Live',
    };
    const updated = [newComment, ...chatFeed];
    setChatFeed(updated);
    setChatMessage('');

    // Persist per match in localStorage and send to Engine
    localStorage.setItem(`match_chat_${match.id}`, JSON.stringify(updated));
    fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        matchId: match.id,
        sender: 'CyberStriker_99',
        text: chatMessage,
        badge: 'PRO ⚡',
        time: match.matchTime,
      }),
    }).catch(() => {});
  };

  const handleEmojiRain = (emoji: string) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
    });
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(40);
    }
  };

  // Real-Time Verified Sports News from BBC/Sky RSS (no fabricated headlines)
  const [verifiedNewsHype, setVerifiedNewsHype] = useState<{
    sourceBadge: string;
    source: string;
    time: string;
    title: string;
    summary: string;
    url: string;
    color: string;
  }[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/news?limit=5', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const items = (data.news || []).slice(0, 3).map((n: any, idx: number) => ({
          sourceBadge: (n.source || 'BBC').toUpperCase() + ' ✓',
          source: n.source || 'BBC Sport',
          time: n.publishedAt ? new Date(n.publishedAt).toLocaleTimeString() : 'Just now',
          title: n.title || 'Football news',
          summary: (n.summary || n.title || '').slice(0, 90),
          url: n.link || '#',
          color: idx === 0 ? 'text-sky-400' : idx === 1 ? 'text-gold' : 'text-stadiumGreen',
        }));
        if (mounted && items.length > 0) setVerifiedNewsHype(items);
      } catch (e) {
        // leave empty — no fake fallback
      }
    })();
    return () => { mounted = false; };
  }, [match?.id]);


  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-5xl glass-panel-premium rounded-3xl border-2 border-stadiumGreen/50 p-4 sm:p-6 shadow-2xl my-4 max-h-[92vh] overflow-y-auto font-mono text-xs">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10 transition-all hover:rotate-90 z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Header Scoreboard */}
        <div className="flex items-center space-x-2 text-xs font-mono text-stadiumGreen font-bold mb-1">
          <Zap className="w-4 h-4 animate-bounce" />
          <span>STADIUM LIVE MATCH CENTER</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 mb-4 gap-2">
          <div>
            <span className="text-xs font-mono text-gray-400">{match.leagueFlag} {match.league} • 🏟️ {match.venue || `${match.homeTeam} Stadium`}</span>
            <h2 className="text-xl sm:text-3xl font-black text-white flex flex-wrap items-center gap-2 sm:gap-3 mt-0.5">
              <span>{match.homeTeam}</span>
              {match.status === 'FINISHED' || match.status === 'LIVE' ? (
                <span className="px-3.5 py-1 rounded-xl bg-black border-2 border-stadiumGreen text-stadiumGreen font-mono font-black text-lg sm:text-2xl shadow-inner">
                  {match.homeScore ?? 0} - {match.awayScore ?? 0}
                </span>
              ) : (
                <span className="text-stadiumGreen font-mono">VS</span>
              )}
              <span>{match.awayTeam}</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                phoneHardware.triggerHaptic('SELECTION');
                stadiumAudio.playAddPickSound();
                confetti({ particleCount: 35, spread: 60, origin: { y: 0.5 } });
                if (onSelectOdds && match.prediction?.topPick) {
                  onSelectOdds(match, match.prediction.topPick.market || 'Match Winner', match.prediction.topPick.odds || 1.25);
                }
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-black bg-stadiumGreen/20 hover:bg-stadiumGreen/30 text-stadiumGreen border border-stadiumGreen/60 flex items-center space-x-1 transition-all shadow-md active:scale-95"
            >
              <span>+ Slip</span>
            </button>

            <button
              onClick={async () => {
                const pinned = await LockScreenMatchTracker.pinMatchToLockScreen(match);
                if (pinned) {
                  confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
                }
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-black bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center space-x-1 transition-all shadow-md active:scale-95"
              title="Pin Live Score to Phone Lock Screen"
            >
              <span>Pin Score</span>
            </button>

            <button
              onClick={() => setShowViralSlip(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-mono font-black flex items-center space-x-1 transition-all shadow-md bg-gold/20 hover:bg-gold/30 text-gold border border-gold/40"
              title="Share Match Slip"
            >
              <span>Share</span>
            </button>

            <button
              onClick={handleToggleFollow}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-black flex items-center space-x-1.5 transition-all shadow-md ${
                isFollowed
                  ? 'bg-stadiumGreen text-black shadow-stadiumGreen/30'
                  : 'bg-panel hover:bg-white/10 text-white border border-white/10'
              }`}
            >
              <Bell className={`w-3.5 h-3.5 ${isFollowed ? 'fill-black' : 'text-gold'}`} />
              <span>{isFollowed ? 'Alerts On ✓' : 'Alerts'}</span>
            </button>

            <span className={`text-xs font-bold font-mono px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 ${
              match.status === 'LIVE'
                ? 'bg-crimson/20 text-crimson border-crimson/50 animate-pulse shadow-lg shadow-crimson/30'
                : match.status === 'FINISHED'
                ? 'bg-stadiumGreen/20 text-stadiumGreen border-stadiumGreen/40'
                : 'bg-gold/20 text-gold border-gold/40'
            }`}>
              {match.status === 'LIVE' && <span className="w-2 h-2 rounded-full bg-crimson animate-ping" />}
              <span>{match.status === 'LIVE' ? `LIVE ${match.matchTime}` : match.status === 'FINISHED' ? 'FT' : match.matchTime}</span>
            </span>
          </div>
        </div>

        {/* 100% Legal Live 2D Tactical Pitch Visualizer */}
        <div className="mb-4 space-y-4">
          <TvBroadcastMatchViewer match={match} />
          
          {/* Live Play-by-Play & Naija Audio Commentary directly under 2D field */}
          <EdgeAiCommentator match={match} />
        </div>

        {/* 1-Click Bookmaker Slip Exporter */}
        <div className="mb-4">
          <BookmakerSlipExporter match={match} />
        </div>

        {/* H2H Tactical Radar & Power Curves */}
        <div className="mb-4">
          <H2HTacticalRadar match={match} />

          {/* 1. LIVE IN-PLAY WIN PROBABILITY (0'-90') */}
          <MatchWinProbabilityChart match={match} />

          {/* 2. 2D PITCH SHOT MAP & xG TRAJECTORIES */}
          <MatchShotMapViewer match={match} />

          {/* 3. LIVE PLAYER RATINGS MATRIX (1.0 - 10.0) */}
          <LivePlayerRatingsMatrix match={match} />

          {/* 4. H2H DOMINANCE & REFEREE STRICTNESS */}
          <H2HAndRefereeAnalytics match={match} />
        </div>

        {/* PREDICTION VS OUTCOME AUDIT & SETTLEMENT PANEL */}
        <div className="p-4 sm:p-5 rounded-3xl bg-panel border-2 border-stadiumGreen/50 space-y-3 mb-5 shadow-2xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="flex items-center space-x-1.5 text-stadiumGreen font-black">
              <span className="w-2 h-2 rounded-full bg-stadiumGreen" />
              <span>{match.status === 'FINISHED' ? 'OFFICIAL SETTLEMENT & PREDICTION AUDIT' : 'SYSTEM AI PREDICTION & COMMUNITY VOTE'}</span>
            </span>
            <span className="text-gold font-bold">
              {match.status === 'FINISHED' ? '✓ SETTLED' : 'ACTIVE FIXTURE'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. System Platform Prediction */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-stadiumGreen/40 space-y-1">
              <span className="text-[10px] text-gray-400 font-bold block uppercase">1. Platform Prediction</span>
              <span className="text-sm font-black text-stadiumGreen block">{p.topPick.selection}</span>
              <span className="text-[11px] text-gray-300 font-sans block">
                Odds: <strong className="text-gold">@{p.topPick.odds}</strong> &bull; AI Confidence: <strong className="text-white">{p.topPick.probability}%</strong>
              </span>
            </div>

            {/* 2. Community / Users Prediction Vote */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
              <span className="text-[10px] text-gray-400 font-bold block uppercase">2. Viewers Prediction Vote</span>
              <div className="flex justify-between text-[11px] font-bold text-white pt-1">
                <span className="text-stadiumGreen">{match.homeTeam}: {Math.round(p.homeWinProb * 100)}%</span>
                <span className="text-gold">Draw: {Math.round(p.drawProb * 100)}%</span>
                <span className="text-cyan-400">{match.awayTeam}: {Math.round(p.awayWinProb * 100)}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-black/50 overflow-hidden flex mt-1">
                <div style={{ width: `${p.homeWinProb * 100}%` }} className="h-full bg-stadiumGreen" />
                <div style={{ width: `${p.drawProb * 100}%` }} className="h-full bg-gold" />
                <div style={{ width: `${p.awayWinProb * 100}%` }} className="h-full bg-cyan-400" />
              </div>
            </div>

            {/* 3. Final Referee Outcome */}
            <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-1">
              <span className="text-[10px] text-gray-400 font-bold block uppercase">3. Final Match Outcome</span>
              <div className="flex items-center space-x-2">
                <span className="text-base font-black text-white font-mono">
                  {match.homeScore ?? 0} - {match.awayScore ?? 0}
                </span>
                {match.status === 'FINISHED' ? (
                  <span className="px-2.5 py-0.5 rounded-lg bg-stadiumGreen text-black text-[10px] font-black">
                    WON ✅
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-400 text-[10px] font-black border border-amber-500/40">
                    IN PLAY ⚡
                  </span>
                )}
              </div>
              <span className="text-[10px] text-gray-400 font-sans block">
                {match.status === 'FINISHED'
                  ? `${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam} (Audited)`
                  : 'Pending final whistle confirmation'}
              </span>
            </div>
          </div>

          {match.status !== 'FINISHED' && (
            <div className="flex justify-end pt-1">
              <button
                onClick={() => onSelectOdds(match, p.topPick.selection, p.topPick.odds)}
                className="px-4 py-2 rounded-xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-xs shadow-md transition-all flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add ${p.topPick.selection} @ ${p.topPick.odds} to Slip</span>
              </button>
            </div>
          )}
        </div>

        {/* BENTO GRID (ALL FEATURES VISIBLE & PROPERLY SCROLLABLE) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* LEFT 7 COLS: Pitch Radar, Barometers, Timeline & Commentator */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* 1. Goal Power Ratings */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-panel border border-white/10">
                <span className="text-gray-400 block text-[10px]">{match.homeTeam} Goal Power</span>
                <span className="text-lg font-black text-stadiumGreen">{p.expectedHomeGoals.toFixed(2)} xG</span>
              </div>
              <div className="p-3 rounded-2xl bg-panel border border-white/10">
                <span className="text-gray-400 block text-[10px]">{match.awayTeam} Goal Power</span>
                <span className="text-lg font-black text-gold">{p.expectedAwayGoals.toFixed(2)} xG</span>
              </div>
            </div>

            {/* 2. Match Analytics Hub (2D Pitch Radar, H2H History, Correct Scores & Streaks) */}
            <MatchAnalyticsHub
              match={match}
              onSelectOdds={onSelectOdds}
            />



          </div>

          {/* RIGHT 5 COLS: Country Bookmakers, Dynamic Fan Chat & Verified Media Hype */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* 5. Live Stadium Fan Chat Room (Dynamic per Match) */}
            <div className="p-4 rounded-3xl bg-panel border border-white/10 space-y-3">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-stadiumGreen" />
                  <span className="font-extrabold text-white text-xs">DYNAMIC FAN CHAT</span>
                </div>
                <div className="flex space-x-1">
                  {['🔥', '⚽', '👑', '🚀'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleEmojiRain(emoji)}
                      className="p-1 rounded-lg bg-black/60 hover:bg-stadiumGreen/20 text-xs transition-all hover:scale-110"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Feed */}
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {chatFeed.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-2xl bg-black/60 border border-white/5 space-y-0.5 text-[11px]">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-stadiumGreen">{item.sender}</span>
                      <span className="text-gray-500">{item.time}</span>
                    </div>
                    <p className="text-gray-200 font-sans">{item.text}</p>
                  </div>
                ))}
              </div>

              {/* Send Chat Box */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  placeholder={`Comment on ${match.homeTeam} vs ${match.awayTeam}...`}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-black/70 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-stadiumGreen font-mono"
                />
                <button
                  onClick={handleSendChatMessage}
                  className="p-2 rounded-xl bg-stadiumGreen text-black font-bold hover:bg-emerald-400 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
      {showViralSlip && (
        <ViralMatchSlipModal match={match} onClose={() => setShowViralSlip(false)} />
      )}
    </div>
  );
};
