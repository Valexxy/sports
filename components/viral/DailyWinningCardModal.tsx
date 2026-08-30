'use client';

import React, { useState } from 'react';
import { X, Download, Share2, Sparkles, Check, ShieldCheck, Flame, Trophy, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';

interface DailyWinningCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  date?: string;
  totalOdds?: string;
  winRate?: string;
}

export const DailyWinningCardModal: React.FC<DailyWinningCardModalProps> = ({
  isOpen,
  onClose,
  date = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }),
  totalOdds = '14.85',
  winRate = '100',
}) => {
  const [copied, setCopied] = useState(false);
  const cardImageUrl = `/api/og/winning-card?date=${encodeURIComponent(date)}&odds=${encodeURIComponent(totalOdds)}&winRate=${encodeURIComponent(winRate)}&t=${Date.now()}`;

  if (!isOpen) return null;

  const handleCopyCaption = () => {
    const text = `🔥 BOOM! TODAY'S MIVAJ SPORTS WINNING ACCUMULATOR CASHED! 💰\n\n` +
      `✅ Total Odds: ${totalOdds}x Won\n` +
      `🎯 Win Rate: ${winRate}% Verified\n` +
      `📜 Audited Referee Ledger: https://mivaj.com/settlement\n\n` +
      `🚀 Don't miss tomorrow's 15.00x Free Master Banker Drop:\n` +
      `👉 Join Free Telegram: https://t.me/mivajsport\n` +
      `👉 Website: https://mivaj.com\n\n` +
      `#MivajSports #WinningSlip #SportsBetting #FreeBankers #FootballPredictions`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      try {
        phoneHardware.triggerHaptic('SUCCESS');
        stadiumAudio.playCrowdRoar();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
      } catch {}
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleDownload = () => {
    try {
      phoneHardware.triggerHaptic('SUCCESS');
      stadiumAudio.playCrowdRoar();
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.4 } });
    } catch {}

    const a = document.createElement('a');
    a.href = cardImageUrl;
    a.download = `Mivaj-Winning-Slip-${new Date().toISOString().split('T')[0]}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-mono">
      <div className="relative w-full max-w-3xl glass-panel-premium rounded-3xl border-2 border-stadiumGreen p-4 sm:p-7 shadow-2xl space-y-4 max-h-[94vh] overflow-y-auto text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-stadiumGreen animate-pulse" />
            <h3 className="font-extrabold text-sm sm:text-base text-white">
              Official Daily Winning Slip Picture (Social Share Card)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-panel hover:bg-white/10 text-gray-400 hover:text-white border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* High-Resolution Live Image Preview */}
        <div className="rounded-2xl overflow-hidden border-2 border-stadiumGreen/60 shadow-2xl bg-black relative">
          <img
            src={cardImageUrl}
            alt="Mivaj Sports Daily Winning Slip"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleDownload}
            className="py-3.5 px-4 rounded-2xl bg-gradient-to-r from-stadiumGreen via-emerald-400 to-stadiumGreen text-black font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xl shadow-stadiumGreen/25 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>DOWNLOAD IMAGE (PNG) 📥</span>
          </button>

          <button
            onClick={handleCopyCaption}
            className="py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-xs sm:text-sm flex items-center justify-center space-x-2 active:scale-95 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-stadiumGreen" /> : <Share2 className="w-4 h-4 text-gold" />}
            <span>{copied ? 'CAPTION COPIED! ✓' : 'COPY VIRAL SOCIAL CAPTION 📋'}</span>
          </button>
        </div>

        {/* High-FOMO Advice Footer */}
        <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 text-[11px] text-gray-300 font-sans space-y-1">
          <div className="font-bold text-stadiumGreen flex items-center space-x-1.5">
            <Flame className="w-3.5 h-3.5 text-gold" />
            <span>Viral Growth Directive:</span>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Post this card directly to WhatsApp Status, Facebook Groups, Twitter/X, and Telegram Channels. Highlighting 100% verified winning games drives massive organic FOMO and converts punters directly into our Telegram channel: <strong className="text-white">t.me/mivajsport</strong>.
          </p>
        </div>

      </div>
    </div>
  );
};
