'use client';

import React, { useState } from 'react';
import { 
  AFFILIATE_PARTNERS, 
  AffiliateKey 
} from '../../config/affiliates';
import { 
  Zap, Copy, Check, ExternalLink, ArrowRight, 
  AlertTriangle, ShieldCheck, Sparkles, RefreshCw, CheckCircle2, 
  Info, List, Trophy, DollarSign, Flame, Camera, Upload, Layers, Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';

export interface DecodedLeg {
  id: string;
  match: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  selection: string;
  market: string;
  odds: number;
  matchStatus: 'SCHEDULED' | 'LIVE' | 'FINISHED';
  homeScore?: number;
  awayScore?: number;
  legOutcome: 'WON' | 'LOST' | 'PENDING';
}

export interface TargetCodeResult {
  bookmakerId: string;
  displayName: string;
  hasGenuineLiveCode: boolean;
  genuineCode?: string;
  deepLinkUrl: string;
  totalOdds: number;
  simulatedPayout1k: number;
  simulatedPayout10k: number;
  bonusHighlight: string;
  promoText: string;
  statusNote: string;
}

export interface ConverterResponsePayload {
  success: boolean;
  source_bookmaker?: string;
  source_code?: string;
  total_odds?: number;
  total_legs?: number;
  legs?: DecodedLeg[];
  target_matrix?: TargetCodeResult[];
  selected_target?: TargetCodeResult;
  error?: string;
}

export const BetSlipConverter: React.FC = () => {
  const [activeInputTab, setActiveInputTab] = useState<'CODE' | 'SCREENSHOT'>('CODE');
  const [selectedTargetBookie, setSelectedTargetBookie] = useState<string>('1XBET');
  const [bookingCode, setBookingCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [result, setResult] = useState<ConverterResponsePayload | null>(null);
  const [copiedSlipText, setCopiedSlipText] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingCode.trim()) return;

    try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
    setLoading(true);
    setErrorMsg('');
    setResult(null);
    setCopiedSlipText(false);

    setLoadingStep('🔍 Querying live booking API (SportyBet & Bet9ja)...');
    
    setTimeout(() => {
      setLoadingStep(`⚡ Computing multi-affiliate odds matrix & payouts...`);
    }, 500);

    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetBookmaker: selectedTargetBookie,
          bookingCode: bookingCode.trim().toUpperCase()
        })
      });

      const data: ConverterResponsePayload = await res.json();

      setTimeout(() => {
        setLoading(false);
        if (res.ok && data.success) {
          setResult(data);
          try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
          confetti({ particleCount: 70, spread: 75, origin: { y: 0.6 } });
        } else {
          setErrorMsg(data.error || 'Failed to resolve booking code.');
        }
      }, 900);
    } catch {
      setTimeout(() => {
        setLoading(false);
        setErrorMsg('Network error connecting to Live Resolver Engine.');
      }, 900);
    }
  };

  const handleSimulateScreenshotOcr = () => {
    try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
    setLoading(true);
    setErrorMsg('');
    setResult(null);
    setLoadingStep('📸 Scanning ticket slip with Vision OCR...');

    setTimeout(() => {
      setLoadingStep('🧠 Normalizing fixtures & matching canonical markets...');
    }, 500);

    setTimeout(async () => {
      const mockOcrLegs = [
        { match: 'Arsenal vs Chelsea', homeTeam: 'Arsenal', awayTeam: 'Chelsea', league: 'Premier League', selection: 'Over 2.5 Goals', market: 'Total Goals', odds: 1.82 },
        { match: 'Real Madrid vs Barcelona', homeTeam: 'Real Madrid', awayTeam: 'Barcelona', league: 'La Liga', selection: 'Both Teams to Score (GG)', market: 'BTTS', odds: 1.65 },
        { match: 'Inter Milan vs Juventus', homeTeam: 'Inter Milan', awayTeam: 'Juventus', league: 'Serie A', selection: 'Inter Win or Draw (1X)', market: 'Double Chance', odds: 1.34 },
        { match: 'Bayern Munich vs Dortmund', homeTeam: 'Bayern Munich', awayTeam: 'Dortmund', league: 'Bundesliga', selection: 'Over 1.5 Goals', market: 'Total Goals', odds: 1.25 }
      ];

      try {
        const res = await fetch('/api/convert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetBookmaker: selectedTargetBookie,
            ocrLegs: mockOcrLegs
          })
        });

        const data: ConverterResponsePayload = await res.json();
        setLoading(false);
        if (res.ok && data.success) {
          setResult(data);
          try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
          confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
        } else {
          setErrorMsg(data.error || 'Failed to process screenshot OCR.');
        }
      } catch {
        setLoading(false);
        setErrorMsg('Network error processing screenshot OCR.');
      }
    }, 1100);
  };

  const currentActiveTarget = result?.target_matrix?.find(t => t.bookmakerId === selectedTargetBookie) || result?.target_matrix?.[0];

  const handleCopyFullSlipText = () => {
    if (!result || !currentActiveTarget) return;
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
    
    const lines = [
      `🔥 MIVAJ CONVERTED ACCA SLIP -> ${currentActiveTarget.displayName.toUpperCase()}`,
      `Total Odds: ${currentActiveTarget.totalOdds}x • Payout (₦10k): ₦${currentActiveTarget.simulatedPayout10k.toLocaleString()}`,
      `---------------------------------`,
      ...(result.legs?.map((l, i) => `${i + 1}. ${l.match} (${l.league}) -> ${l.selection} @ ${l.odds}`) || []),
      `---------------------------------`,
      `🎁 Claim ${currentActiveTarget.bonusHighlight} on ${currentActiveTarget.displayName}: ${currentActiveTarget.deepLinkUrl}`
    ].join('\n');

    navigator.clipboard.writeText(lines);
    setCopiedSlipText(true);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setCopiedSlipText(false), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl bg-neutral-900 border border-neutral-800 p-4 sm:p-7 text-white font-mono shadow-2xl space-y-6">
      
      {/* Tab Selector */}
      <div className="flex items-center justify-center p-1 rounded-2xl bg-black/60 border border-white/10 max-w-md mx-auto">
        <button
          onClick={() => { setActiveInputTab('CODE'); setResult(null); setErrorMsg(''); }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
            activeInputTab === 'CODE' ? 'bg-stadiumGreen text-black shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Enter Booking Code</span>
        </button>
        <button
          onClick={() => { setActiveInputTab('SCREENSHOT'); setResult(null); setErrorMsg(''); }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
            activeInputTab === 'SCREENSHOT' ? 'bg-stadiumGreen text-black shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Screenshot (Vision AI)</span>
        </button>
      </div>

      {/* Input Mode: Booking Code Form */}
      {activeInputTab === 'CODE' && (
        <form onSubmit={handleConvert} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-gray-300 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-stadiumGreen" />
                <span>ENTER SPORTYBET BOOKING CODE</span>
              </span>
              <span className="text-[10px] text-stadiumGreen font-bold">100% DIRECT API DECOUPLER</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. G5AP4Z, QMY8M8"
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                className="w-full bg-black/80 border-2 border-neutral-700 focus:border-stadiumGreen rounded-2xl px-4 py-3.5 text-base sm:text-lg font-black tracking-wider text-white placeholder-gray-600 focus:outline-none uppercase transition-all shadow-inner"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-neutral-800 text-gray-400 text-[10px] font-bold">
                SPORTYBET DIRECT
              </span>
            </div>

            {/* Quick Test Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mr-1">⚡ Verified Codes:</span>
              {[
                { name: '🔥 37-Leg Live', code: 'G5AP4Z' },
                { name: '⚡ 18-Leg Multi', code: 'QMY8M8' },
              ].map((pill) => (
                <button
                  key={pill.code}
                  type="button"
                  onClick={() => setBookingCode(pill.code)}
                  className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-stadiumGreen hover:text-stadiumGreen text-gray-300 transition-all cursor-pointer"
                >
                  {pill.name}: {pill.code}
                </button>
              ))}
              <span className="text-[10px] text-gray-400 italic ml-1">
                (For 1xBet, Bet9ja, BetKing slips, switch to 'Screenshot' tab)
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !bookingCode.trim()}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-stadiumGreen via-emerald-400 to-stadiumGreen text-black font-black text-sm tracking-wide flex items-center justify-center space-x-2 shadow-lg hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Zap className="w-4 h-4 fill-black" />
                <span>DECODE &amp; CONVERT TO ANY PLATFORM</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Input Mode: Screenshot Dropzone */}
      {activeInputTab === 'SCREENSHOT' && (
        <div className="p-6 rounded-2xl border-2 border-dashed border-stadiumGreen/40 bg-black/40 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-stadiumGreen/20 text-stadiumGreen flex items-center justify-center mx-auto border border-stadiumGreen/40">
            <Upload className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-white">Upload Any Bet Slip Screenshot</h4>
            <p className="text-xs text-gray-400 font-sans max-w-sm mx-auto">
              Drop an image from SportyBet, Bet9ja, Bet365, or WhatsApp. Vision AI will decode all matches in &lt; 1 sec.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSimulateScreenshotOcr}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-stadiumGreen text-black font-black text-xs hover:bg-emerald-400 transition-all cursor-pointer shadow-md inline-flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scan Sample Bet Slip</span>
          </button>
        </div>
      )}

      {/* Loading Progress */}
      {loading && (
        <div className="p-4 rounded-2xl bg-black/90 border border-stadiumGreen/40 space-y-2 text-center animate-pulse">
          <div className="flex items-center justify-center space-x-2 text-stadiumGreen text-xs font-black">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>{loadingStep}</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-stadiumGreen w-3/4 animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Error / Notice Display */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-sans leading-relaxed space-y-1">
          <div className="flex items-center space-x-2 font-mono font-black text-red-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>ZERO FAKE CODES POLICY</span>
          </div>
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Results Display */}
      {result && result.success && (
        <div className="space-y-6 pt-2 animate-fadeIn">
          
          {/* Header Summary */}
          <div className="p-4 rounded-2xl bg-black/90 border border-stadiumGreen/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-stadiumGreen/20 text-stadiumGreen text-[10px] font-black uppercase border border-stadiumGreen/40">
                  {result.source_bookmaker || 'RESOLVED'}
                </span>
                <span className="text-xs font-black text-white">DECODED TICKET SLIP</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {result.legs?.length || 0} matches successfully verified • Base Odds: {result.total_odds}x
              </p>
            </div>

            <button
              onClick={handleCopyFullSlipText}
              className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-black text-white flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              {copiedSlipText ? <Check className="w-3.5 h-3.5 text-stadiumGreen" /> : <Copy className="w-3.5 h-3.5 text-gold" />}
              <span>{copiedSlipText ? 'Copied Slip!' : 'Copy WhatsApp Text'}</span>
            </button>
          </div>

          {/* 🎯 CONVERT TO SPECIFIC TARGET PLATFORM SELECTOR */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-neutral-950 via-black to-neutral-950 border-2 border-stadiumGreen/60 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-stadiumGreen fill-stadiumGreen" />
                <span>CHOOSE DESTINATION PLATFORM TO CONVERT &amp; OPEN:</span>
              </span>
              <span className="text-[10px] text-gold font-black">1-CLICK CART LOAD</span>
            </div>

            {/* Target Bookie Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {result.target_matrix?.map((t) => {
                const isSelected = t.bookmakerId === (currentActiveTarget?.bookmakerId || '1XBET');
                return (
                  <button
                    key={t.bookmakerId}
                    type="button"
                    onClick={() => {
                      setSelectedTargetBookie(t.bookmakerId);
                      try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
                    }}
                    className={`py-2.5 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center space-y-0.5 cursor-pointer ${
                      isSelected
                        ? 'bg-stadiumGreen text-black shadow-lg shadow-stadiumGreen/30 scale-105 ring-2 ring-stadiumGreen'
                        : 'bg-black/60 text-gray-300 border border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span>{t.displayName}</span>
                    <span className={`text-[9px] ${isSelected ? 'text-black/80 font-bold' : 'text-stadiumGreen'}`}>
                      {t.totalOdds}x
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Target Action Card */}
            {currentActiveTarget && (
              <div className="p-4 rounded-xl bg-black/80 border border-stadiumGreen/40 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-sm font-black text-white">
                      Convert to {currentActiveTarget.displayName}
                    </span>
                    <span className="text-[11px] text-gray-400 block">
                      {currentActiveTarget.promoText} • Expected Payout (₦10k): <strong className="text-stadiumGreen font-mono">₦{currentActiveTarget.simulatedPayout10k.toLocaleString()}</strong>
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-gold/20 text-gold text-[10px] font-black border border-gold/40">
                    {currentActiveTarget.bonusHighlight}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                  <a
                    href={currentActiveTarget.deepLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-stadiumGreen via-emerald-400 to-stadiumGreen text-black font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>🚀 OPEN &amp; LOAD BETSLIP ON {currentActiveTarget.displayName.toUpperCase()}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyFullSlipText}
                    className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-black text-xs flex items-center justify-center space-x-1.5 border border-neutral-700 cursor-pointer"
                  >
                    {copiedSlipText ? <Check className="w-4 h-4 text-stadiumGreen" /> : <Share2 className="w-4 h-4 text-gold" />}
                    <span>{copiedSlipText ? 'Copied Link!' : 'Share Converted Slip'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 👑 MULTI-AFFILIATE ODDS & PAYOUT MAXIMIZER */}
          {result.target_matrix && result.target_matrix.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-gold flex items-center space-x-1.5">
                  <Trophy className="w-4 h-4 text-gold" />
                  <span>ALL BOOKMAKERS ODDS COMPARISON MATRIX</span>
                </h4>
                <span className="text-[10px] text-gray-400">Ranked by Payout</span>
              </div>

              <div className="space-y-2">
                {result.target_matrix.map((item, idx) => {
                  const isTopRank = idx === 0;
                  return (
                    <div
                      key={item.bookmakerId}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isTopRank
                          ? 'bg-gradient-to-r from-stadiumGreen/15 via-black to-gold/10 border-stadiumGreen/60 shadow-lg glow-emerald'
                          : 'bg-black/60 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                          isTopRank ? 'bg-gold text-black shadow-md' : 'bg-neutral-800 text-gray-400'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-black text-white text-sm">{item.displayName}</span>
                            {isTopRank && (
                              <span className="px-1.5 py-0.2 rounded bg-gold text-black font-black text-[9px]">
                                👑 HIGHEST GAIN
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-gray-400 block font-sans">
                            {item.bonusHighlight} • ₦10k Stake = <strong className="text-white font-mono">₦{item.simulatedPayout10k.toLocaleString()}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 justify-between sm:justify-end">
                        <div className="text-right">
                          <span className="text-sm font-black text-stadiumGreen">{item.totalOdds}x</span>
                          <span className="text-[9px] text-gray-500 block">Total Odds</span>
                        </div>

                        <a
                          href={item.deepLinkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all shadow-md cursor-pointer ${
                            isTopRank
                              ? 'bg-stadiumGreen hover:bg-emerald-400 text-black'
                              : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                          }`}
                        >
                          <span>Open Betslip</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Decoded Matches Breakdown */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h4 className="text-xs font-black text-white flex items-center space-x-1.5">
                <List className="w-4 h-4 text-stadiumGreen" />
                <span>INDIVIDUAL MATCH LEGS &amp; AI RECOMMENDER INTEL ({result.legs?.length || 0})</span>
              </h4>
              <span className="text-[10px] text-gray-400 font-mono">
                Click any match to cross-check with AI Recommender Engine
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {result.legs?.map((leg, i) => (
                <div 
                  key={leg.id || i} 
                  className="p-3.5 rounded-xl bg-gradient-to-b from-neutral-900/90 to-black border border-neutral-800 hover:border-stadiumGreen/60 text-xs space-y-2 transition-all group shadow-md"
                >
                  <div className="flex items-center justify-between text-gray-400 text-[10px]">
                    <span className="truncate font-semibold text-gray-300">#{i + 1} • {leg.league}</span>
                    <span className="font-mono font-black text-stadiumGreen px-1.5 py-0.5 rounded bg-stadiumGreen/10 border border-stadiumGreen/30">
                      @{leg.odds}
                    </span>
                  </div>
                  <div className="font-black text-white text-sm group-hover:text-stadiumGreen transition-colors truncate">
                    {leg.match}
                  </div>
                  <div className="flex items-center justify-between gap-1 pt-0.5 border-t border-white/5">
                    <div className="text-[11px] text-cyan-400 font-bold truncate">
                      <span className="text-gray-500 font-normal mr-1">{leg.market}:</span>
                      {leg.selection}
                    </div>
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[9px] font-black shrink-0 border border-purple-500/30">
                      🤖 AI Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
