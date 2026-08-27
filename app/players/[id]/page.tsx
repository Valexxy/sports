'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Trophy, Shield, Flame, Heart, Bell, BellRing, Sparkles, 
  Send, ArrowLeft, Share2, Star, Check, Activity 
} from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../../lib/phone-hardware-engine';
import { useAudioStore } from '../../../lib/audio-store';
import { SocialWishCardModal } from '../../../components/players/SocialWishCardModal';

interface PlayerDetails {
  id: string;
  name: string;
  sport: string;
  position: string;
  jersey_number?: number;
  team_name: string;
  team_logo?: string;
  league?: string;
  country: string;
  country_flag?: string;
  date_of_birth: string;
  bio: string;
  market_value: string;
  foot: string;
  cutout_url?: string;
  trophies?: string[];
  career_stats?: {
    goals: number;
    assists: number;
    appearances: number;
    rating: number;
  };
}

export default function PlayerWikiPage() {
  const params = useParams();
  const playerId = (params?.id as string) || 'tsdb-osimhen';

  const [player, setPlayer] = useState<PlayerDetails | null>(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const [wishInput, setWishInput] = useState('');
  const [senderName, setSenderName] = useState('NaijaSupporter');
  const [wishes, setWishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingWish, setSubmittingWish] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeWishForCard, setActiveWishForCard] = useState('');

  const { playTrack } = useAudioStore();

  useEffect(() => {
    // Fetch player data from backend
    fetch(`/api/v1/players/${playerId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setPlayer(data.data);
        }
      })
      .catch((err) => console.log('Player fetch error:', err))
      .finally(() => setLoading(false));

    // Fetch player birthday wishes
    fetch(`/api/v1/players/${playerId}/wishes`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setWishes(data.data);
        }
      })
      .catch(() => {});
  }, [playerId]);

  const handleToggleFollow = async () => {
    phoneHardware.triggerHaptic('SELECTION');
    setIsFollowed(!isFollowed);
    if (!isFollowed) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      alert(`🔔 Matchday Kickoff Alerts Activated for ${player?.name || 'Player'} via WhatsApp!`);
    }
  };

  const handleStartLiveAudio = () => {
    if (!player) return;
    phoneHardware.triggerHaptic('SUCCESS');
    playTrack({
      matchId: `m-${player.id}`,
      homeTeam: player.team_name,
      awayTeam: 'Rival FC',
      homeScore: 2,
      awayScore: 1,
      matchTime: "68'",
      league: player.league,
    }, 'WARRI');
  };

  const handleSubmitWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishInput.trim() || submittingWish) return;

    setSubmittingWish(true);
    phoneHardware.triggerHaptic('SUCCESS');

    try {
      const res = await fetch(`/api/v1/players/${playerId}/wishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_name: senderName,
          wish_message: wishInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(`❌ Moderation Alert: ${data.detail?.message || 'Message did not pass safety moderation.'}`);
        setSubmittingWish(false);
        return;
      }

      confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
      setWishes([data.data, ...wishes]);
      setActiveWishForCard(wishInput);
      setWishInput('');
      setShowShareModal(true);
    } catch (err) {
      console.warn('Wish error:', err);
    } finally {
      setSubmittingWish(false);
    }
  };

  if (loading || !player) {
    return (
      <div className="min-h-screen bg-[#05070B] text-white flex items-center justify-center font-mono">
        <div className="flex items-center space-x-2 text-stadiumGreen text-sm">
          <span className="w-3 h-3 rounded-full bg-stadiumGreen animate-ping" />
          <span>LOADING STAR PLAYER WIKI DOSSIER...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070B] text-white font-mono pb-24">
      
      {/* Top Navbar */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Live Stadium</span>
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleFollow}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all shadow-md active:scale-95 ${
                isFollowed
                  ? 'bg-stadiumGreen text-black shadow-stadiumGreen/20'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
              }`}
            >
              {isFollowed ? <BellRing className="w-3.5 h-3.5 fill-black" /> : <Bell className="w-3.5 h-3.5 text-gold" />}
              <span>{isFollowed ? 'Following (15-min Alerts Active)' : 'Follow for WhatsApp Alerts'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* HERO PLAYER BANNER */}
        <div className="relative rounded-3xl bg-gradient-to-b from-emerald-950/40 via-[#070c18] to-black border-2 border-stadiumGreen p-6 sm:p-8 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-stadiumGreen/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            {/* Cutout Portrait */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-t from-black to-emerald-950 border-2 border-stadiumGreen/70 shadow-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src={player.cutout_url || 'https://r2.thesportsdb.com/images/media/player/cutout/b16vvh1726053896.png'}
                alt={player.name}
                className="w-full h-full object-contain filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.9)]"
              />
            </div>

            {/* Title & Key Specs */}
            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40">
                  {player.sport} • #{player.jersey_number || 10}
                </span>
                <span className="text-xs text-gray-400">{player.league}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
                <span>{player.name}</span>
                <span>{player.country_flag}</span>
              </h1>

              <p className="text-xs text-gray-300 leading-relaxed max-w-xl">
                {player.bio}
              </p>

              {/* Quick Metrics */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10">
                  <span className="text-[9px] text-gray-400 block font-bold">CLUB</span>
                  <span className="text-xs font-black text-gold">{player.team_name}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10">
                  <span className="text-[9px] text-gray-400 block font-bold">MARKET VALUE</span>
                  <span className="text-xs font-black text-stadiumGreen">{player.market_value}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10">
                  <span className="text-[9px] text-gray-400 block font-bold">PREFERRED FOOT</span>
                  <span className="text-xs font-black text-white">{player.foot}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10">
                  <span className="text-[9px] text-gray-400 block font-bold">BIRTHDAY</span>
                  <span className="text-xs font-black text-amber-300">{player.date_of_birth}</span>
                </div>
              </div>

              {/* In-Play Audio Stream Button */}
              <div className="pt-2">
                <button
                  onClick={handleStartLiveAudio}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-stadiumGreen to-emerald-400 hover:from-emerald-400 hover:to-stadiumGreen text-black font-black text-xs shadow-md shadow-stadiumGreen/20 flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <span>🎙️</span>
                  <span>Tune In to {player.team_name} Live Match Radio (Female Warri Voice)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CAREER TROPHIES & PERFORMANCE METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Trophies Shelf */}
          <div className="glass-panel-premium rounded-3xl border border-white/10 p-5 space-y-3">
            <span className="text-xs font-black text-gold flex items-center space-x-1.5">
              <Trophy className="w-4 h-4 text-gold" />
              <span>CAREER HONORS & TROPHIES</span>
            </span>

            <div className="space-y-2">
              {(player.trophies || ['UEFA Champions League Winner', 'Domestic League Champion', 'Golden Boot']).map((trophy, idx) => (
                <div key={idx} className="p-2.5 rounded-2xl bg-black/60 border border-white/10 flex items-center space-x-2.5">
                  <span className="text-base">🏆</span>
                  <span className="text-xs font-bold text-gray-200">{trophy}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Stats Radar */}
          <div className="glass-panel-premium rounded-3xl border border-white/10 p-5 space-y-3">
            <span className="text-xs font-black text-stadiumGreen flex items-center space-x-1.5">
              <Activity className="w-4 h-4 text-stadiumGreen" />
              <span>STATISTICAL PERFORMANCE RADAR</span>
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-black/70 border border-white/10 text-center">
                <span className="text-[10px] text-gray-400 block font-bold">GOALS THIS SEASON</span>
                <span className="text-2xl font-black text-stadiumGreen font-mono">{player.career_stats?.goals ?? 26}</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/70 border border-white/10 text-center">
                <span className="text-[10px] text-gray-400 block font-bold">KEY ASSISTS</span>
                <span className="text-2xl font-black text-gold font-mono">{player.career_stats?.assists ?? 8}</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/70 border border-white/10 text-center">
                <span className="text-[10px] text-gray-400 block font-bold">MATCHES PLAYED</span>
                <span className="text-2xl font-black text-white font-mono">{player.career_stats?.appearances ?? 32}</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/70 border border-white/10 text-center">
                <span className="text-[10px] text-gray-400 block font-bold">MATCHDAY RATING</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">{player.career_stats?.rating ?? 8.6} ★</span>
              </div>
            </div>
          </div>

        </div>

        {/* BIRTHDAY PRO WISHING SECTION (WITH AUTOMATED MODERATION) */}
        <div className="glass-panel-premium rounded-3xl border-2 border-gold/50 p-5 sm:p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🎂</span>
              <div>
                <h3 className="font-black text-sm text-white">BIRTHDAY PRO • FAN WISHING STREAM</h3>
                <span className="text-[10px] text-gold font-bold">Protected by Automated 2-Tier Content Moderation</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-gold/20 text-gold text-[10px] font-black border border-gold/40">
              {wishes.length} Wishes
            </span>
          </div>

          {/* Submission Input */}
          <form onSubmit={handleSubmitWish} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Your Name / Handle"
                className="px-3.5 py-2.5 rounded-2xl bg-black/80 border border-white/20 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-stadiumGreen"
                required
              />
              <input
                type="text"
                value={wishInput}
                onChange={(e) => setWishInput(e.target.value)}
                placeholder={`Leave a heartfelt birthday wish for ${player.name}...`}
                className="sm:col-span-2 px-3.5 py-2.5 rounded-2xl bg-black/80 border border-white/20 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-stadiumGreen"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[9px] text-gray-400">
                🛡️ Zero Abuse Policy: Profanity & spam are automatically rejected.
              </span>
              <button
                type="submit"
                disabled={submittingWish}
                className="px-4 py-2 rounded-xl bg-gold hover:bg-amber-400 text-black font-black text-xs flex items-center space-x-1.5 shadow-md transition-all active:scale-95 font-mono"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submittingWish ? 'Checking Safety...' : 'Post Birthday Wish 🎉'}</span>
              </button>
            </div>
          </form>

          {/* Live Wish Stream Feed */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {wishes.map((w, idx) => (
              <div
                key={w.id || idx}
                className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-start justify-between gap-3 hover:border-gold/40 transition-colors"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black text-white">{w.sender_name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-stadiumGreen/20 text-stadiumGreen font-black border border-stadiumGreen/30">
                      APPROVED ✓
                    </span>
                  </div>
                  <p className="text-xs text-gray-200 leading-relaxed">{w.wish_message}</p>
                </div>

                <button
                  onClick={() => {
                    setActiveWishForCard(w.wish_message);
                    setSenderName(w.sender_name);
                    setShowShareModal(true);
                  }}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gold transition-colors flex items-center space-x-1"
                  title="Generate Social Flex Card"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="text-[9px] hidden sm:inline">Flex</span>
                </button>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Social Card Generator Modal */}
      {showShareModal && (
        <SocialWishCardModal
          player={player}
          wishMessage={activeWishForCard}
          senderName={senderName}
          onClose={() => setShowShareModal(false)}
        />
      )}

    </div>
  );
}
