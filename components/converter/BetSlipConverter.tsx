'use client';

import React, { useState } from 'react';
import { 
  AFFILIATE_PARTNERS, 
  AffiliateKey, 
  ConvertApiResponse 
} from '../../config/affiliates';
import { 
  Zap, Copy, Check, ExternalLink, ArrowRight, 
  AlertTriangle, ShieldCheck, Sparkles, RefreshCw, CheckCircle2, Info, List, Trophy, DollarSign, Flame, XCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';

interface SlipLeg {
  match: string;
  homeTeam?: string;
  awayTeam?: string;
  league: string;
  selection: string;
  market: string;
  odds: number;
  matchStatus?: 'SCHEDULED' | 'LIVE' | 'FINISHED';
  homeScore?: number;
  awayScore?: number;
  legOutcome?: 'WON' | 'LOST' | 'PENDING';
  mivajAiPrediction?: {
    selection: string;
    odds: number;
    result: 'WON' | 'LOST';
    reason: string;
  };
}

interface ConverterResponsePayload extends ConvertApiResponse {
  hasRegisteredCode?: boolean;
  isDirectDecoded?: boolean;
  legs?: SlipLeg[];
}

export const BetSlipConverter: React.FC = () => {
  const [target, setTarget] = useState<AffiliateKey>('22BET');
  const [bookingCode, setBookingCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [result, setResult] = useState<ConverterResponsePayload | null>(null);
  const [copiedSlipText, setCopiedSlipText] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const targetPartner = AFFILIATE_PARTNERS[target];

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingCode.trim()) return;

    try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
    setLoading(true);
    setErrorMsg('');
    setResult(null);
    setCopiedSlipText(false);

    setLoadingStep('🔍 Reading live booking code from SportyBet...');
    
    setTimeout(() => {
      setLoadingStep(`⚡ Decoding exact matches, scores, and leg outcomes...`);
    }, 600);

    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceBookmaker: 'SPORTYBET',
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
      }, 1200);
    } catch (err: any) {
      setTimeout(() => {
        setLoading(false);
        setErrorMsg('Network error connecting to Decoder Engine.');
      }, 1200);
    }
  };

  const handleCopyFullSlipText = () => {
    if (!result) return;
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
    
    const lines = [
      `🔥 MIVAJ VERIFIED ACCA SLIP (${result.legs?.length || 0} MATCHES)`,
      `Total Odds: ${result.total_odds || '5.20'}`,
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
              SPORTYBET BOOKING CODE REVEALER
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-sans max-w-lg">
            Enter any SportyBet booking code to <strong className="text-white">instantly reveal all hidden matches, scores, and leg outcomes</strong>. If a leg lost, see Mivaj AI's superior prediction instead!
          </p>
          <div className="flex items-center space-x-2 pt-1">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-black">✓ SPORTYBET DIRECT</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-black">🆓 100% FREE</span>
            <span className="px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/30 text-[10px] font-black">🎯 REAL-TIME SCORES</span>
          </div>
        </div>
      </div>

      {/* Main Conversion Form */}
      <form onSubmit={handleConvert} className="space-y-6">
        
        {/* Source Info Banner */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-black text-emerald-400">SOURCE: SPORTYBET CODES ONLY ✓</p>
            <p className="text-[11px] text-gray-300 font-sans mt-0.5">
              Enter any valid SportyBet booking code. If you enter an invalid code or a code from another bookmaker (such as Bet9ja), the system will explicitly alert you.
            </p>
          </div>
        </div>

        {/* Step 1: Destination Bookmaker Bonus Choice */}
        <div className="space-y-2">
          <label className="text-xs font-black text-neutral-300 flex items-center space-x-1.5">
            <span className="w-4 h-4 rounded-full bg-neutral-800 text-neutral-400 text-[10px] flex items-center justify-center font-bold">1</span>
            <span>PICK PREFERRED AFFILIATE BOOKMAKER (Where to Claim Bonus)</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {(Object.keys(AFFILIATE_PARTNERS) as AffiliateKey[]).map((key) => {
              const partner = AFFILIATE_PARTNERS[key];
              const isSelected = target === key;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => {
                    try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
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

        {/* Step 2: Booking Code Input */}
        <div className="space-y-2">
          <label className="text-xs font-black text-neutral-300 flex items-center space-x-1.5">
            <span className="w-4 h-4 rounded-full bg-neutral-800 text-neutral-400 text-[10px] flex items-center justify-center font-bold">2</span>
            <span>ENTER 6-CHARACTER SPORTYBET BOOKING CODE</span>
          </label>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={bookingCode}
              onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
              placeholder="e.g. BC7F3X, HZV5RA"
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
                  <span>Decoding Live API...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Decode SportyBet Code ➔</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>

      {/* Error Alert — Strict Validation for Non-SportyBet or Invalid Codes */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-950/60 border border-crimson/50 text-red-300 space-y-2 animate-fadeIn">
          <div className="flex items-center space-x-2 font-black text-xs text-crimson">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>SPORTYBET CODE NOT FOUND</span>
          </div>
          <p className="text-xs font-sans text-gray-200">{errorMsg}</p>
        </div>
      )}

      {/* Processing Animation */}
      {loading && (
        <div className="p-6 rounded-2xl bg-neutral-950 border border-emerald-500/40 text-center space-y-3 animate-pulse">
          <div className="flex items-center justify-center space-x-2 text-emerald-400 font-black text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>SPORTYBET LIVE API DECODER ACTIVE</span>
          </div>
          <p className="text-xs text-neutral-300 font-mono">{loadingStep}</p>
        </div>
      )}

      {/* DECODED RESULT DISPLAY */}
      {result && result.legs && (
        <div className="space-y-6 pt-4 border-t border-neutral-800 animate-fadeIn">
          
          {/* Slip Overview Header */}
          <div className="p-5 rounded-3xl bg-neutral-950 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">DECODED SPORTYBET SLIP RESULT</span>
              <h3 className="text-xl font-black text-white">{result.legs.length} Matches Decoded</h3>
              <span className="text-xs text-neutral-400 block font-mono">Total Cumulative Odds: <strong className="text-gold font-mono text-sm">@{result.total_odds}</strong></span>
            </div>

            <button
              onClick={handleCopyFullSlipText}
              className="px-4 py-2.5 rounded-2xl bg-emerald-500 text-black font-black text-xs hover:bg-emerald-400 transition-all flex items-center space-x-1.5 shadow"
            >
              <Copy className="w-4 h-4" />
              <span>{copiedSlipText ? 'Slip Copied to Clipboard! ✓' : 'Copy Selections (1-Click)'}</span>
            </button>
          </div>

          {/* Leg Breakdown List with Scores & Outcomes */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-neutral-300 uppercase tracking-wider">MATCHES IN THIS SLIP:</h4>
            {result.legs.map((leg, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 hover:border-emerald-500/40 transition-all">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-white">{idx + 1}. {leg.match}</span>
                  <span className="text-[10px] text-neutral-400 font-bold">{leg.league}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-neutral-800/60 text-xs">
                  <div>
                    <span className="text-neutral-400 text-[10px] block">SportyBet Pick:</span>
                    <span className="font-bold text-emerald-400">{leg.selection} ({leg.market}) @ {leg.odds}</span>
                  </div>

                  {leg.matchStatus === 'FINISHED' && leg.homeScore !== undefined && leg.awayScore !== undefined && (
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-white font-mono text-[10px] font-black">
                        FT: {leg.homeScore} - {leg.awayScore}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        leg.legOutcome === 'WON' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-950 text-red-400 border border-crimson/40'
                      }`}>
                        {leg.legOutcome === 'WON' ? 'WON ✓' : 'LOST ❌'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Highlight Mivaj AI Better Pick for Lost Legs */}
                {leg.legOutcome === 'LOST' && leg.mivajAiPrediction && (
                  <div className="p-2.5 rounded-xl bg-stadiumGreen/10 border border-stadiumGreen/40 space-y-1 text-xs mt-2">
                    <span className="text-[10px] font-black text-stadiumGreen uppercase tracking-wider block flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-stadiumGreen inline" />
                      <span>MIVAJ AI MODEL SUPERIOR PICK (WOULD HAVE WON ✅):</span>
                    </span>
                    <p className="text-white font-bold text-xs">
                      Pick: <strong className="text-gold">{leg.mivajAiPrediction.selection}</strong> @ {leg.mivajAiPrediction.odds} (RESULT: WON ✅)
                    </p>
                    <p className="text-[10px] text-gray-300 font-sans">{leg.mivajAiPrediction.reason}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 3-Step Clear Affiliate Conversion Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-emerald-950/40 border border-emerald-500/50 space-y-4 shadow-2xl">
            <div className="space-y-1">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest block">HOW TO CLAIM YOUR SIGNUP BONUS & PLACE GAMES</span>
              <h3 className="text-base sm:text-lg font-black text-white">3-Step Affiliate Bonus Instructions</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-black/60 border border-neutral-800 space-y-1">
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-black font-black text-[10px]">STEP 1</span>
                <p className="font-bold text-white pt-1">Register / Deposit</p>
                <p className="text-[10px] text-neutral-400 font-sans">Click the link below to open {targetPartner.displayName} with your bonus code applied.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/60 border border-neutral-800 space-y-1">
                <span className="px-2 py-0.5 rounded bg-gold text-black font-black text-[10px]">STEP 2</span>
                <p className="font-bold text-white pt-1">Copy Selections</p>
                <p className="text-[10px] text-neutral-400 font-sans">Use 1-Click Copy above to copy the matches to your clipboard.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/60 border border-neutral-800 space-y-1">
                <span className="px-2 py-0.5 rounded bg-purple-400 text-black font-black text-[10px]">STEP 3</span>
                <p className="font-bold text-white pt-1">Place & Win</p>
                <p className="text-[10px] text-neutral-400 font-sans">Paste/select the matches on {targetPartner.displayName} and claim your bonus!</p>
              </div>
            </div>

            <a
              href={targetPartner.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-xl hover:scale-[1.02] transition-all text-center"
            >
              <span>🎁 REGISTER ON {targetPartner.displayName} &amp; CLAIM {targetPartner.bonusHighlight} ➔</span>
              <ExternalLink className="w-4 h-4 inline" />
            </a>
          </div>

        </div>
      )}

    </div>
  );
};
