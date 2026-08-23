'use client';
import React, { useState } from 'react';
import { X, Mic, Play, Pause, Share2, Volume2, Sparkles, Check } from 'lucide-react';
import { stadiumAudio } from '../../lib/sound-synthesizer';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { speakNaija } from '../../lib/naija-voice-engine';
import confetti from 'canvas-confetti';

export const ViralVoiceGistModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState('Arsenal vs Chelsea');
  const [copied, setCopied] = useState(false);

  const gistScript = `Chai! Arsenal and Chelsea fans, make una hold una chest today o! Pitch go hot well well. Our sure banker na Over 1.5 Goals with correct odds. Share this audio give your boys!`;

  const handlePlayVoice = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.enableOnUserClick();
    stadiumAudio.playGoalCelebration();
    setIsPlaying(true);
    speakNaija(gistScript, 'hyped');
    setTimeout(() => setIsPlaying(false), 8000);
  };

  const handleShare = () => {
    phoneHardware.triggerHaptic('SELECTION');
    const text = `🎙️ Listen to AuraScore 15-Sec Voice Gist on ${selectedMatch}:\n"${gistScript}"\n⚡ Listen live: https://sports-teal-psi.vercel.app/`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn font-mono text-xs text-white">
      <div className="relative w-full max-w-md glass-panel-premium rounded-3xl border-2 border-stadiumGreen/70 p-6 space-y-4 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20"><X className="w-4 h-4" /></button>
        <div className="flex items-center space-x-2">
          <Mic className="w-5 h-5 text-stadiumGreen animate-pulse" />
          <h3 className="font-black text-sm text-stadiumGreen uppercase">15-Sec WhatsApp Voice Gist</h3>
        </div>
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3 text-center">
          <span className="text-[10px] text-gold font-bold">🎙️ Male Nigerian TV Anchor Voice</span>
          <p className="text-xs text-gray-200 italic font-sans">"{gistScript}"</p>
          <button onClick={handlePlayVoice} className="w-full py-3 rounded-2xl bg-stadiumGreen text-black font-black flex items-center justify-center space-x-2 shadow-lg hover:bg-emerald-400">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Playing Voice Gist...' : '▶️ Play 15-Sec Voice Note'}</span>
          </button>
        </div>
        <button onClick={handleShare} className="w-full py-3 rounded-2xl bg-[#25D366]/20 border border-[#25D366] text-[#25D366] font-black flex items-center justify-center space-x-2 shadow hover:bg-[#25D366]/30">
          <Share2 className="w-4 h-4" />
          <span>Share Voice Note on WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
