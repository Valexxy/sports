import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, Sparkles, Shield } from 'lucide-react';
import { BetSlipConverter } from '../../components/converter/BetSlipConverter';
import { EnterpriseConverterHUD } from '../../components/converter/EnterpriseConverterHUD';

export const metadata = {
  title: 'Military-Grade Bet Slip Converter | Stake, 22Bet, SportyBet, Bet9ja, 1xBet',
  description: 'Convert any betting booking code from global sportsbooks into Stake, 22Bet, SportyBet, Bet9ja, and 1xBet with instant odds matching and 1-tap cart injection.',
};

export default function ConverterPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-white p-4 sm:p-6 pb-24 font-mono">
      <div className="max-w-6xl mx-auto space-y-6">
        
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
              <span>RapidAPI Slip Engine 3.0</span>
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center space-y-2 py-3">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>PRODUCTION BET SLIP CONVERTER</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-sans max-w-2xl mx-auto">
            Convert any booking code into verified Stake, 22Bet, SportyBet, Bet9ja, and 1xBet slips with 1-tap copy &amp; launch!
          </p>
        </div>

        {/* Primary Bet Slip Converter Component */}
        <BetSlipConverter />

        {/* Multi-Bookmaker Matrix HUD */}
        <EnterpriseConverterHUD />

      </div>
    </div>
  );
}
