'use client';

import React, { useState } from 'react';
import { MatchData } from '../lib/sports-api';
import { X, Share2, Trophy, CheckCircle2, Copy, Check, MessageCircle, Twitter, Sparkles, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { stadiumAudio } from '../lib/sound-synthesizer';

interface ReceiptModalProps {
  match: MatchData | null;
  onClose: () => void;
}

const GENZ_SLOGANS = [
  '🍗 Full Time We Feast',
  '🚫 Cut 1 No Dey This Slip',
  '👑 Banker of the Century',
  '🔥 100% Cashout Energy',
  '⚡ Pure Juju Prediction',
];

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ match, onClose }) => {
  const [selectedSlogan, setSelectedSlogan] = useState(GENZ_SLOGANS[0]);
  const [copied, setCopied] = useState(false);

  if (!match) return null;

  const p = match.prediction;
  const shareMsg = '🔥 GEN-Z MATCH SLIP: ' + match.homeTeam + ' vs ' + match.awayTeam +
    '\n\n🎯 Pick: ' + p.topPick.selection + ' @ ' + p.topPick.odds + ' (' + p.topPick.probability + '% confidence)' +
    '\n💬 ' + selectedSlogan +
    '\n\n⚡ Staked by @CyberStriker_99 on AuraScore Stadium\n' +
    (typeof window !== 'undefined' ? window.location.origin : 'https://aurascore.app');

  const shareUrl = encodeURIComponent(shareMsg);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareMsg);
    setCopied(true);
    stadiumAudio.playSuccessSound();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn font-mono text-xs">
      <div className="relative w-full max-w-md glass-panel-premium rounded-3xl border-2 border-stadiumGreen/50 p-5 shadow-2xl space-y-4">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-2">
          <Flame className="w-4 h-4 text-stadiumGreen animate-pulse" />
          <span className="font-black text-white text-xs uppercase tracking-wider">GEN-Z VIRAL FLEX SLIP 🔥</span>
        </div>

        {/* Slogan Picker */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {GENZ_SLOGANS.map((slogan, i) => (
            <button
              key={i}
              onClick={() => setSelectedSlogan(slogan)}
              className={'flex-shrink-0 px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all ' +
                (selectedSlogan === slogan
                  ? 'bg-stadiumGreen text-black border-stadiumGreen font-black shadow-md'
                  : 'bg-black/40 text-gray-400 border-white/10 hover:text-white')}
            >
              {slogan}
            </button>
          ))}
        </div>

        {/* The Viral Flex Ticket */}
        <div
          id="receipt-card"
          className="relative rounded-2xl overflow-hidden border border-stadiumGreen/40 p-4 space-y-3 shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #091209 0%, #0d1a0d 50%, #070e07 100%)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center space-x-1.5">
              <span className="text-base">⚡</span>
              <span className="font-black text-stadiumGreen text-xs">AURASCORE STADIUM</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen font-black text-[9px] border border-stadiumGreen/30">
              OFFICIAL FLEX SLIP ✓
            </span>
          </div>

          {/* Fixture */}
          <div className="text-center py-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase">{match.league}</span>
            <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
              {match.homeTeam} <span className="text-stadiumGreen">VS</span> {match.awayTeam}
            </h3>
            <span className="text-[10px] text-gold font-bold">{match.matchTime} • {match.venue || 'Stadium'}</span>
          </div>

          {/* Pick Highlight */}
          <div className="p-3 rounded-xl bg-stadiumGreen/10 border border-stadiumGreen/30 flex items-center justify-between">
            <div>
              <span className="text-[9px] text-gray-400 uppercase font-bold block">Selected Banker Pick</span>
              <span className="text-sm font-black text-white">{p.topPick.selection}</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-stadiumGreen">@ {p.topPick.odds}</span>
              <span className="text-[9px] text-gold block font-bold">{p.topPick.probability}% Win Prob</span>
            </div>
          </div>

          {/* Meme Stamp */}
          <div className="p-2 rounded-xl bg-black/60 border border-white/10 text-center">
            <span className="text-xs font-black text-white italic">{selectedSlogan}</span>
          </div>

          {/* Footer Staked By */}
          <div className="flex items-center justify-between text-[9px] text-gray-400 pt-1 border-t border-white/5">
            <span>Staked by <strong className="text-stadiumGreen">@CyberStriker_99</strong></span>
            <span>🇳🇬 Verified Gen-Z Ticket</span>
          </div>
        </div>

        {/* 1-Tap Share Actions */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <a
            href={'https://api.whatsapp.com/send?text=' + shareUrl}
            target="_blank"
            rel="noreferrer"
            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
          <a
            href={'https://twitter.com/intent/tweet?text=' + shareUrl}
            target="_blank"
            rel="noreferrer"
            className="py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-black text-[11px] flex items-center justify-center space-x-1.5 transition-all shadow-md active:scale-95"
          >
            <Twitter className="w-3.5 h-3.5" />
            <span>Twitter / X</span>
          </a>
          <button
            onClick={handleCopy}
            className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-[11px] flex items-center justify-center space-x-1.5 transition-all border border-white/10 active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-stadiumGreen" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Slip'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
