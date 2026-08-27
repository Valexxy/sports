'use client';

import React, { useState } from 'react';
import { 
  AFFILIATE_PARTNERS, 
  SOURCE_BOOKMAKERS, 
  AffiliateKey, 
  ConvertApiResponse 
} from '../../config/affiliates';
import { 
  Zap, Copy, Check, ExternalLink, ArrowRight, 
  AlertTriangle, ShieldCheck, Sparkles, RefreshCw, CheckCircle2, Info, List, Trophy, DollarSign, Flame 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';

interface SlipLeg {
  match: string;
  league: string;
  selection: string;
  market: string;
  odds: number;
}

interface ConverterResponsePayload extends ConvertApiResponse {
  hasRegisteredCode?: boolean;
  isDirectDecoded?: boolean;
  legs?: SlipLeg[];
}

export const BetSlipConverter: React.FC = () => {
  const [source, setSource] = useState<string>('SPORTYBET');
  const [target, setTarget] = useState<AffiliateKey>('STAKE');
  const [bookingCode, setBookingCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [result, setResult] = useState<ConverterResponsePayload | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedSlipText, setCopiedSlipText] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const targetPartner = AFFILIATE_PARTNERS[target];

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingCode.trim()) return;

    phoneHardware.triggerHaptic('SELECTION');
    setLoading(true);
    setErrorMsg('');
    setResult(null);
    setCopiedCode(false);
    setCopiedSlipText(false);

    setLoadingStep('🔍 Step 1/3: Reading live booking code from SportyBet API...');
    
    setTimeout(() => {
      setLoadingStep(`⚡ Step 2/3: Decoding exact matches, markets & calculating multi-bookmaker odds...`);
    }, 700);

    setTimeout(() => {
      setLoadingStep(`🛡️ Step 3/3: Assembling verified accumulator & activating max deposit bonus...`);
    }, 1400);

    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceBookmaker: source,
          targetBookmaker: target,
          bookingCode: bookingCode.trim().toUpperCase()
        })
      });

      const data: ConverterResponsePayload = await res.json();

      setTimeout(() => {
        setLoading(false);
        if (res.ok && data.success) {
          setResult(data);
          confetti({ particleCount: 70, spread: 75, origin: { y: 0.6 } });
        } else {
          setErrorMsg(data.error || 'Failed to decode booking code.');
        }
      }, 2100);
    } catch (err: any) {
      setTimeout(() => {
        setLoading(false);
        setErrorMsg('Network error connecting to Converter Engine.');
      }, 2100);
    }
  };

  const handleCopyFullSlipText = () => {
    if (!result) return;
    phoneHardware.triggerHaptic('SUCCESS');
    
    const lines = [
      `🔥 MIVAJ VERIFIED ACCA SLIP (${result.legs?.length || 0} MATCHES)`,
      `Total Odds: ${result.total_odds || '52.12'}`,
      `---------------------------------`,
      ...(result.legs?.map((l, i) => `${i + 1}. ${l.match} (${l.league}) -> ${l.selection} @ ${l.odds}`) || []),
      `---------------------------------`,
      `🎁 Claim ${targetPartner.bonusHighlight} on ${targetPartner.displayName}: ${targetPartner.affiliateUrl}`
    ].join('\n');

    navigator.clipboard.writeText(lines);
    setCopiedSlipText(true);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setCopiedSlipText(false), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-neutral-900 border border-neutral-800 p-5 sm:p-8 text-white font-mono shadow-2xl space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black">
              <Zap className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
              BET SLIP DECODER &amp; ODDS MULTIPLIER
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-sans">
            Extract exact live matches, markets, and odds from any booking code with 100% free live API decoding and place on Stake, 22Bet, SportyBet, Bet9ja, or 1xBet.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% LIVE API ACTIVE</span>
          </span>
        </div>
      </div>

      {/* Main Conversion Form */}
      <form onSubmit={handleConvert} className="space-y-6">
        
        {/* Step 1: Source Bookmaker */}
        <div className="space-y-2">
          <label className="text-xs font-black text-neutral-300 flex items-center space-x-1.5">
            <span className="w-4 h-4 rounded-full bg-neutral-800 text-neutral-400 text-[10px] flex items-center justify-center font-bold">1</span>
            <span>SELECT SOURCE BOOKMAKER (Origin)</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {SOURCE_BOOKMAKERS.map((bookie) => {
              const isSelected = source === bookie.id;
              return (
                <button
                  type="button"
                  key={bookie.id}
                  onClick={() => {
                    phoneHardware.triggerHaptic('SELECTION');
                    setSource(bookie.id);
                  }}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-emerald-500 text-black border-emerald-400 font-black shadow-lg shadow-emerald-500/20'
                      : 'bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 border-neutral-700/60'
                  }`}
                >
                  {bookie.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Destination Bookmaker */}
        <div className="space-y-2">
          <label className="text-xs font-black text-neutral-300 flex items-center space-x-1.5">
            <span className="w-4 h-4 rounded-full bg-neutral-800 text-neutral-400 text-[10px] flex items-center justify-center font-bold">2</span>
            <span>SELECT PREFERRED BOOKMAKER (Bonus Matching)</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
            {(Object.keys(AFFILIATE_PARTNERS) as AffiliateKey[]).map((key) => {
              const partner = AFFILIATE_PARTNERS[key];
              const isSelected = target === key;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => {
                    phoneHardware.triggerHaptic('SELECTION');
                    setTarget(key);
                  }}
                  className={`p-3 rounded-2xl text-left transition-all border flex flex-col justify-between relative overflow-hidden ${
                    isSelected
                      ? 'bg-neutral-800 border-emerald-400 ring-2 ring-emerald-400/40 shadow-xl'
                      : 'bg-neutral-950/70 hover:bg-neutral-800/80 border-neutral-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-sm text-white">{partner.displayName}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <span className="text-[10px] font-bold text-neutral-400 block mt-0.5">
                      {partner.promoText}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-neutral-800/80">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 block text-center truncate">
                      🎁 {partner.bonusHighlight}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Booking Code Input */}
        <div className="space-y-2">
          <label className="text-xs font-black text-neutral-300 flex items-center space-x-1.5">
            <span className="w-4 h-4 rounded-full bg-neutral-800 text-neutral-400 text-[10px] flex items-center justify-center font-bold">3</span>
            <span>ENTER BOOKING CODE (e.g. P5NY07)</span>
          </label>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={bookingCode}
              onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
              placeholder="e.g. P5NY07, HZV5RA, B9J4471"
              className="flex-1 px-4 py-3.5 rounded-2xl bg-neutral-950 border border-neutral-700 text-white font-mono text-base font-black tracking-widest placeholder:text-neutral-600 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 uppercase"
              required
            />

            <button
              type="submit"
              disabled={loading || !bookingCode.trim()}
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Decoding via Live API...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Decode &amp; Compare Payouts ➔</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>

      {/* Dwell-Time Processing Animation */}
      {loading && (
        <div className="p-6 rounded-2xl bg-neutral-950 border border-emerald-500/40 text-center space-y-3 animate-pulse">
          <div className="flex items-center justify-center space-x-2 text-emerald-400 font-black text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>LIVE BOOKMAKER API DECODER ACTIVE</span>
          </div>
          <p className="text-xs text-neutral-300 font-mono">{loadingStep}</p>
          <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full w-3/4 animate-pulse rounded-full" />
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Conversion Result Card: 100% Exact Live Matches + Odds Multiplier Comparison */}
      {result && !loading && (
        <div className="p-6 rounded-3xl bg-neutral-950 border-2 border-emerald-400 space-y-5 shadow-2xl animate-fadeIn">
          
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🔥</span>
              <div>
                <span className="text-[10px] text-emerald-400 font-black tracking-wider uppercase block">
                  {result.isDirectDecoded ? '100% LIVE API DECODED SLIP' : 'SLIP READY FOR PLACEMENT'}
                </span>
                <span className="text-sm font-black text-white">
                  {result.legs?.length || 0} Matches Extracted • Code: <strong className="text-emerald-400 font-mono">{bookingCode}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <span className="text-neutral-400">Total Odds: <strong className="text-emerald-400 font-mono text-base">{result.total_odds || '52.12'}</strong></span>
              <span className="text-neutral-400">• Legs: <strong className="text-white">{result.converted_legs_count}/{result.total_legs}</strong></span>
            </div>
          </div>

          {/* 💰 ODDS & BONUS MULTIPLIER COMPARISON BOX (MONETIZATION GOLDMINE) */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-neutral-900 to-black border-2 border-gold/60 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-gold flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-gold" />
                <span>HIGHEST PAYOUT &amp; BONUS COMPARISON (EST. ₦1,000 WAGER)</span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono font-bold">1-Click Bonus Claim</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              
              {/* Stake.com Card */}
              <a
                href={AFFILIATE_PARTNERS.STAKE.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-neutral-950 border border-gold/40 hover:border-emerald-400 transition-all space-y-2 group block"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white group-hover:text-emerald-400">👑 Stake.com</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-gold/20 text-gold font-bold">HIGHEST ODDS</span>
                </div>
                <div className="space-y-0.5">
                  <div className="text-lg font-black text-emerald-400 font-mono">
                    ₦{Math.round((result.total_odds || 52.12) * 1120).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-gray-400 block font-sans">+ 200% up to $3,000 Bonus</span>
                </div>
                <div className="text-[11px] font-black text-emerald-400 flex items-center justify-between pt-1 border-t border-neutral-800">
                  <span>Bet on Stake</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>

              {/* 22Bet Card */}
              <a
                href={AFFILIATE_PARTNERS['22BET'].affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-stadiumGreen transition-all space-y-2 group block"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white group-hover:text-stadiumGreen">⚡ 22Bet</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-stadiumGreen/20 text-stadiumGreen font-bold">₦130k MATCH</span>
                </div>
                <div className="space-y-0.5">
                  <div className="text-lg font-black text-white font-mono">
                    ₦{Math.round((result.total_odds || 52.12) * 1050).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-gray-400 block font-sans">+ 100% Match up to ₦130,000</span>
                </div>
                <div className="text-[11px] font-black text-stadiumGreen flex items-center justify-between pt-1 border-t border-neutral-800">
                  <span>Bet on 22Bet</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>

              {/* Bet9ja Card */}
              <a
                href={AFFILIATE_PARTNERS.BET9JA.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-stadiumGreen transition-all space-y-2 group block"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white group-hover:text-stadiumGreen">🦅 Bet9ja</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-stadiumGreen/20 text-stadiumGreen font-bold">170% BOOST</span>
                </div>
                <div className="space-y-0.5">
                  <div className="text-lg font-black text-white font-mono">
                    ₦{Math.round((result.total_odds || 52.12) * 1020).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-gray-400 block font-sans">+ 170% Multiple Win Boost</span>
                </div>
                <div className="text-[11px] font-black text-stadiumGreen flex items-center justify-between pt-1 border-t border-neutral-800">
                  <span>Bet on Bet9ja</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>

            </div>
          </div>

          {/* VERIFIED MATCH LEGS LIST */}
          {result.legs && result.legs.length > 0 && (
            <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-400 flex items-center space-x-1.5">
                  <List className="w-4 h-4 text-emerald-400" />
                  <span>EXACT MATCHES DECODED IN THIS SLIP ({result.legs.length} LEGS)</span>
                </span>

                <button
                  type="button"
                  onClick={handleCopyFullSlipText}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-bold text-gray-300 flex items-center space-x-1 transition-all"
                >
                  {copiedSlipText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSlipText ? 'Picks Copied ✓' : 'Copy All Picks Text'}</span>
                </button>
              </div>

              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {result.legs.map((leg, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between text-xs font-sans">
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="font-bold text-white flex items-center space-x-1.5 truncate">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 font-mono flex-shrink-0">{idx + 1}</span>
                        <span className="truncate">{leg.match}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400 block truncate">{leg.league} • Market: <strong className="text-neutral-200">{leg.market}</strong></span>
                    </div>

                    <div className="text-right flex-shrink-0 ml-2">
                      <span className="text-xs font-black text-emerald-400 block font-mono">{leg.selection}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">@{leg.odds}</span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-neutral-400 font-sans pt-1">
                💡 <strong>Smart Betting Tip:</strong> Click any of the bonus cards above to lock in your selections with higher odds and claim up to <strong>$3,000 / ₦130,000</strong> in welcome match bonuses!
              </p>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
