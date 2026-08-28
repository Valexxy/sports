'use client';

import React, { useState, useEffect } from 'react';
import { 
  Volume2, VolumeX, Radio, Flame, X, Play, Pause, SkipForward, SkipBack, 
  RefreshCw, Trophy, Shield, Clock, Sparkles, CheckCircle2, Zap, Pin, Smartphone
} from 'lucide-react';
import { MatchData } from '../lib/sports-api';
import { speakNaija, stopNaijaAudio } from '../lib/naija-voice-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { LockScreenMatchTracker } from '../lib/lockscreen-live-score-tracker';
import confetti from 'canvas-confetti';

interface StadiumCommentaryModalProps {
  match: MatchData;
  onClose: () => void;
}

interface CommentaryPlay {
  id: string;
  minute: string;
  type: 'GOAL' | 'CARD' | 'SHOT' | 'SAVE' | 'SUB' | 'CORNER' | 'FOUL' | 'KICKOFF' | 'WHISTLE';
  team: string;
  detail: string;
  pidginCommentary: string;
  englishCommentary: string;
  tacticalCommentary: string;
}

export const LiveStadiumCommentaryModal: React.FC<StadiumCommentaryModalProps> = ({
  match,
  onClose,
}) => {
  const [voiceLang, setVoiceLang] = useState<'en-NG' | 'en-US'>('en-NG');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [commentaryList, setCommentaryList] = useState<CommentaryPlay[]>([]);
  const [venue, setVenue] = useState('Stadium Arena');
  const [pinnedToLockScreen, setPinnedToLockScreen] = useState(false);

  const fetchLiveCommentary = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stadium/commentary?eventId=${match.id}&league=${encodeURIComponent(match.league || 'eng.1')}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.commentary) {
          setCommentaryList(data.commentary);
          if (data.match?.venue) setVenue(data.match.venue);
        }
      }
    } catch {
      /* noop */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveCommentary();
  }, [match.id]);

  const handlePlayVoice = (index: number) => {
    if (!commentaryList[index]) return;
    const item = commentaryList[index];
    const isGoal = item.type === 'GOAL';
    const spokenText = voiceLang === 'en-NG' ? item.pidginCommentary : item.englishCommentary;

    setCurrentPlayIndex(index);
    try { phoneHardware.triggerHaptic(isGoal ? 'GOAL' : 'SELECTION'); } catch {}
    if (isGoal) {
      try { stadiumAudio.playGoalCelebration(); } catch {}
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } else {
      try { stadiumAudio.playCrowdRoar(); } catch {}
    }

    setIsPlayingAudio(true);
    speakNaija(spokenText, isGoal ? 'goal' : 'hyped', {
      lang: voiceLang,
      onEnd: () => {
        setIsPlayingAudio(false);
        // Auto-advance to next event if available
        if (index + 1 < commentaryList.length) {
          setTimeout(() => handlePlayVoice(index + 1), 1200);
        }
      },
    });

    // Sync with Lock Screen media controls
    LockScreenMatchTracker.pinMatchToLockScreen(match, spokenText);
  };

  const handlePauseAudio = () => {
    stopNaijaAudio();
    setIsPlayingAudio(false);
  };

  const handleNextPlay = () => {
    if (currentPlayIndex + 1 < commentaryList.length) {
      handlePlayVoice(currentPlayIndex + 1);
    }
  };

  const handlePrevPlay = () => {
    if (currentPlayIndex > 0) {
      handlePlayVoice(currentPlayIndex - 1);
    }
  };

  const handlePinLockScreen = async () => {
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
    const activeText = commentaryList[currentPlayIndex] 
      ? (voiceLang === 'en-NG' ? commentaryList[currentPlayIndex].pidginCommentary : commentaryList[currentPlayIndex].englishCommentary)
      : undefined;

    const ok = await LockScreenMatchTracker.pinMatchToLockScreen(match, activeText);
    if (ok) {
      setPinnedToLockScreen(true);
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
      setTimeout(() => setPinnedToLockScreen(false), 3000);
    }
  };

  const currentPlay = commentaryList[currentPlayIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl overflow-y-auto animate-fadeIn flex flex-col p-3 sm:p-6 font-mono text-white">
      <div className="max-w-3xl mx-auto w-full glass-panel-premium rounded-3xl p-5 sm:p-7 border border-stadiumGreen/40 space-y-5 my-auto shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={() => {
            handlePauseAudio();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. STADIUM TOP SCOREBOARD BANNER */}
        <div className="space-y-3 border-b border-white/10 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40 font-black animate-pulse">
                <Radio className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] font-black text-stadiumGreen uppercase tracking-widest block">STADIUM LIVE AUDIO CENTER</span>
                <span className="text-xs text-gray-400 font-sans">{venue} &bull; {match.league}</span>
              </div>
            </div>

            {/* Lock Screen Pin Button */}
            <button
              onClick={handlePinLockScreen}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all flex items-center space-x-1.5 border mr-8 sm:mr-10 ${
                pinnedToLockScreen
                  ? 'bg-stadiumGreen text-black border-stadiumGreen shadow-md'
                  : 'bg-black/60 text-gold border-gold/30 hover:bg-gold/20'
              }`}
              title="Pin Live Score to Phone Lock Screen"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{pinnedToLockScreen ? 'Pinned to Lock Screen ✓' : 'Pin to Lock Screen 📌'}</span>
            </button>
          </div>

          {/* Teams Scoreline */}
          <div className="flex items-center justify-between bg-black/70 p-4 rounded-2xl border border-white/10 text-center">
            <div className="flex-1 space-y-0.5">
              <h3 className="font-black text-sm sm:text-base text-white truncate">{match.homeTeam}</h3>
              <span className="text-[9px] text-gray-400 font-bold block">HOME</span>
            </div>

            <div className="px-4 py-1.5 rounded-2xl bg-stadiumGreen/20 border border-stadiumGreen/50 font-black text-lg sm:text-2xl text-stadiumGreen font-mono">
              {match.homeScore ?? 0} - {match.awayScore ?? 0}
            </div>

            <div className="flex-1 space-y-0.5">
              <h3 className="font-black text-sm sm:text-base text-white truncate">{match.awayTeam}</h3>
              <span className="text-[9px] text-gray-400 font-bold block">AWAY</span>
            </div>
          </div>
        </div>

        {/* 2. MP3 AUDIO PLAYER DECK */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-panel via-black to-stadiumGreen/10 border border-stadiumGreen/40 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 min-w-0">
              <Volume2 className="w-4 h-4 text-stadiumGreen flex-shrink-0" />
              <span className="font-black text-white text-xs truncate">
                {currentPlay ? `[${currentPlay.minute}] ${currentPlay.team}` : 'Live Stadium Commentary'}
              </span>
            </div>

            {/* Language Switch */}
            <div className="flex items-center space-x-1.5 flex-shrink-0">
              <button
                onClick={() => setVoiceLang('en-NG')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                  voiceLang === 'en-NG' ? 'bg-stadiumGreen text-black border-stadiumGreen' : 'bg-black/60 text-gray-400 border-white/10'
                }`}
              >
                🇳🇬 Pidgin
              </button>
              <button
                onClick={() => setVoiceLang('en-US')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                  voiceLang === 'en-US' ? 'bg-stadiumGreen text-black border-stadiumGreen' : 'bg-black/60 text-gray-400 border-white/10'
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          {/* Current Spoken Text */}
          <div className="p-3 rounded-xl bg-black/60 border border-white/10 min-h-[50px] flex items-center">
            <p className="text-xs font-bold text-stadiumGreen font-sans leading-relaxed">
              {currentPlay 
                ? (voiceLang === 'en-NG' ? currentPlay.pidginCommentary : currentPlay.englishCommentary)
                : 'Tap play to start live match audio stream.'}
            </p>
          </div>

          {/* MP3 Player Controls */}
          <div className="flex items-center justify-center space-x-4 pt-1">
            <button
              onClick={handlePrevPlay}
              disabled={currentPlayIndex <= 0}
              className="p-2 rounded-xl bg-panel border border-white/10 text-gray-300 hover:text-white disabled:opacity-40"
              title="Previous Event"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {isPlayingAudio ? (
              <button
                onClick={handlePauseAudio}
                className="p-3 rounded-2xl bg-crimson text-white font-black hover:scale-105 transition-all shadow-lg"
                title="Pause Commentary"
              >
                <Pause className="w-5 h-5 fill-current" />
              </button>
            ) : (
              <button
                onClick={() => handlePlayVoice(currentPlayIndex)}
                className="p-3 rounded-2xl bg-stadiumGreen text-black font-black hover:scale-105 transition-all shadow-lg shadow-stadiumGreen/30"
                title="Play Commentary"
              >
                <Play className="w-5 h-5 fill-current" />
              </button>
            )}

            <button
              onClick={handleNextPlay}
              disabled={currentPlayIndex >= commentaryList.length - 1}
              className="p-2 rounded-xl bg-panel border border-white/10 text-gray-300 hover:text-white disabled:opacity-40"
              title="Next Event"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3. TIMELINE EVENT LIST */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-white flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-stadiumGreen" />
              <span>TIMELINE EVENTS ({commentaryList.length})</span>
            </span>
            <button
              onClick={fetchLiveCommentary}
              className="p-1 rounded-lg text-gray-400 hover:text-white"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-stadiumGreen' : ''}`} />
            </button>
          </div>

          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 scrollbar-none">
            {commentaryList.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => handlePlayVoice(idx)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  idx === currentPlayIndex
                    ? 'bg-stadiumGreen/20 border-stadiumGreen ring-1 ring-stadiumGreen/40'
                    : 'bg-black/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-black text-stadiumGreen text-[10px]">[{item.minute}]</span>
                    <span className="font-bold text-white text-xs truncate">{item.team}</span>
                  </div>
                  <p className="text-[11px] text-gray-300 font-sans truncate">{item.detail}</p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayVoice(idx);
                  }}
                  className="p-2 rounded-xl bg-stadiumGreen/20 hover:bg-stadiumGreen text-stadiumGreen hover:text-black transition-all flex-shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
