'use client';

import React, { useState, useRef } from 'react';
import { Trophy, ShieldCheck, Share2, Download, Copy, Check, Sparkles, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../lib/phone-hardware-engine';

export interface FlexCardProps {
  ticketTitle?: string;
  totalOdds?: number;
  payoutNgn?: number;
  matches?: Array<{ match: string; pick: string; outcome?: string }>;
  settlementHash?: string;
}

export const HolographicFlexCard: React.FC<FlexCardProps> = ({
  ticketTitle = '👑 MIVAJ AUDITED BANKER SLIP',
  totalOdds = 18.45,
  payoutNgn = 184500,
  matches = [
    { match: 'Arsenal vs Chelsea', pick: 'Over 2.5 Goals', outcome: 'WON' },
    { match: 'Real Madrid vs Barcelona', pick: 'Both Teams to Score', outcome: 'WON' },
    { match: 'Inter Milan vs Juventus', pick: 'Inter Win or Draw (1X)', outcome: 'WON' },
    { match: 'Bayern Munich vs Dortmund', pick: 'Over 1.5 Goals', outcome: 'WON' }
  ],
  settlementHash = '0x8F92A1...B41C'
}) => {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rX = ((y - centerY) / centerY) * -10;
    const rY = ((x - centerX) / centerX) * 10;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleShare = () => {
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    const shareText = `🔥 MIVAJ VERIFIED WINNING SLIP! Payout: ₦${payoutNgn.toLocaleString()} (${totalOdds}x Odds). Audited Proof: ${settlementHash}\nCheck live banker picks at https://mivaj.com`;
    
    if (navigator.share) {
      navigator.share({ title: 'Mivaj Winning Ticket', text: shareText, url: 'https://mivaj.com' }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 font-mono">
      {/* 3D Interactive Card Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
        className="relative rounded-3xl p-6 bg-gradient-to-br from-neutral-950 via-neutral-900 to-black border-2 border-gold/60 shadow-[0_0_35px_rgba(234,179,8,0.25)] space-y-4 overflow-hidden select-none"
      >
        {/* Shimmer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold/10 to-transparent pointer-events-none"></div>

        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-gold/30 pb-3 relative z-10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gold/20 text-gold flex items-center justify-center font-black">
              👑
            </div>
            <div>
              <span className="text-[10px] text-gold font-black uppercase tracking-wider block">MIVAJ SPORTS ORACLE</span>
              <h3 className="text-xs font-black text-white">VERIFIED WINNING SLIP</h3>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen text-[9px] font-black border border-stadiumGreen/40">
            ✅ 100% AUDITED
          </span>
        </div>

        {/* Matches Breakdown */}
        <div className="space-y-2 relative z-10">
          {matches.map((m, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-black/60 border border-white/10 text-xs">
              <span className="text-gray-300 font-bold truncate max-w-[200px]">{m.match}</span>
              <span className="text-stadiumGreen font-black text-[11px] shrink-0">{m.pick} ✓</span>
            </div>
          ))}
        </div>

        {/* Payout & Odds Footer */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-gold/20 via-black to-stadiumGreen/20 border border-gold/40 flex items-center justify-between relative z-10">
          <div>
            <span className="text-[9px] text-gray-400 block uppercase">Total Multiplier</span>
            <span className="text-base font-black text-gold">{totalOdds}x Odds</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-gray-400 block uppercase">Verified Cash Payout</span>
            <span className="text-base font-black text-stadiumGreen">₦{payoutNgn.toLocaleString()}</span>
          </div>
        </div>

        {/* Hash Proof */}
        <div className="text-[9px] text-gray-500 text-center font-sans">
          Immutable Ledger Hash: <code className="text-gray-400">{settlementHash}</code>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={handleShare}
          className="flex-1 py-3 rounded-2xl bg-gold hover:bg-amber-400 text-black font-black text-xs flex items-center justify-center space-x-2 shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>{copied ? 'Copied Flex Link!' : 'Share Win on WhatsApp & TikTok'}</span>
        </button>
      </div>
    </div>
  );
};
