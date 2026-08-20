'use client';

import React, { useState, useRef } from 'react';
import { Share2, Download, Sparkles, Check, X, ShieldCheck, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { stadiumAudio } from '../lib/sound-synthesizer';

interface SocialFlexSlipProps {
  matchTitle: string;
  pickSelection: string;
  odds: number;
  winRate: number;
  onClose: () => void;
}

export const CloutCardGenerator: React.FC<SocialFlexSlipProps> = ({
  matchTitle,
  pickSelection,
  odds,
  winRate,
  onClose,
}) => {
  const [digitalHandle, setDigitalHandle] = useState('CyberStriker_99');
  const [avatarIcon, setAvatarIcon] = useState('⚡');
  const [customStake, setCustomStake] = useState(50);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const potentialWin = (customStake * odds).toFixed(2);

  const handleShare = (platform: 'WHATSAPP' | 'TWITTER' | 'TELEGRAM') => {
    stadiumAudio.playCrowdRoar();
    const text = encodeURIComponent(
      `🔥 Locked in my Banker Pick on AuraScore Stadium 2.0!\n\n⚽ Fixture: ${matchTitle}\n💎 System Pick: ${pickSelection} @ ${odds}\n👑 Winning Confidence: ${winRate}%\n⚡ Predicted by: @${digitalHandle}\n\nJoin the live stadium experience: http://localhost:3000`
    );
    const url = encodeURIComponent('http://localhost:3000');

    if (platform === 'WHATSAPP') window.open(`https://api.whatsapp.com/send?text=${text}`);
    if (platform === 'TWITTER') window.open(`https://twitter.com/intent/tweet?text=${text}`);
    if (platform === 'TELEGRAM') window.open(`https://t.me/share/url?url=${url}&text=${text}`);

    if (typeof window !== 'undefined') {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleCopySlipCode = () => {
    navigator.clipboard.writeText(`AS-FLEX-${Math.floor(100000 + Math.random() * 900000)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-panel-premium rounded-3xl p-6 border border-stadiumGreen/50 shadow-2xl space-y-5 font-mono text-xs max-w-md mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-stadiumGreen text-black font-black">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-black text-sm text-white">SOCIAL FLEX SLIP GENERATOR 📲</h3>
            <span className="text-[10px] text-gray-400 font-sans">Share your verified winning ticket with your squad</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Customizable Digital Gamer Avatar & Handle */}
      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-black/60 border border-white/10">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {['⚡', '👑', '🔥', '💎', '🦁'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => setAvatarIcon(emoji)}
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm transition-all ${
                  avatarIcon === emoji ? 'bg-stadiumGreen text-black scale-110' : 'bg-panel hover:bg-white/10'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-1 text-white font-bold">
          <span className="text-gray-500">@</span>
          <input
            type="text"
            value={digitalHandle}
            onChange={(e) => setDigitalHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
            placeholder="DigitalHandle"
            className="w-28 px-2 py-1 rounded-lg bg-black border border-white/10 text-stadiumGreen font-mono text-xs focus:outline-none focus:border-stadiumGreen"
          />
        </div>
      </div>

      {/* The Visual Ticket Slip */}
      <div
        ref={cardRef}
        className="p-5 rounded-3xl bg-gradient-to-br from-black via-emerald-950/60 to-black border-2 border-stadiumGreen/60 space-y-4 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-stadiumGreen/20 rounded-full blur-2xl -z-10"></div>

        {/* Ticket Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center space-x-2">
            <span className="text-base">{avatarIcon}</span>
            <span className="font-extrabold text-white text-xs">@{digitalHandle}</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-stadiumGreen/20 text-stadiumGreen text-[9px] font-black border border-stadiumGreen/30">
            VERIFIED SLIP ✓
          </span>
        </div>

        {/* Match & Pick */}
        <div className="space-y-1 text-center py-1">
          <span className="text-[10px] text-gray-400 font-sans block">{matchTitle}</span>
          <span className="text-base font-black text-white block">{pickSelection}</span>
          <div className="inline-flex items-center space-x-2 pt-1">
            <span className="px-2.5 py-0.5 rounded-full bg-gold/20 text-gold font-bold text-xs">
              @ {odds} Odds
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen font-bold text-xs">
              {winRate}% Model Win
            </span>
          </div>
        </div>

        {/* Payout Calculation */}
        <div className="p-3 rounded-2xl bg-black/70 border border-white/10 flex items-center justify-between text-xs">
          <div>
            <span className="text-[9px] text-gray-400 block font-sans">STAKE</span>
            <span className="font-black text-white">${customStake}</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-stadiumGreen block font-sans">POTENTIAL WIN</span>
            <span className="font-black text-stadiumGreen text-sm">${potentialWin}</span>
          </div>
        </div>

        {/* Watermark Footer */}
        <div className="text-center text-[9px] text-gray-500 pt-1 border-t border-white/5">
          AURASCORE STADIUM 2.0 • 100% PROBABILITY LEDGER
        </div>
      </div>

      {/* Auto Share Buttons */}
      <div className="space-y-2">
        <span className="text-[10px] text-gray-400 font-bold block">1-CLICK AUTO SHARE TO SQUAD:</span>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleShare('WHATSAPP')}
            className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all flex items-center justify-center space-x-1"
          >
            <span>WhatsApp</span>
          </button>
          <button
            onClick={() => handleShare('TWITTER')}
            className="py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-black text-xs transition-all flex items-center justify-center space-x-1"
          >
            <span>Twitter / X</span>
          </button>
          <button
            onClick={() => handleShare('TELEGRAM')}
            className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-all flex items-center justify-center space-x-1"
          >
            <span>Telegram</span>
          </button>
        </div>

        <button
          onClick={handleCopySlipCode}
          className="w-full py-2 rounded-xl bg-panel hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center justify-center space-x-1"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-stadiumGreen" /> : <Sparkles className="w-3.5 h-3.5 text-gold" />}
          <span>{copied ? 'Booking Code Copied!' : 'Copy Shareable Slip Code'}</span>
        </button>
      </div>

    </div>
  );
};
