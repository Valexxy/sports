'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, Shield, CheckCircle2 } from 'lucide-react';
import { BetSlipConverter } from '../../components/converter/BetSlipConverter';
import { AFFILIATE_PARTNERS } from '../../config/affiliates';

export default function ConverterPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-white p-4 sm:p-6 pb-24 font-mono">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link
            href="/"
            className="px-3.5 py-2 rounded-xl bg-panel hover:bg-white/10 border border-white/10 text-xs font-black text-stadiumGreen flex items-center space-x-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Matches</span>
          </Link>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-stadiumGreen/20 text-stadiumGreen text-xs font-black border border-stadiumGreen/40 flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5" />
              <span>100% Free Tool</span>
            </span>
          </div>
        </div>

        {/* Simplified Header */}
        <div className="rounded-3xl bg-neutral-950/80 border border-stadiumGreen/30 p-6 sm:p-8 text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-stadiumGreen/20 border border-stadiumGreen/40 text-stadiumGreen text-[11px] font-black uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5" />
            <span>SPORTYBET CODE DECODER</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            SPORTYBET BOOKING CODE <span className="text-stadiumGreen">REVEALER</span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-400 font-sans max-w-xl mx-auto leading-relaxed">
            Paste any SportyBet booking code below to instantly reveal every match, market, selection, and odds on the ticket slip.
          </p>
        </div>

        {/* Decoder Tool */}
        <div id="converter-tool">
          <BetSlipConverter />
        </div>

        {/* Partner Bonuses Matrix Footer */}
        <div className="p-6 rounded-3xl bg-neutral-950/60 border border-neutral-800 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-black text-white">
            <Shield className="w-4 h-4 text-stadiumGreen" />
            <span>OFFICIAL BOOKMAKER PARTNERS &amp; SIGNUP BONUSES</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {Object.values(AFFILIATE_PARTNERS).map((p) => (
              <a
                key={p.key}
                href={p.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-black border border-neutral-800 hover:border-stadiumGreen transition-all text-xs space-y-1 block group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-white group-hover:text-stadiumGreen transition-colors">{p.displayName}</span>
                  <span className="text-stadiumGreen text-[10px]">➔</span>
                </div>
                <span className="text-[10px] text-gray-400 block">{p.bonusHighlight}</span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
