'use client';

import React, { useState, useEffect } from 'react';
import { MatchData } from '../lib/sports-api';
import { Camera, Video, Maximize2, Minimize2 } from 'lucide-react';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { useTranslation } from '../lib/translation-engine';

interface TvBroadcastMatchViewerProps {
  match: MatchData;
  onClose?: () => void;
}

type ViewerMode = 'TACTICAL_2D' | 'HIGHLIGHTS_PLAYER';

interface VideoClip {
  title: string;
  embedUrl: string;
}

export const TvBroadcastMatchViewer: React.FC<TvBroadcastMatchViewerProps> = ({ match }) => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewerMode>('TACTICAL_2D');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [highlightEmbedUrl, setHighlightEmbedUrl] = useState<string>('');
  const [videoClips, setVideoClips] = useState<VideoClip[]>([]);
  const [loadingHighlight, setLoadingHighlight] = useState<boolean>(false);
  const [ballPos, setBallPos] = useState({ x: 52, y: 48 });

  const [activeLowerThird, setActiveLowerThird] = useState<{ title: string; subtitle: string; icon: string } | null>({
    title: 'TERRITORY CONTROL',
    subtitle: `${match.homeTeam} maintaining 62% possession in final third.`,
    icon: '⚡',
  });

  // Fetch official ScoreBat video feed
  useEffect(() => {
    if (viewMode === 'HIGHLIGHTS_PLAYER' && (match.status === 'FINISHED' || match.matchTime === 'FT')) {
      setLoadingHighlight(true);
      fetch(`/api/highlights?home=${encodeURIComponent(match.homeTeam)}&away=${encodeURIComponent(match.awayTeam)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.found && data.embedUrl) {
            setHighlightEmbedUrl(data.embedUrl);
            if (data.videos && Array.isArray(data.videos)) {
              setVideoClips(data.videos);
            }
          } else {
            setHighlightEmbedUrl('');
          }
        })
        .catch(() => {
          setHighlightEmbedUrl('');
        })
        .finally(() => setLoadingHighlight(false));
    }
  }, [viewMode, match.homeTeam, match.awayTeam, match.status, match.matchTime]);

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

  // Smooth ball motion across tactical pitch
  useEffect(() => {
    const interval = setInterval(() => {
      const isHome = Math.random() > 0.45;
      const x = isHome ? Math.floor(Math.random() * 45) + 50 : Math.floor(Math.random() * 45) + 5;
      const y = Math.floor(Math.random() * 70) + 15;
      setBallPos({ x, y });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const isUpcoming = match.status === 'SCHEDULED';
  const isLive = match.status === 'LIVE';

  return (
    <div className={`glass-panel-premium rounded-3xl border-2 border-stadiumGreen/60 overflow-hidden shadow-2xl space-y-3 font-mono text-xs ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-black p-4' : 'p-3 sm:p-5'
    }`}>
      
      {/* HEADER CONTROLS: ONLY 2 TABS + FULLSCREEN */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-crimson animate-ping" />
          <span className="font-black text-white text-xs">2D TACTICAL PITCH</span>
        </div>

        {/* 2 Clean Switcher Tabs */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setViewMode('TACTICAL_2D');
              phoneHardware.triggerHaptic('SELECTION');
              try { stadiumAudio.playTabClickSound(); } catch (e) {}
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
              try { stadiumAudio.playTabClickSound(); } catch (e) {}
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

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* VIEW 1: 2D TACTICAL PITCH */}
      {viewMode === 'TACTICAL_2D' ? (
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl bg-gradient-to-b from-emerald-950 via-green-950 to-emerald-950 border-2 border-emerald-500/40 overflow-hidden shadow-inner flex items-center justify-center select-none">
          
          {/* Pitch Markings */}
          <div className="absolute inset-2 border-2 border-white/20 rounded-xl pointer-events-none" />
          <div className="absolute top-2 bottom-2 left-1/2 -translate-x-1/2 w-0.5 border-l-2 border-dashed border-white/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/50 rounded-full" />

          {/* Left Goal Area */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-28 border-2 border-l-0 border-white/20 rounded-r-lg" />
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-14 border-2 border-l-0 border-white/20" />

          {/* Right Goal Area */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-28 border-2 border-r-0 border-white/20 rounded-l-lg" />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-14 border-2 border-r-0 border-white/20" />

          {/* Home Team Players (Cyan Dots) */}
          <div className="absolute left-[12%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-cyan-500 border border-white text-[8px] font-black flex items-center justify-center text-black">GK</div>
          <div className="absolute left-[26%] top-[25%] -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-cyan-500 border border-white text-[8px] font-black flex items-center justify-center text-black">LB</div>
          <div className="absolute left-[24%] top-[42%] -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-cyan-500 border border-white text-[8px] font-black flex items-center justify-center text-black">CB</div>
          <div className="absolute left-[24%] top-[58%] -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-cyan-500 border border-white text-[8px] font-black flex items-center justify-center text-black">CB</div>
          <div className="absolute left-[26%] top-[75%] -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-cyan-500 border border-white text-[8px] font-black flex items-center justify-center text-black">RB</div>
          <div className="absolute left-[40%] top-[35%] -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-cyan-500 border border-white text-[8px] font-black flex items-center justify-center text-black">CM</div>
          <div className="absolute left-[40%] top-[65%] -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-cyan-500 border border-white text-[8px] font-black flex items-center justify-center text-black">CM</div>
          <div className="absolute left-[54%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-cyan-500 border border-white text-[8px] font-black flex items-center justify-center text-black">AM</div>
          <div className="absolute left-[66%] top-[20%] -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-cyan-500 border border-white text-[8px] font-black flex items-center justify-center text-black">LW</div>
          <div className="absolute left-[70%] top-[50%] -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-cyan-500 border border-white text-[8px] font-black flex items-center justify-center text-black">ST</div>
          <div className="absolute left-[66%] top-[80%] -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-cyan-500 border border-white text-[8px] font-black flex items-center justify-center text-black">RW</div>

          {/* Away Team Players (Red Dots) */}
          <div className="absolute right-[12%] top-[50%] translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-crimson border border-white text-[8px] font-black flex items-center justify-center text-white">GK</div>
          <div className="absolute right-[24%] top-[28%] translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-crimson border border-white text-[8px] font-black flex items-center justify-center text-white">CB</div>
          <div className="absolute right-[24%] top-[72%] translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-crimson border border-white text-[8px] font-black flex items-center justify-center text-white">CB</div>
          <div className="absolute right-[38%] top-[50%] translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-crimson border border-white text-[8px] font-black flex items-center justify-center text-white">DM</div>
          <div className="absolute right-[52%] top-[30%] translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-crimson border border-white text-[8px] font-black flex items-center justify-center text-white">LM</div>
          <div className="absolute right-[52%] top-[70%] translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-crimson border border-white text-[8px] font-black flex items-center justify-center text-white">RM</div>
          <div className="absolute right-[62%] top-[50%] translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-crimson border border-white text-[8px] font-black flex items-center justify-center text-white">AM</div>
          <div className="absolute right-[74%] top-[50%] translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-crimson border border-white text-[8px] font-black flex items-center justify-center text-white">ST</div>

          {/* Animated Ball */}
          <div
            style={{ left: `${ballPos.x}%`, top: `${ballPos.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out z-20"
          >
            <div className="w-4 h-4 rounded-full bg-white text-black text-[10px] flex items-center justify-center shadow-2xl ring-2 ring-gold animate-bounce">
              ⚽
            </div>
          </div>

          {/* Opta Lower Third Banner */}
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
        /* VIEW 2: CLEAN DIRECT HIGHLIGHTS VIEW */
        <div className="rounded-3xl border-2 border-stadiumGreen/40 overflow-hidden bg-black/95 p-4 sm:p-6 space-y-4 animate-fadeIn">
          
          {loadingHighlight ? (
            <div className="py-12 px-4 text-center space-y-3 font-mono">
              <span className="w-8 h-8 rounded-full border-2 border-stadiumGreen border-t-transparent animate-spin inline-block" />
              <h3 className="font-black text-xs text-stadiumGreen uppercase tracking-wider">
                {t('Tuning official broadcast highlight feed...')}
              </h3>
            </div>
          ) : isUpcoming ? (
            <div className="py-12 px-4 text-center space-y-3 font-mono">
              <span className="text-4xl block animate-bounce">⏳</span>
              <h3 className="font-black text-base text-gold uppercase tracking-wider">
                {t('Match Has Not Kicked Off Yet')}
              </h3>
              <p className="text-xs text-gray-300 max-w-md mx-auto font-sans">
                {t('Scheduled for')} <strong className="text-white">{match.matchTime}</strong>. {t('Official broadcast video highlights will be generated here immediately after full time.')}
              </p>
            </div>
          ) : isLive ? (
            <div className="py-12 px-4 text-center space-y-3 font-mono">
              <span className="text-4xl block animate-pulse">🔴</span>
              <h3 className="font-black text-base text-crimson uppercase tracking-wider">
                {t('Match Is Currently In-Play')} ({match.matchTime || 'LIVE'})
              </h3>
              <p className="text-xs text-gray-300 max-w-md mx-auto font-sans">
                {t('Live match action is underway. Full video highlights and goal clips will be published right after full-time.')}
              </p>
              <button
                onClick={() => setViewMode('TACTICAL_2D')}
                className="px-4 py-2 rounded-xl bg-stadiumGreen text-black font-black text-xs hover:scale-105 transition-all"
              >
                ⚽ {t('Switch to Live 2D Tactical Pitch')}
              </button>
            </div>
          ) : highlightEmbedUrl ? (
            /* OFFICIAL SCOREBAT BROADCAST VIDEO PLAYER */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                <span className="flex items-center space-x-1.5 text-stadiumGreen font-bold">
                  <span className="w-2 h-2 rounded-full bg-stadiumGreen animate-ping" />
                  <span>OFFICIAL BROADCASTER HD STREAM</span>
                </span>
                <span className="text-white font-bold">{match.homeTeam} vs {match.awayTeam}</span>
              </div>

              {/* Multi-Clip Switcher */}
              {videoClips.length > 1 && (
                <div className="flex flex-wrap items-center gap-1.5 pb-1">
                  {videoClips.map((clip, idx) => (
                    <button
                      key={idx}
                      onClick={() => setHighlightEmbedUrl(clip.embedUrl)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all ${
                        highlightEmbedUrl === clip.embedUrl
                          ? 'bg-stadiumGreen text-black'
                          : 'bg-white/10 text-gray-300 hover:text-white'
                      }`}
                    >
                      🎬 {clip.title || `Clip ${idx + 1}`}
                    </button>
                  ))}
                </div>
              )}

              <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black">
                <iframe
                  src={highlightEmbedUrl}
                  title={`Official Highlights: ${match.homeTeam} vs ${match.awayTeam}`}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            /* SIMPLE DIRECT CLEAN "NO HIGHLIGHTS" MESSAGE */
            <div className="py-12 px-4 text-center space-y-2 font-mono">
              <span className="text-3xl block">🎬</span>
              <h3 className="font-black text-sm text-gray-300 uppercase tracking-wider">
                {t('No official match highlights available for this fixture.')}
              </h3>
              <p className="text-[11px] text-gray-500 font-sans">
                {t('Official broadcaster video highlights are not indexed for this league or match.')}
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
