'use client';

import React, { useState } from 'react';
import { 
  X, Download, Share2, Sparkles, Trophy, 
  QrCode, Check, ShieldCheck, Flame 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';

interface SlipStoryCardModalProps {
  slipTitle?: string;
  totalOdds?: string;
  picks?: { match: string; selection: string }[];
  onClose: () => void;
}

export const SlipStoryCardModal: React.FC<SlipStoryCardModalProps> = ({
  slipTitle = "🔥 4-LEG ACCA BANKER",
  totalOdds = "3.72",
  picks = [
    { match: "Atl. Nacional vs Deportivo Cali", selection: "Atl. Nacional to Win @ 1.45" },
    { match: "River Plate vs Santa Fe", selection: "River Plate or Draw (1X) @ 1.22" },
    { match: "Seattle Storm vs Dallas Wings", selection: "Seattle Storm ML @ 1.45" },
    { match: "América de Cali vs Junior", selection: "América de Cali to Win @ 1.45" }
  ],
  onClose
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShareWhatsApp = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    const text = `🔥 Check out my Verified ${totalOdds} Odds Accumulator on Mivaj Sports!\n\n${picks.map((p, i) => `${i + 1}. ${p.match} -> ${p.selection}`).join('\n')}\n\n👉 Bet Free on Mivaj: https://mivaj.com/converter`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    navigator.clipboard.writeText(`https://mivaj.com/converter`);
    setCopiedLink(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 animate-fadeIn font-mono">
      <div className="glass-panel-premium w-full max-w-sm rounded-3xl border-2 border-gold p-5 space-y-4 shadow-2xl text-white relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 text-gray-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 9:16 WhatsApp Status Card Preview */}
        <div className="w-full aspect-[9/16] rounded-2xl bg-gradient-to-b from-[#0a0f1d] via-[#05070b] to-[#040508] border-2 border-gold/60 p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          
          {/* Top Branding */}
          <div className="space-y-1 text-center">
            <div className="flex items-center justify-center space-x-1.5 text-gold font-black text-xs tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MIVAJ SPORTS • VIP ACCA</span>
            </div>
            <h3 className="text-base font-black text-white tracking-tight">{slipTitle}</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/40 font-mono font-black inline-block">
              TOTAL ODDS: {totalOdds}
            </span>
          </div>

          {/* Picks Body */}
          <div className="space-y-2 py-2">
            {picks.map((p, idx) => (
              <div key={idx} className="p-2 rounded-xl bg-neutral-900/90 border border-white/10 text-[11px] font-sans space-y-0.5">
                <div className="text-gray-300 font-bold truncate">{p.match}</div>
                <div className="text-stadiumGreen font-black font-mono">{p.selection}</div>
              </div>
            ))}
          </div>

          {/* Bottom QR & Sponsor Footer */}
          <div className="p-3 rounded-xl bg-black/80 border border-gold/40 text-center space-y-1.5">
            <div className="flex items-center justify-center space-x-1 text-[10px] text-gray-300">
              <ShieldCheck className="w-3.5 h-3.5 text-stadiumGreen" />
              <span>Verified on MIVAJ.COM</span>
            </div>
            <div className="text-[9px] text-gold font-bold">
              Scan / Visit to Claim ₦130,000 + $3,000 Welcome Bonus
            </div>
          </div>

        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={handleShareWhatsApp}
            className="w-full py-3 rounded-2xl bg-stadiumGreen hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Directly to WhatsApp Status</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs flex items-center justify-center space-x-2 transition-all"
          >
            {copiedLink ? <Check className="w-4 h-4 text-stadiumGreen" /> : <Sparkles className="w-4 h-4 text-gold" />}
            <span>{copiedLink ? 'Link Copied ✓' : 'Copy Share Link'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
