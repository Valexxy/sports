'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioStore } from '../../lib/audio-store';
import { Play, Pause, Volume2, Maximize2, Minimize2, Radio, Sparkles, X, ChevronUp, ChevronDown } from 'lucide-react';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumBroadcastAudio } from '../../lib/stadium-broadcast-audio-engine';

export const PersistentDynamicIslandPlayer: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    activeLanguage, 
    currentTimeStr, 
    isExpanded,
    togglePlay, 
    switchLanguage, 
    setExpanded 
  } = useAudioStore();

  if (!currentTrack) return null;

  const handleToggle = () => {
    phoneHardware.triggerHaptic('SELECTION');
    togglePlay();
    if (isPlaying) {
      stadiumBroadcastAudio.pauseBroadcast();
    } else {
      stadiumBroadcastAudio.resumeBroadcast(currentTrack.homeTeam, currentTrack.awayTeam);
    }
  };

  const handleLangChange = (lang: 'WARRI' | 'ENGLISH') => {
    phoneHardware.triggerHaptic('SUCCESS');
    switchLanguage(lang);
    stadiumBroadcastAudio.switchLanguage(lang === 'WARRI' ? 'PIDGIN' : 'ENGLISH');
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-auto font-mono">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          /* COMPACT DYNAMIC ISLAND PILL */
          <motion.div
            key="island-pill"
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="flex items-center space-x-3 px-4 py-2 rounded-full bg-black/95 border-2 border-stadiumGreen shadow-2xl shadow-stadiumGreen/20 backdrop-blur-xl text-white select-none cursor-pointer"
            onClick={() => setExpanded(true)}
          >
            {/* Animated Equalizer Bars */}
            <div className="flex items-end space-x-0.5 h-4 w-4">
              <span className={`w-1 bg-stadiumGreen rounded-full ${isPlaying ? 'animate-bounce' : 'h-1.5'}`} style={{ animationDuration: '400ms' }} />
              <span className={`w-1 bg-stadiumGreen rounded-full ${isPlaying ? 'animate-bounce' : 'h-3'}`} style={{ animationDuration: '600ms' }} />
              <span className={`w-1 bg-stadiumGreen rounded-full ${isPlaying ? 'animate-bounce' : 'h-2'}`} style={{ animationDuration: '500ms' }} />
            </div>

            {/* Score & Match */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-black text-white">{currentTrack.homeTeam.slice(0, 3).toUpperCase()}</span>
              <span className="px-1.5 py-0.2 rounded bg-stadiumGreen/20 text-stadiumGreen font-black text-[11px] border border-stadiumGreen/40">
                {currentTrack.homeScore ?? 0} - {currentTrack.awayScore ?? 0}
              </span>
              <span className="font-black text-white">{currentTrack.awayTeam.slice(0, 3).toUpperCase()}</span>
              <span className="text-gray-400 text-[10px]">• {currentTimeStr}</span>
            </div>

            {/* Channel Badge */}
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-white/10 text-gold border border-gold/30">
              {activeLanguage === 'WARRI' ? '🇳🇬 Warri Voice' : '🇬🇧 UK Voice'}
            </span>

            {/* Play/Pause Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
              className="p-1.5 rounded-full bg-stadiumGreen text-black hover:bg-emerald-400 transition-transform active:scale-90"
            >
              {isPlaying ? <Pause className="w-3 h-3 fill-black" /> : <Play className="w-3 h-3 fill-black ml-0.5" />}
            </button>
          </motion.div>
        ) : (
          /* EXPANDED TACTICAL HUD DOCK */
          <motion.div
            key="island-expanded"
            initial={{ scale: 0.92, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="w-[94vw] max-w-lg p-4 rounded-3xl bg-[#070c18]/98 border-2 border-stadiumGreen shadow-2xl shadow-black backdrop-blur-2xl text-white space-y-3"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-crimson animate-pulse" />
                <span className="text-xs font-black text-white uppercase">{currentTrack.league || 'LIVE MATCHDAY RADIO'}</span>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="p-1 rounded-xl bg-white/10 text-gray-400 hover:text-white"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>

            {/* Scoreboard Row */}
            <div className="flex items-center justify-between py-1">
              <div className="text-left flex-1">
                <span className="text-sm font-black text-white block truncate">{currentTrack.homeTeam}</span>
                <span className="text-[10px] text-gray-400">Home</span>
              </div>

              <div className="px-4 py-1.5 rounded-2xl bg-black border-2 border-stadiumGreen text-gold font-mono font-black text-xl shadow-inner">
                {currentTrack.homeScore ?? 0} - {currentTrack.awayScore ?? 0}
              </div>

              <div className="text-right flex-1">
                <span className="text-sm font-black text-white block truncate">{currentTrack.awayTeam}</span>
                <span className="text-[10px] text-gray-400">Away</span>
              </div>
            </div>

            {/* Commentary Controls & Language Toggles */}
            <div className="flex items-center justify-between pt-1 border-t border-white/10 gap-2">
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleLangChange('WARRI')}
                  className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black transition-all flex items-center space-x-1 ${
                    activeLanguage === 'WARRI'
                      ? 'bg-stadiumGreen text-black shadow-md'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span>🎙️</span>
                  <span>Female Warri</span>
                </button>
                <button
                  onClick={() => handleLangChange('ENGLISH')}
                  className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black transition-all flex items-center space-x-1 ${
                    activeLanguage === 'ENGLISH'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span>🇬🇧</span>
                  <span>English</span>
                </button>
              </div>

              <button
                onClick={handleToggle}
                className="px-4 py-1.5 rounded-xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-xs flex items-center space-x-1.5 shadow-md active:scale-95"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black" />}
                <span>{isPlaying ? 'Pause' : 'Resume'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
