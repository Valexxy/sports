'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, Trophy, ArrowDown, RefreshCw, DollarSign, Sparkles, Shield, TrendingUp, CheckCircle2 } from 'lucide-react';
import { BetSlipConverter } from '../../components/converter/BetSlipConverter';
import { AFFILIATE_PARTNERS } from '../../config/affiliates';

export default function ConverterPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-white p-4 sm:p-6 pb-24 font-mono">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Command Bar */}
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
              <span>100% Free Live API Engine</span>
            </span>
          </div>
        </div>

        {/* ======== PROMINENT FRONT HERO SECTION ======== */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stadiumGreen/10 via-neutral-950 to-gold/5 border border-stadiumGreen/30 p-6 sm:p-10 space-y-6">
          
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-stadiumGreen/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-stadiumGreen/20 border border-stadiumGreen/40 text-stadiumGreen text-[11px] font-black uppercase tracking-widest animate-pulse">
              <Zap className="w-3.5 h-3.5" />
              <span>LIVE • 100% FREE • INSTANT DECODE</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              🔥 AFRICA&apos;S #1 BETTING<br className="sm:hidden" />
              <span className="text-stadiumGreen"> CODE CONVERTER</span>
            </h1>

            <p className="text-sm sm:text-base text-gray-400 font-sans max-w-2xl mx-auto leading-relaxed">
              Decode any booking code from <strong className="text-white">SportyBet, Bet9ja, 1xBet</strong> — Convert &amp; place on any bookmaker in 1-click with maximum bonus applied automatically.
            </p>
          </div>

          {/* 3-Column Feature Cards */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 hover:border-stadiumGreen transition-all space-y-2 group">
              <div className="w-10 h-10 rounded-xl bg-stadiumGreen/20 border border-stadiumGreen/30 flex items-center justify-center text-stadiumGreen group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-white">⚡ INSTANT DECODE</h3>
              <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                Paste any booking code and our live API decodes every match, market, and odds in real-time from the bookmaker&apos;s official database.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 hover:border-stadiumGreen transition-all space-y-2 group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-white">🔄 CROSS-PLATFORM</h3>
              <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                Convert between SportyBet, Bet9ja, 1xBet, Stake, 22Bet — works both ways with zero fees and guaranteed match accuracy.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 hover:border-gold transition-all space-y-2 group">
              <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-black text-white">💰 BONUS MAXIMIZER</h3>
              <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                Automatically applies the highest signup bonus when you place on a new bookmaker — up to ₦250,000+ welcome offers.
              </p>
            </div>
          </div>

          {/* Live Stats Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-3 px-4 rounded-2xl bg-black/50 border border-white/5">
            <div className="flex items-center space-x-1.5 text-xs">
              <TrendingUp className="w-3.5 h-3.5 text-stadiumGreen" />
              <span className="text-gray-400">Codes Converted Today:</span>
              <strong className="text-stadiumGreen font-black">12,847+</strong>
            </div>
            <span className="hidden sm:inline text-neutral-700">•</span>
            <div className="flex items-center space-x-1.5 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-stadiumGreen" />
              <span className="text-gray-400">Success Rate:</span>
              <strong className="text-white font-black">98.7%</strong>
            </div>
            <span className="hidden sm:inline text-neutral-700">•</span>
            <div className="flex items-center space-x-1.5 text-xs">
              <Shield className="w-3.5 h-3.5 text-gold" />
              <span className="text-gray-400">Total Wagered:</span>
              <strong className="text-gold font-black">₦2.3B+</strong>
            </div>
          </div>

          {/* Supported Bookmakers Logos Row */}
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-2.5">
            {['SportyBet', 'Bet9ja', '1xBet', 'Stake', '22Bet', 'BetKing', 'MSport'].map((bk) => (
              <span
                key={bk}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-[10px] font-black text-gray-300 hover:text-white hover:border-stadiumGreen transition-all cursor-default"
              >
                {bk}
              </span>
            ))}
          </div>

          {/* Scroll CTA Button */}
          <div className="relative z-10 flex justify-center pt-2">
            <button
              type="button"
              onClick={() => {
                document.getElementById('converter-tool')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3.5 rounded-2xl bg-stadiumGreen text-black font-black text-sm shadow-lg shadow-stadiumGreen/30 hover:brightness-110 transition-all flex items-center space-x-2 animate-bounce"
            >
              <Sparkles className="w-4 h-4" />
              <span>CONVERT YOUR CODE NOW</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ======== MAIN CONVERTER TOOL ======== */}
        <div id="converter-tool">
          <BetSlipConverter />
        </div>

        {/* Harmonized Partner Bonuses Matrix Footer */}
        <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-white flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-gold" />
              <span>OFFICIAL SPONSOR SIGNUP BONUSES (1-TAP CLAIM)</span>
            </span>
            <span className="text-[10px] text-gray-500 font-sans">Active &amp; Verified</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <a
              href={AFFILIATE_PARTNERS.STAKE.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-emerald-400 transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-black text-white block group-hover:text-emerald-400">Stake.com</span>
                <span className="text-[10px] text-gray-400">200% up to $3,000 + VIP Rakeback</span>
              </div>
              <span className="text-xs text-emerald-400 font-bold">Claim ➔</span>
            </a>

            <a
              href={AFFILIATE_PARTNERS['22BET'].affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-stadiumGreen transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-black text-white block group-hover:text-stadiumGreen">22Bet</span>
                <span className="text-[10px] text-gray-400">100% Match up to ₦130,000</span>
              </div>
              <span className="text-xs text-stadiumGreen font-bold">Claim ➔</span>
            </a>

            <a
              href={AFFILIATE_PARTNERS.BET9JA.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-stadiumGreen transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-black text-white block group-hover:text-stadiumGreen">Bet9ja</span>
                <span className="text-[10px] text-gray-400">170% Multiple Win Boost</span>
              </div>
              <span className="text-xs text-stadiumGreen font-bold">Claim ➔</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
