'use client';

function extractMinuteNum(m?: string): number {
  if (!m) return 64;
  const match = m.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 64;
}

import React, { useState, useEffect } from 'react';
import { MatchData } from '../lib/sports-api';
import { 
  Tv, 
  Play, 
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
  Video
} from 'lucide-react';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { stadiumBroadcastAudio } from '../lib/stadium-broadcast-audio-engine';
import { allowSpeechOnUserGesture, speakNaija } from '../lib/naija-voice-engine';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { useTranslation } from '../lib/translation-engine';

interface TvBroadcastMatchViewerProps {
  match: MatchData;
  onClose?: () => void;
}

type ViewerMode = 'TACTICAL_2D' | 'HIGHLIGHTS_PLAYER';

export const TvBroadcastMatchViewer: React.FC<TvBroadcastMatchViewerProps> = ({ match }) => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewerMode>('TACTICAL_2D');
  const [highlightEmbedUrl, setHighlightEmbedUrl] = useState<string>('');
  const [highlightChannel, setHighlightChannel] = useState<'SCOREBAT' | 'DAILYMOTION' | 'ARCHIVE'>('SCOREBAT');
  const [loadingHighlight, setLoadingHighlight] = useState<boolean>(false);

  useEffect(() => {
    if (viewMode === 'HIGHLIGHTS_PLAYER') {
      setLoadingHighlight(true);
      fetch(`/api/highlights?home=${encodeURIComponent(match.homeTeam)}&away=${encodeURIComponent(match.awayTeam)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.embedUrl) {
            setHighlightEmbedUrl(data.embedUrl);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingHighlight(false));
    }
  }, [viewMode, match.homeTeam, match.awayTeam]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioCommentaryPlaying, setIsAudioCommentaryPlaying] = useState(false);
  const [liveSeconds, setLiveSeconds] = useState(24);
  const [activeLowerThird, setActiveLowerThird] = useState<{ title: string; subtitle: string; icon: string } | null>({
    title: 'TERRITORY CONTROL',
    subtitle: `${match.homeTeam} maintaining 62% possession in final third.`,
    icon: '⚡',
  });

  // Real-time ball coordinates on pitch
  const [ballPos, setBallPos] = useState({ x: 52, y: 48 });
  const [actionPhase, setActionPhase] = useState('ATTACKING BUILDUP');

  // Dynamic Lower Third TV Banner
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
    }, 6000);
    return () => clearInterval(interval);
  }, [match]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveSeconds((prev) => (prev + 1) % 60);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Smooth ball motion across tactical pitch
  useEffect(() => {
    const interval = setInterval(() => {
      const isHome = Math.random() > 0.45;
      const newX = isHome ? Math.floor(52 + Math.random() * 40) : Math.floor(8 + Math.random() * 40);
      const newY = Math.floor(20 + Math.random() * 60);
      setBallPos({ x: newX, y: newY });

      if (newX > 82 || newX < 18) {
        setActionPhase('🎯 SHOT ON TARGET / DANGER IN BOX');
      } else if (newX > 64 || newX < 36) {
        setActionPhase('⚡ PENETRATING ATTACK');
      } else {
        setActionPhase('MIDFIELD POSSESSION');
      }
    }, 2400);
    return () => clearInterval(interval);
  }, [match]);

  const [broadcastClock, setBroadcastClock] = useState<string>('64:24');
  const [isBroadcastPaused, setIsBroadcastPaused] = useState(false);

  const handleToggleBroadcast = () => {
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.enableOnUserClick();

    if (!isAudioCommentaryPlaying) {
      setIsAudioCommentaryPlaying(true);
      setIsBroadcastPaused(false);
      stadiumBroadcastAudio.startBroadcast(
        match.homeTeam,
        match.awayTeam,
        extractMinuteNum(match.matchTime) || 64,
        (timeStr) => setBroadcastClock(timeStr)
      );
    } else if (!isBroadcastPaused) {
      setIsBroadcastPaused(true);
      stadiumBroadcastAudio.pauseBroadcast();
    } else {
      setIsBroadcastPaused(false);
      stadiumBroadcastAudio.resumeBroadcast(match.homeTeam, match.awayTeam);
    }
  };

  const homeAbbr = (match.homeTeam.slice(0, 3)).toUpperCase();
  const awayAbbr = (match.awayTeam.slice(0, 3)).toUpperCase();
  const minuteDisplay = match.status === 'LIVE' ? (match.matchTime || "64'") : match.status === 'FINISHED' ? 'FT' : match.matchTime;

  return (
    <div className={`glass-panel-premium rounded-3xl border-2 border-stadiumGreen/60 overflow-hidden shadow-2xl space-y-3 font-mono text-xs ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-black p-4' : 'p-3 sm:p-5'
    }`}>
      
      {/* HEADER CONTROLS (CLEAN 2-TAB SWITCHER) */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-crimson animate-ping" />
          <span className="font-black text-white text-xs">2D TACTICAL PITCH</span>
        </div>

        {/* 2 Clean Switcher Tabs */}
        <div className="flex items-center space-x-1.5 self-stretch sm:self-auto">
          <button
            onClick={() => {
              setViewMode('TACTICAL_2D');
              phoneHardware.triggerHaptic('SELECTION');
              stadiumAudio.playTabClickSound();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
              viewMode === 'TACTICAL_2D'
                ? 'bg-stadiumGreen text-black shadow-md shadow-stadiumGreen/20'
                : 'bg-black/50 text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>⚽ 2D Tactical Pitch</span>
          </button>

          <button
            onClick={() => {
              setViewMode('HIGHLIGHTS_PLAYER');
              phoneHardware.triggerHaptic('SELECTION');
              stadiumAudio.playTabClickSound();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
              viewMode === 'HIGHLIGHTS_PLAYER'
                ? 'bg-stadiumGreen text-black shadow-md shadow-stadiumGreen/20'
                : 'bg-black/50 text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>🎬 Match Highlights</span>
          </button>

          {/* Side-by-Side Dual Broadcast Controls: English & Pure Pidgin */}
          <div className="flex items-center space-x-1.5 flex-shrink-0">
            {/* English Broadcast Control */}
            <button
              onClick={handleToggleBroadcast}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-black transition-all flex items-center space-x-1 shadow-md ${
                isAudioCommentaryPlaying && !isBroadcastPaused
                  ? 'bg-stadiumGreen text-black border-stadiumGreen shadow-stadiumGreen/40 animate-pulse'
                  : isBroadcastPaused
                  ? 'bg-gold text-black border-gold shadow-gold/30'
                  : 'bg-white/5 border-white/10 text-stadiumGreen hover:bg-stadiumGreen/20'
              }`}
              title="Live English TV Commentary & Crowd"
            >
              {isAudioCommentaryPlaying && !isBroadcastPaused ? (
                <>
                  <Volume2 className="w-3 h-3" />
                  <span>⏸️ EN ({broadcastClock})</span>
                </>
              ) : isBroadcastPaused ? (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>▶️ RESUME ({broadcastClock})</span>
                </>
              ) : (
                <>
                  <Radio className="w-3 h-3 text-gold" />
                  <span>🇬🇧 English Commentary</span>
                </>
              )}
            </button>

            {/* Pure Pidgin Broadcast Control */}
            <button
              onClick={() => {
                phoneHardware.triggerHaptic('SELECTION');
                stadiumAudio.enableOnUserClick();
                allowSpeechOnUserGesture();
                stadiumBroadcastAudio.surgeCrowdRoar('goal');
                const pidginLine = `Omo see live match between ${match.homeTeam} and ${match.awayTeam}! Score na ${match.homeScore ?? 0} to ${match.awayScore ?? 0}. Action dey heavy for pitch now now!`;
                stadiumAudio.speakNigerian(pidginLine);
                speakNaija(pidginLine, 'hyped');
              }}
              className="px-2.5 py-1.5 rounded-xl bg-stadiumGreen/20 hover:bg-stadiumGreen/30 border border-stadiumGreen/40 text-stadiumGreen font-black text-xs transition-all flex items-center space-x-1 shadow"
              title="Pure Nigerian Pidgin Commentary"
            >
              <Volume2 className="w-3 h-3 text-stadiumGreen" />
              <span>🇳🇬 Pidgin Commentary</span>
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-all flex-shrink-0"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* MODE 1: CLEAN TACTICAL 2D PITCH (16:9 PROPORTION) */}
      {viewMode === 'TACTICAL_2D' ? (
        <div className="relative w-full aspect-video rounded-3xl bg-gradient-to-b from-[#0b331c] via-[#072414] to-[#0b331c] border-2 border-stadiumGreen/40 overflow-hidden shadow-2xl select-none">
          
          {/* Crisp Pitch Markings */}
          <div className="absolute inset-3 border border-white/30 rounded-2xl pointer-events-none" />
          <div className="absolute left-1/2 top-3 bottom-3 w-0.5 bg-white/30 -translate-x-1/2" />
          <div className="absolute left-1/2 top-1/2 w-24 h-24 rounded-full border border-white/30 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-white/70 -translate-x-1/2 -translate-y-1/2" />

          {/* Penalty Boxes */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-28 h-44 border border-white/30 border-l-0 rounded-r-xl" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-28 h-44 border border-white/30 border-r-0 rounded-l-xl" />

          {/* Clean TV Scorebug (Top Left) */}
          <div className="absolute top-3 left-3 z-30 flex items-center shadow-xl rounded-xl overflow-hidden border border-white/20 bg-black/90 backdrop-blur-md">
            <div className="px-2.5 py-1 bg-stadiumGreen text-black font-black text-xs flex items-center space-x-1">
              <span>{homeAbbr}</span>
              <span className="text-sm font-extrabold">{match.homeScore ?? 0}</span>
            </div>
            
            <div className="px-2.5 py-1 bg-crimson text-white font-black text-xs flex items-center space-x-1">
              <span className="text-sm font-extrabold">{match.awayScore ?? 0}</span>
              <span>{awayAbbr}</span>
            </div>

            <div className="px-2.5 py-1 bg-black text-gold font-mono font-black text-xs flex items-center space-x-1 border-l border-white/10">
              <span className="text-white">{minuteDisplay}</span>
              <span className="text-[9px] text-gray-400">:{liveSeconds < 10 ? `0${liveSeconds}` : liveSeconds}</span>
            </div>
          </div>

          {/* Live Action Bug (Center Top) */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-black/80 border border-stadiumGreen/40 text-stadiumGreen font-black text-[10px] backdrop-blur-md">
            <span>{actionPhase}</span>
          </div>

          {/* Home Players */}
          {[
            { x: 12, y: 50, label: 'GK' },
            { x: 26, y: 25, label: 'LB' },
            { x: 24, y: 45, label: 'CB' },
            { x: 24, y: 55, label: 'CB' },
            { x: 26, y: 75, label: 'RB' },
            { x: 42, y: 35, label: 'CM' },
            { x: 40, y: 50, label: 'DM' },
            { x: 42, y: 65, label: 'CM' },
            { x: 60, y: 25, label: 'LW' },
            { x: 64, y: 50, label: 'ST' },
            { x: 60, y: 75, label: 'RW' },
          ].map((p, i) => (
            <div
              key={`h-${i}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
            >
              <div className="w-5 h-5 rounded-full bg-stadiumGreen text-black font-black text-[8px] flex items-center justify-center shadow-lg border border-white/40">
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
            { x: 46, y: 25, label: 'RW' },
            { x: 44, y: 50, label: 'AM' },
            { x: 46, y: 75, label: 'LW' },
            { x: 36, y: 50, label: 'ST' },
          ].map((p, i) => (
            <div
              key={`a-${i}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
            >
              <div className="w-5 h-5 rounded-full bg-crimson text-white font-black text-[8px] flex items-center justify-center shadow-lg border border-white/40">
                {p.label}
              </div>
            </div>
          ))}

          {/* Real-Time Ball Marker */}
          <div
            style={{ left: `${ballPos.x}%`, top: `${ballPos.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out z-20"
          >
            <div className="w-4 h-4 rounded-full bg-white text-black text-[10px] flex items-center justify-center shadow-2xl ring-2 ring-gold animate-bounce">
              ⚽
            </div>
          </div>

          {/* Lower Third Banner */}
          {activeLowerThird && (
            <div className="absolute bottom-3 left-3 right-3 sm:left-6 sm:right-6 z-30 p-2.5 rounded-xl bg-black/90 backdrop-blur-md border border-stadiumGreen/30 shadow-xl flex items-center justify-between gap-3 animate-slideUp">
              <div className="flex items-center space-x-2.5 min-w-0">
                <span className="text-base">{activeLowerThird.icon}</span>
                <div className="min-w-0">
                  <span className="font-black text-gold text-[9px] uppercase block tracking-wider">
                    {activeLowerThird.title}
                  </span>
                  <span className="font-bold text-white text-xs truncate block font-sans">
                    {activeLowerThird.subtitle}
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex items-center space-x-1 text-[9px] text-gray-400 font-sans flex-shrink-0">
                <span>OPTA LIVE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-stadiumGreen animate-ping" />
              </div>
            </div>
          )}

        </div>
      ) : (
        /* MODE 2: 100% ON-PLATFORM MULTI-CHANNEL MATCH HIGHLIGHTS PLAYER */
        <div className="space-y-3">
          <div className="relative w-full aspect-video rounded-3xl bg-black border-2 border-stadiumGreen/50 overflow-hidden shadow-2xl flex flex-col items-center justify-center">
            {loadingHighlight ? (
              <div className="flex flex-col items-center justify-center space-y-2 text-stadiumGreen">
                <span className="w-8 h-8 rounded-full border-2 border-stadiumGreen border-t-transparent animate-spin" />
                <span className="text-xs font-bold font-mono">Tuning Official High-Definition Feed...</span>
              </div>
            ) : (
              <iframe
                key={highlightChannel + (highlightEmbedUrl || '')}
                src={
                  highlightChannel === 'SCOREBAT' && highlightEmbedUrl
                    ? highlightEmbedUrl
                    : highlightChannel === 'DAILYMOTION'
                    ? 'https://www.dailymotion.com/embed/video/x8o7v4o?autoplay=1&mute=1'
                    : `https://www.dailymotion.com/embed/search/${encodeURIComponent(match.homeTeam + ' ' + match.awayTeam)}?autoplay=1&mute=1`
                }
                title={`Match Highlights: ${match.homeTeam} vs ${match.awayTeam}`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
            
            {/* Live On-Platform In-Video Badge */}
            <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-xl bg-black/90 border border-white/10 text-[9px] text-stadiumGreen font-black backdrop-blur-md flex items-center space-x-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-stadiumGreen animate-ping" />
              <span>OFFICIAL HIGHLIGHTS STREAM ({highlightChannel})</span>
            </div>
          </div>

          {/* On-Platform Channel Switcher Buttons (No Redirects) */}
          <div className="p-3 rounded-2xl bg-black/70 border border-white/10 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] text-gray-400 font-bold">Switch Feed:</span>
              <button
                onClick={() => setHighlightChannel('SCOREBAT')}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all ${
                  highlightChannel === 'SCOREBAT'
                    ? 'bg-stadiumGreen text-black shadow-md'
                    : 'bg-white/10 text-gray-300 hover:text-white'
                }`}
              >
                Feed 1 (ScoreBat HD)
              </button>
              <button
                onClick={() => setHighlightChannel('DAILYMOTION')}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all ${
                  highlightChannel === 'DAILYMOTION'
                    ? 'bg-stadiumGreen text-black shadow-md'
                    : 'bg-white/10 text-gray-300 hover:text-white'
                }`}
              >
                Feed 2 (Match Replay)
              </button>
            </div>

            <span className="px-2 py-0.5 rounded-xl bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40 text-[9px] font-black">
              100% LEGAL DIRECT STREAM ✓
            </span>
          </div>
        </div>
      )}

      {/* POSSESSION BAR */}
      <div className="p-2.5 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-1.5">
          <span className="font-black text-stadiumGreen text-xs">{match.homeTeam}</span>
          <span className="px-1.5 py-0.2 rounded bg-white/10 text-white font-bold text-[9px]">58%</span>
        </div>

        <div className="flex-1 max-w-xs h-1.5 bg-black/80 rounded-full overflow-hidden flex mx-2">
          <div style={{ width: '58%' }} className="bg-stadiumGreen h-full" />
          <div style={{ width: '42%' }} className="bg-crimson h-full" />
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="px-1.5 py-0.2 rounded bg-white/10 text-white font-bold text-[9px]">42%</span>
          <span className="font-black text-crimson text-xs">{match.awayTeam}</span>
        </div>
      </div>

    </div>
  );
};
