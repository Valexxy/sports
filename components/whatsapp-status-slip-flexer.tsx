'use client';

import React, { useState } from 'react';
import { Share2, Sparkles, Trophy, ShieldCheck, Check, Copy } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import confetti from 'canvas-confetti';

export const WhatsAppStatusSlipFlexer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleShareStatus = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    const text = `🔥 *MY 10.00 ODDS BANKER SLIP IS LOCKED ON MIVAJ SPORTS!* 🔥\n\n🎯 Odds: @10.85 (Poisson AI)\n🛡️ Cut-1 Insurance Shield Active\n💰 Potential Win: ₦1,000 ➔ ₦10,850\n\n👉 Load Code & Bet: https://mivaj.com`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="glass-panel-premium rounded-3xl border-2 border-stadiumGreen/60 p-4 sm:p-6 space-y-4 font-mono text-xs text-white shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-stadiumGreen text-black font-black text-xl shadow-lg">
            📱
          </div>
          <div>
            <h2 className="font-black text-sm sm:text-base text-white">
              WHATSAPP STATUS 9:16 TICKET FLEXER 🎴
            </h2>
            <p className="text-[10px] text-gray-300 font-sans mt-0.5">
              1-Tap formatted story card designed for WhatsApp Status & Instagram Stories.
            </p>
          </div>
        </div>

        <button
          onClick={handleShareStatus}
          className="px-4 py-2.5 rounded-2xl bg-[#25D366] text-black font-black text-xs flex items-center space-x-1.5 shadow-md hover:scale-105 transition-all"
        >
          <Share2 className="w-4 h-4 text-black" />
          <span>Flex on WhatsApp Status ➔</span>
        </button>
      </div>

      {/* 9:16 Vertical Story Mockup Card */}
      <div className="flex justify-center py-2">
        <div className="w-72 p-5 rounded-3xl bg-gradient-to-b from-emerald-950 via-black to-slate-950 border-2 border-stadiumGreen shadow-2xl text-center space-y-3">
          <span className="px-2.5 py-0.5 rounded-full bg-stadiumGreen text-black font-black text-[9px]">
            OFFICIAL MIVAJ SLIP ⚡
          </span>
          <div className="space-y-1">
            <span className="text-3xl block">🏆</span>
            <span className="text-xl font-black text-gold font-mono block">@10.85 ODDS</span>
            <span className="text-[10px] text-gray-300 font-sans">5 Curated Banker Matches</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-left text-[10px]">
            <div className="flex justify-between text-stadiumGreen font-bold">
              <span>Stake: ₦1,000</span>
              <span>Returns: ₦10,850</span>
            </div>
            <div className="flex justify-between text-gold font-bold">
              <span>Cut-1 Return: ₦6,800</span>
              <span>Shield: ACTIVE 🛡️</span>
            </div>
          </div>

          <div className="text-[9px] text-gray-400 font-mono pt-1">
            Join & Bet: <strong>mivaj.com</strong>
          </div>
        </div>
      </div>
    </section>
  );
};
