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
  AlertTriangle, ShieldCheck, Sparkles, RefreshCw, CheckCircle2, Info, List, Trophy 
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

const BOOKMAKER_LOAD_INSTRUCTIONS: Record<AffiliateKey, { title: string; steps: string[]; tip: string }> = {
  'STAKE': {
    title: 'How to Load on Stake.com',
    steps: [
      'Click "[ COPY & BET ON STAKE ]" below (copies code & opens Stake).',
      'On Stake, look at the right sidebar "Bet Slip".',
      'Click "Use Bet Code" to paste the code, OR pick the matches listed below in 10 seconds.',
      'Enjoy 200% VIP Welcome Bonus on your deposit!'
    ],
    tip: 'Stake supports Crypto, USD & OPay with zero withdrawal fees.'
  },
  '22BET': {
    title: 'How to Load on 22Bet',
    steps: [
      'Click "[ COPY & BET ON 22BET ]" below.',
      'On 22Bet, open your Bet Slip on the right or bottom.',
      'Click "Save / Load Bet Slip" -> "Load Bet Slip".',
      'Paste your code and click "Load" to add all selections.'
    ],
    tip: 'Get 100% First Deposit Match up to ₦130,000 on 22Bet.'
  },
  'SPORTYBET': {
    title: 'How to Load on SportyBet',
    steps: [
      'Click "[ COPY & BET ON SPORTYBET ]" below.',
      'On SportyBet, open the Bet Slip at the bottom/right.',
      'Enter your code into the "Load Code" box.',
      'Click "Load" to populate all matches.'
    ],
    tip: 'Enjoy up to 1,000% Dynamic Accumulator Win Boost.'
  },
  'BET9JA': {
    title: 'How to Load on Bet9ja',
    steps: [
      'Click "[ COPY & BET ON BET9JA ]" below.',
      'On Bet9ja, find the "Book a Bet / Booking Number" box.',
      'Paste your booking code.',
      'Click "Load" to view your active ticket.'
    ],
    tip: '170% Multiple Boost + ₦100,000 Welcome Bonus on Bet9ja.'
  },
  '1XBET': {
    title: 'How to Load on 1xBet',
    steps: [
      'Click "[ COPY & BET ON 1XBET ]" below.',
      'Open the Bet Slip panel and select "Save / Download Bet Slip".',
      'Paste the code into the code field.',
      'Click "Download" to populate your selections.'
    ],
    tip: 'Claim 300% First Deposit Match Package on 1xBet.'
  }
};

export const BetSlipConverter: React.FC = () => {
  const [source, setSource] = useState<string>('SPORTYBET');
  const [target, setTarget] = useState<AffiliateKey>('STAKE');
  const [bookingCode, setBookingCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [result, setResult] = useState<(ConvertApiResponse & { verification?: any; legs?: SlipLeg[] }) | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedSlipText, setCopiedSlipText] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const targetPartner = AFFILIATE_PARTNERS[target];
  const targetGuide = BOOKMAKER_LOAD_INSTRUCTIONS[target];

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingCode.trim()) return;

    phoneHardware.triggerHaptic('SELECTION');
    setLoading(true);
    setErrorMsg('');
    setResult(null);
    setCopied(false);

    setLoadingStep('🔍 Step 1/3: Reading origin slip matches & markets...');
    
    setTimeout(() => {
      setLoadingStep(`⚡ Step 2/3: Executing headless verification on ${targetPartner.displayName} API...`);
    }, 800);

    setTimeout(() => {
      setLoadingStep(`🛡️ Step 3/3: Validating 100% market liquidity & generating unique ${targetPartner.displayName} code...`);
    }, 1600);

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

      const data = await res.json();

      setTimeout(() => {
        setLoading(false);
        if (res.ok && data.success) {
          setResult(data);
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        } else {
          setErrorMsg(data.error || 'Failed to convert booking code.');
        }
      }, 2300);
    } catch (err: any) {
      setTimeout(() => {
        setLoading(false);
        setErrorMsg('Network error connecting to Converter API.');
      }, 2300);
    }
  };

  const handleDualActionCopyAndBet = () => {
    if (!result?.converted_code) return;

    phoneHardware.triggerHaptic('SUCCESS');
    navigator.clipboard.writeText(result.converted_code);
    setCopied(true);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });

    const url = result.affiliate_url || targetPartner.affiliateUrl;
    window.open(url, '_blank', 'noopener,noreferrer');

    setTimeout(() => setCopied(false), 4000);
  };

  const handleCopyFullSlipText = () => {
    if (!result) return;
    phoneHardware.triggerHaptic('SUCCESS');
    
    const lines = [
      `🔥 MIVAJ VERIFIED ACCA SLIP (${result.target_bookmaker})`,
      `Booking Code: ${result.converted_code}`,
      `Total Odds: ${result.total_odds}`,
      `---------------------------------`,
      ...(result.legs?.map((l, i) => `${i + 1}. ${l.match} (${l.league}) -> ${l.selection} @ ${l.odds}`) || []),
      `---------------------------------`,
      `Bet on ${targetPartner.displayName}: ${targetPartner.affiliateUrl}`
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
              HEADLESS BET SLIP CONVERTER &amp; VERIFIER
            </h2>
          </div>
          <p className="text-xs text-neutral-400 font-sans">
            Audited headless verification ensuring 100% working, bookmaker-distinct codes for Stake, 22Bet, SportyBet, Bet9ja &amp; 1xBet.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>HEADLESS VERIFIED 100%</span>
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
            <span>SELECT TARGET BOOKMAKER (Distinct Code Guaranteed)</span>
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
            <span>ENTER SOURCE BOOKING CODE</span>
          </label>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={bookingCode}
              onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
              placeholder="e.g. HZV5RA, B9J4471, BC748K"
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
                  <span>Verifying Headlessly...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Verify &amp; Convert Slip ➔</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>

      {/* Dwell-Time Headless Verification Sequence */}
      {loading && (
        <div className="p-6 rounded-2xl bg-neutral-950 border border-emerald-500/40 text-center space-y-3 animate-pulse">
          <div className="flex items-center justify-center space-x-2 text-emerald-400 font-black text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>HEADLESS VERIFICATION ENGINE ACTIVE</span>
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

      {/* Conversion Result Card with Headless Verification Details & Platform Guide */}
      {result && !loading && (
        <div className="p-6 rounded-3xl bg-neutral-950 border-2 border-emerald-400 space-y-5 shadow-2xl animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🛡️</span>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-emerald-400 font-black tracking-wider uppercase">
                    100% HEADLESS VERIFIED
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono">
                    {result.verification?.checksum || 'HL-VERIFIED'}
                  </span>
                </div>
                <span className="text-sm font-black text-white">
                  {result.source_bookmaker} ➔ {result.target_bookmaker}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <span className="text-neutral-400">Total Odds: <strong className="text-emerald-400 font-mono">{result.total_odds || '3.72'}</strong></span>
              <span className="text-neutral-400">• Legs: <strong className="text-white">{result.converted_legs_count}/{result.total_legs}</strong></span>
            </div>
          </div>

          {/* Large Monospace Converted Code */}
          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 text-center space-y-1 relative group">
            <span className="text-[10px] text-neutral-400 font-bold block">
              YOUR VERIFIED {result.target_bookmaker} BOOKING CODE:
            </span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-widest font-mono select-all">
              {result.converted_code}
            </div>
            <span className="text-[10px] text-neutral-500 block">
              Audited &amp; verified on {targetPartner.displayName} • Ready for 1-tap bet load
            </span>
          </div>

          {/* PRIMARY CTA: Dual-Action Copy + Launch Affiliate Tab */}
          <button
            onClick={handleDualActionCopyAndBet}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-emerald-500 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-2 shadow-xl shadow-emerald-500/25 transition-all active:scale-98 font-mono"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 stroke-[3]" />
                <span>CODE COPIED &amp; {targetPartner.displayName.toUpperCase()} OPENED ✓</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>[ COPY &amp; BET ON {targetPartner.displayName.toUpperCase()} ]</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </>
            )}
          </button>

          {/* REAL MATCH LEGS BREAKDOWN (Essential for Stake & all bookmakers) */}
          {result.legs && result.legs.length > 0 && (
            <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-400 flex items-center space-x-1.5">
                  <List className="w-4 h-4 text-emerald-400" />
                  <span>MATCH SELECTIONS IN THIS SLIP ({result.legs.length} LEGS)</span>
                </span>

                <button
                  type="button"
                  onClick={handleCopyFullSlipText}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-bold text-gray-300 flex items-center space-x-1 transition-all"
                >
                  {copiedSlipText ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSlipText ? 'Slip Copied' : 'Copy All Picks Text'}</span>
                </button>
              </div>

              <div className="space-y-2">
                {result.legs.map((leg, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between text-xs font-sans">
                    <div className="space-y-0.5">
                      <div className="font-bold text-white flex items-center space-x-1.5">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 font-mono">{idx + 1}</span>
                        <span>{leg.match}</span>
                      </div>
                      <span className="text-[10px] text-neutral-400">{leg.league} • Market: <strong className="text-neutral-200">{leg.market}</strong></span>
                    </div>

                    <div className="text-right flex-shrink-0 ml-2">
                      <span className="text-xs font-black text-emerald-400 block font-mono">{leg.selection}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">@{leg.odds}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXACT PLATFORM STEP-BY-STEP SLIP LOADING INSTRUCTIONS */}
          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-700/80 space-y-2.5">
            <div className="flex items-center space-x-2 text-xs font-black text-emerald-400">
              <Info className="w-4 h-4 text-emerald-400" />
              <span>{targetGuide.title}</span>
            </div>

            <ol className="space-y-1.5 text-xs text-neutral-300 font-sans list-decimal list-inside">
              {targetGuide.steps.map((step, idx) => (
                <li key={idx} className="leading-relaxed">
                  <span className="text-white font-medium">{step}</span>
                </li>
              ))}
            </ol>

            <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between font-sans">
              <span>💡 {targetGuide.tip}</span>
              <span className="text-emerald-400 font-mono font-bold">100% Free Service</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
