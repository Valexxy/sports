'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, Unlock, ShieldCheck, Flame, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';

export default function VipBankerPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playSuccessSound();
    confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
    navigator.clipboard.writeText('STAKE-7798X2');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-white font-mono pb-24">
      <div className="sticky top-0 z-30 bg-black/85 backdrop-blur-xl border-b border-white/10 px-4 py-3 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-xs text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 text-stadiumGreen" />
            <span>Back to Stadium</span>
          </Link>
          <span className="text-xs font-black text-stadiumGreen flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4" />
            <span>VIP AUDITED ACCA BANKER</span>
          </span>
        </div>
      </div>

      <div className="max-w-xl mx-auto p-4 sm:p-6 space-y-6 pt-8">
        <div className="p-7 rounded-3xl bg-neutral-950 border-2 border-stadiumGreen/70 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-stadiumGreen/20 border border-stadiumGreen/50 flex items-center justify-center mx-auto text-stadiumGreen shadow-lg">
            <Unlock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-gold tracking-wider block">
              ✨ VIP LOCKER • HIGH VALUE ACCUMULATOR
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              🔥 58.40 ACCA BANKER • 100% AUDITED
            </h1>
            <p className="text-xs text-gray-400">Total Odds: <strong>58.40</strong> • Confidence: <strong>98.2%</strong></p>
          </div>

          <div className="p-4 rounded-2xl bg-black/60 border border-stadiumGreen/40 space-y-2">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">STAKE &amp; 22BET BOOKING CODE</span>
            <div className="text-2xl sm:text-3xl font-black text-stadiumGreen tracking-widest font-mono">
              STAKE-7798X2
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className={`w-full py-4 rounded-2xl text-xs font-black flex items-center justify-center space-x-2 transition-all shadow-xl ${
              copied
                ? 'bg-stadiumGreen text-black'
                : 'bg-gradient-to-r from-stadiumGreen to-emerald-400 text-black hover:brightness-110'
            }`}
          >
            {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'VIP Code Copied to Clipboard! ✓' : 'Copy VIP Booking Code & Bet Now'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
