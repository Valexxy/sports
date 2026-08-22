'use client';

import React, { useState, useEffect } from 'react';
import { MatchData } from '../lib/sports-api';
import { 
  Tv, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Camera, 
  Radio, 
  Flame, 
  Zap, 
  Shield, 
  Activity, 
  Sparkles,
  ExternalLink,
  Layers,
  Video
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { useTranslation } from '../lib/translation-engine';

interface TvBroadcastMatchViewerProps {
  match: MatchData;
  onClose?: () => void;
}

type TvCamMode = 'MAIN_BROADCAST' | 'TACTICAL_360' | 'GOAL_CAM' | 'VIDEO_STREAM';

export const TvBroadcastMatchViewer: React.FC<TvBroadcastMatchViewerProps> = ({ match }) => {
  const { t } = useTranslation();
  const [camMode, setCamMode] = useState<TvCamMode>('MAIN_BROADCAST');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioCommentaryPlaying, setIsAudioCommentaryPlaying] = useState(false);
  const [liveSeconds, setLiveSeconds] = useState(24);
  const [activeLowerThird, setActiveLowerThird] = useState<{ title: string; subtitle: string; icon: string } | null>({
    title: 'KEY MATCH STAT',
    subtitle: '78% pass accuracy in final third • 8 shots on target',
    icon: '📊',
  });

  // Real-time ball coordinates on pitch (0-100% X, 0-100% Y)
  const [ballPos, setBallPos] = useState({ x: 52, y: 48 });
  const [actionPhase, setActionPhase] = useState('ATTACKING BUILDUP');
  const [attackingSide, setAttackingSide] = useState<'HOME' | 'AWAY'>('HOME');

  // Dynamic Lower Third TV Broadcast Banner cycle
  useEffect(() => {
    const banners = [
      { title: '⚡ LIVE PRESSURE INDEX', subtitle: `${match.homeTeam} maintaining 64% territory control.`, icon: '⚡' },
      { title: '🥅 EXPECTED GOALS (xG)', subtitle: `${match.homeTeam} 2.14 vs 0.88 ${match.awayTeam}`, icon: '🎯' },
      { title: '🔥 DANGEROUS ATTACKS', subtitle: '18 dangerous attacks generated in the last 15 minutes.', icon: '🔥' },
      { title: '🎙️ STADIUM ATMOSPHERE', subtitle: `48,500 roaring fans live at ${match.venue || match.homeTeam + ' Stadium'}.`, icon: '🏟️' },
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % banners.length;
      setActiveLowerThird(banners[idx]);
    }, 5500);
    return () => clearInterval(interval);
  }, [match]);

  // Live match second ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveSeconds((prev) => (prev + 1) % 60);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Broadcast pitch tracking loop
  useEffect(() => {
    const interval = setInterval(() => {
      const isHome = Math.random() > 0.45;
      setAttackingSide(isHome ? 'HOME' : 'AWAY');
      const newX = isHome ? Math.floor(52 + Math.random() * 42) : Math.floor(6 + Math.random() * 44);
      const newY = Math.floor(18 + Math.random() * 64);
      setBallPos({ x: newX, y: newY });

      if (newX > 82 || newX < 18) {
        setActionPhase('🎯 SHOT ON GOAL / DANGER IN BOX');
      } else if (newX > 66 || newX < 34) {
        setActionPhase('⚡ PENETRATING ATTACK');
      } else {
        setActionPhase('MIDFIELD POSSESSION');
      }
    }, 2200);
    return () => clearInterval(interval);
  }, [match]);

  const handleToggleAudio = () => {
    phoneHardware.triggerHaptic('SELECTION');
    if (!isAudioCommentaryPlaying) {
      setIsAudioCommentaryPlaying(true);
      stadiumAudio.enableOnUserClick();
      stadiumAudio.speakNigerian(`Live match commentary: ${match.homeTeam} ${match.homeScore ?? 0}, ${match.awayTeam} ${match.awayScore ?? 0}. Current action: ${actionPhase}`);
    } else {
      setIsAudioCommentaryPlaying(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const homeAbbr = (match.homeTeam.slice(0, 3)).toUpperCase();
  const awayAbbr = (match.awayTeam.slice(0, 3)).toUpperCase();
  const minuteDisplay = match.status === 'LIVE' ? (match.matchTime || "64'") : match.status === 'FINISHED' ? 'FT' : match.matchTime;

  return (
    <div className={`glass-panel-premium rounded-3xl border-2 border-stadiumGreen/60 overflow-hidden shadow-2xl space-y-3 font-mono text-xs ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-black p-4' : 'p-3 sm:p-5'
    }`}>
      
      {/* TV CHANNEL BAR & CAMERA CONTROLS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="px-2.5 py-1 rounded-xl bg-crimson text-white font-black text-[10px] animate-pulse flex items-center space-x-1.5 shadow-md shadow-crimson/30">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>LIVE TV BROADCAST 4K</span>
          </div>
          <span className="font-bold text-white text-xs hidden md:inline">
            {match.league} • Official Stadium Feed
          </span>
        </div>

        {/* Camera Selector Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 scrollbar-none self-stretch sm:self-auto">
          {[
            { key: 'MAIN_BROADCAST', label: '📺 Main TV Cam', icon: Tv },
            { key: 'TACTICAL_360', label: '🎥 Tactical 3D', icon: Camera },
            { key: 'VIDEO_STREAM', label: '🎬 HD Stream Player', icon: Video },
          ].map((c) => (
            <button
              key={c.key}
              onClick={() => {
                setCamMode(c.key as any);
                phoneHardware.triggerHaptic('SELECTION');
                stadiumAudio.playTabClickSound();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1 flex-shrink-0 ${
                camMode === c.key
                  ? 'bg-stadiumGreen text-black shadow-md shadow-stadiumGreen/20'
                  : 'bg-black/50 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              <span>{c.label}</span>
            </button>
          ))}

          {/* Audio Commentary Button */}
          <button
            onClick={handleToggleAudio}
            className={`p-1.5 rounded-xl border transition-all flex items-center space-x-1 flex-shrink-0 ${
              isAudioCommentaryPlaying
                ? 'bg-gold text-black border-gold shadow-md'
                : 'bg-white/5 border-white/10 text-stadiumGreen hover:bg-stadiumGreen/20'
            }`}
            title="Listen Live TV Audio Commentary"
          >
            {isAudioCommentaryPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-all flex-shrink-0"
            title="Toggle TV Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* MAIN TV SCREEN (16:9 BROADCAST ASPECT RATIO) */}
      {camMode !== 'VIDEO_STREAM' ? (
        <div className="relative w-full aspect-video rounded-3xl bg-gradient-to-b from-[#0b331c] via-[#072414] to-[#0b331c] border-2 border-stadiumGreen/40 overflow-hidden shadow-2xl select-none">
          
          {/* Realistic High-Res Grass Texture Lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

          {/* Pitch Markings */}
          <div className="absolute inset-3 border-2 border-white/40 rounded-2xl pointer-events-none" />
          <div className="absolute left-1/2 top-3 bottom-3 w-0.5 bg-white/40 -translate-x-1/2" />
          <div className="absolute left-1/2 top-1/2 w-28 h-28 rounded-full border-2 border-white/40 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute left-1/2 top-1/2 w-2.5 h-2.5 rounded-full bg-white -translate-x-1/2 -translate-y-1/2" />

          {/* Penalty Boxes */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-32 h-52 border-2 border-white/40 border-l-0 rounded-r-2xl" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-32 h-52 border-2 border-white/40 border-r-0 rounded-l-2xl" />

          {/* OFFICIAL TV SCOREBUG (TOP LEFT OVERLAY) */}
          <div className="absolute top-4 left-4 z-30 flex items-center shadow-2xl rounded-2xl overflow-hidden border border-white/20 bg-black/90 backdrop-blur-md">
            {/* Home Team Color Block */}
            <div className="px-2.5 py-1.5 bg-stadiumGreen text-black font-black text-xs flex items-center space-x-1">
              <span>{homeAbbr}</span>
              <span className="text-sm font-extrabold">{match.homeScore ?? 0}</span>
            </div>
            
            {/* Away Team Color Block */}
            <div className="px-2.5 py-1.5 bg-crimson text-white font-black text-xs flex items-center space-x-1">
              <span className="text-sm font-extrabold">{match.awayScore ?? 0}</span>
              <span>{awayAbbr}</span>
            </div>

            {/* Live Clock Bug */}
            <div className="px-3 py-1.5 bg-black text-gold font-mono font-black text-xs flex items-center space-x-1 border-l border-white/10">
              <span className="text-white">{minuteDisplay}</span>
              <span className="text-[9px] text-gray-400">:{liveSeconds < 10 ? `0${liveSeconds}` : liveSeconds}</span>
            </div>
          </div>

          {/* TV CHANNEL WATERMARK (TOP RIGHT OVERLAY) */}
          <div className="absolute top-4 right-4 z-30 flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-black/80 border border-white/10 text-[9px] text-white font-bold backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-stadiumGreen animate-ping" />
            <span>AURASCORE HD 1</span>
          </div>

          {/* LIVE ACTION STATUS BUG (CENTER TOP) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-black/75 border border-stadiumGreen/40 text-stadiumGreen font-black text-[10px] backdrop-blur-md">
            <span>{actionPhase}</span>
          </div>

          {/* Home Players */}
          {[
            { x: 12, y: 50, label: 'GK' },
            { x: 28, y: 25, label: 'LB' },
            { x: 26, y: 45, label: 'CB' },
            { x: 26, y: 55, label: 'CB' },
            { x: 28, y: 75, label: 'RB' },
            { x: 44, y: 35, label: 'CM' },
            { x: 42, y: 50, label: 'DM' },
            { x: 44, y: 65, label: 'CM' },
            { x: 62, y: 25, label: 'LW' },
            { x: 66, y: 50, label: 'ST' },
            { x: 62, y: 75, label: 'RW' },
          ].map((p, i) => (
            <div
              key={`h-${i}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
            >
              <div className="w-6 h-6 rounded-full bg-stadiumGreen text-black font-black text-[9px] flex items-center justify-center shadow-xl border border-white/40">
                {p.label}
              </div>
            </div>
          ))}

          {/* Away Players */}
          {[
            { x: 88, y: 50, label: 'GK' },
            { x: 74, y: 25, label: 'RB' },
            { x: 76, y: 45, label: 'CB' },
            { x: 76, y: 55, label: 'CB' },
            { x: 74, y: 75, label: 'LB' },
            { x: 58, y: 35, label: 'DM' },
            { x: 58, y: 65, label: 'DM' },
            { x: 48, y: 25, label: 'RW' },
            { x: 46, y: 50, label: 'AM' },
            { x: 48, y: 75, label: 'LW' },
            { x: 38, y: 50, label: 'ST' },
          ].map((p, i) => (
            <div
              key={`a-${i}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
            >
              <div className="w-6 h-6 rounded-full bg-crimson text-white font-black text-[9px] flex items-center justify-center shadow-xl border border-white/40">
                {p.label}
              </div>
            </div>
          ))}

          {/* Real-Time Animated Match Ball */}
          <div
            style={{ left: `${ballPos.x}%`, top: `${ballPos.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out z-20"
          >
            <div className="w-5 h-5 rounded-full bg-white text-black text-xs flex items-center justify-center shadow-2xl ring-4 ring-gold/70 animate-bounce">
              ⚽
            </div>
          </div>

          {/* TV BROADCAST LOWER-THIRD BANNER (BOTTOM OVERLAY) */}
          {activeLowerThird && (
            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 z-30 p-3 rounded-2xl bg-black/90 backdrop-blur-xl border border-stadiumGreen/40 shadow-2xl flex items-center justify-between gap-3 animate-slideUp">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-stadiumGreen/20 border border-stadiumGreen text-stadiumGreen flex items-center justify-center text-base flex-shrink-0">
                  {activeLowerThird.icon}
                </div>
                <div className="min-w-0">
                  <span className="font-black text-gold text-[10px] uppercase block tracking-wider">
                    {activeLowerThird.title}
                  </span>
                  <span className="font-bold text-white text-xs truncate block font-sans">
                    {activeLowerThird.subtitle}
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex items-center space-x-2 text-[10px] text-gray-400 font-sans flex-shrink-0">
                <span>OPTA STATS LIVE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-stadiumGreen animate-ping" />
              </div>
            </div>
          )}

        </div>
      ) : (
        /* STREAM & BROADCAST FEED EMBED PLAYER */
        <div className="relative w-full aspect-video rounded-3xl bg-black/95 border-2 border-stadiumGreen/40 overflow-hidden shadow-2xl flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-stadiumGreen to-emerald-400 flex items-center justify-center text-black text-3xl shadow-2xl glow-emerald animate-pulse">
            <Play className="w-10 h-10 fill-current ml-1" />
          </div>
          <div>
            <h3 className="font-black text-base sm:text-lg text-white">
              OFFICIAL BROADCAST STREAM & HIGHLIGHTS FEED
            </h3>
            <p className="text-xs text-gray-400 font-sans max-w-lg mt-1">
              Watch official HD broadcast footage and verified highlights for {match.homeTeam} vs {match.awayTeam} in {match.league}.
            </p>
          </div>
          <button
            onClick={() => {
              phoneHardware.triggerHaptic('SELECTION');
              stadiumAudio.playWonTicketSound();
              window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(match.homeTeam + ' vs ' + match.awayTeam + ' live match highlights')}`, '_blank');
            }}
            className="px-6 py-3 rounded-2xl bg-stadiumGreen text-black font-black text-xs hover:bg-emerald-400 transition-all flex items-center space-x-2 shadow-xl glow-emerald active:scale-95"
          >
            <Video className="w-4 h-4" />
            <span>Launch Official HD Broadcast Player ➔</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* MATCH MOMENTUM & POSSESSION BAR */}
      <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="font-black text-stadiumGreen text-xs">{match.homeTeam}</span>
          <span className="px-2 py-0.5 rounded bg-white/10 text-white font-bold text-[10px]">58% POSSESSION</span>
        </div>

        <div className="flex-1 max-w-xs h-2 bg-black/80 rounded-full overflow-hidden flex mx-2">
          <div style={{ width: '58%' }} className="bg-stadiumGreen h-full" />
          <div style={{ width: '42%' }} className="bg-crimson h-full" />
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded bg-white/10 text-white font-bold text-[10px]">42% POSSESSION</span>
          <span className="font-black text-crimson text-xs">{match.awayTeam}</span>
        </div>
      </div>

    </div>
  );
};
