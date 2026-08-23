'use client';

import React, { useState } from 'react';
import { MatchData } from '../lib/sports-api';
import { X, Share2, Copy, Check, Sparkles, MessageCircle, Twitter, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { useTranslation } from '../lib/translation-engine';

interface ViralMatchSlipModalProps {
  match: MatchData;
  onClose: () => void;
}

export const ViralMatchSlipModal: React.FC<ViralMatchSlipModalProps> = ({ match, onClose }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const p = match.prediction;
  const shareText = `🔥 AuraScore Banker Pick: ${match.homeTeam} vs ${match.awayTeam}\n🎯 Selection: ${p.topPick.selection} (@${p.topPick.odds.toFixed(2)})\n📊 Confidence: ${p.topPick.probability}% (${p.topPick.confidenceTier})\n⚡ Verified on https://sports-teal-psi.vercel.app/?match=${match.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    confetti({ particleCount: 30, spread: 60 });
    phoneHardware.triggerHaptic('SUCCESS');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
    phoneHardware.triggerHaptic('SELECTION');
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
    phoneHardware.triggerHaptic('SELECTION');
  };

  const handleShareTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent('https://sports-teal-psi.vercel.app/?match=' + match.id)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
    phoneHardware.triggerHaptic('SELECTION');
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-md glass-panel-premium rounded-3xl border-2 border-gold/60 p-5 sm:p-6 shadow-2xl space-y-4 font-mono text-xs text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-gold animate-spin" />
          <h3 className="font-black text-sm text-gold uppercase tracking-wider">
            {t('Viral Matchday Flex Slip')}
          </h3>
        </div>

        {/* VISUAL BRANDED SLIP CARD */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0f172a] to-black border border-gold/40 space-y-4 shadow-xl text-center">
          <div className="flex items-center justify-between text-[10px] text-gray-400 border-b border-white/10 pb-2">
            <span className="text-gold font-bold">{match.league}</span>
            <span className="text-stadiumGreen font-black">100% VERIFIED LEDGER ✓</span>
          </div>

          {/* Teams Header */}
          <div className="space-y-1">
            <div className="text-base sm:text-lg font-black text-white">
              {match.homeTeam} <span className="text-gold">VS</span> {match.awayTeam}
            </div>
            <div className="text-xs text-gray-400 font-sans">{match.matchTime || 'Kickoff Scheduled'}</div>
          </div>

          {/* Big Banker Pick Badge */}
          <div className="p-3 rounded-xl bg-stadiumGreen/15 border border-stadiumGreen/40 space-y-1">
            <span className="text-[10px] text-stadiumGreen font-black block uppercase">
              👑 {p.topPick.confidenceTier} PICK
            </span>
            <div className="text-sm sm:text-base font-black text-white">
              {p.topPick.selection}
            </div>
            <div className="flex items-center justify-center space-x-3 text-xs">
              <span className="text-gold font-bold font-mono">Odds: @{p.topPick.odds.toFixed(2)}</span>
              <span className="text-emerald-400 font-bold font-mono">Win Chance: {p.topPick.probability}%</span>
            </div>
          </div>

          {/* AuraScore Branding Footer */}
          <div className="text-[9px] text-gray-400 font-mono pt-1">
            AuraScore Stadium 2.0 • sports-teal-psi.vercel.app
          </div>
        </div>

        {/* 1-TAP SHARE BUTTONS */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            onClick={handleShareWhatsApp}
            className="py-2.5 px-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-[#25D366] font-black text-xs flex items-center justify-center space-x-1.5 shadow"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleShareTwitter}
            className="py-2.5 px-2 rounded-xl bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 border border-[#1DA1F2]/50 text-[#1DA1F2] font-black text-xs flex items-center justify-center space-x-1.5 shadow"
          >
            <Twitter className="w-4 h-4 fill-current" />
            <span>Twitter/X</span>
          </button>

          <button
            onClick={handleShareTelegram}
            className="py-2.5 px-2 rounded-xl bg-[#0088cc]/20 hover:bg-[#0088cc]/30 border border-[#0088cc]/50 text-[#0088cc] font-black text-xs flex items-center justify-center space-x-1.5 shadow"
          >
            <Send className="w-4 h-4 fill-current" />
            <span>Telegram</span>
          </button>
        </div>

        {/* Copy Slip Text Button */}
        <button
          onClick={handleCopy}
          className="w-full py-3 rounded-2xl bg-stadiumGreen text-black font-black text-xs flex items-center justify-center space-x-2 shadow-lg hover:bg-emerald-400 transition-all active:scale-95"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? t('Slip Copied to Clipboard!') : t('Copy Matchday Slip & Link')}</span>
        </button>
      </div>
    </div>
  );
};
