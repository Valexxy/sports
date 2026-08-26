'use client';

import React, { useState } from 'react';
import { ArrowRightLeft, Sparkles, Zap, Shield, RefreshCw } from 'lucide-react';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';
import { AFFILIATE_REGISTRY } from '../../utils/affiliates';
import { ConversionResponse } from '../../app/api/converter/translate/route';
import { ResultCard } from './ResultCard';
import { FallbackBanner } from './FallbackBanner';

export const CodeConverterForm: React.FC = () => {
  const [source, setSource] = useState('BET9JA');
  const [target, setTarget] = useState('22BET');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [interstitialStep, setInterstitialStep] = useState(0);
  const [result, setResult] = useState<ConversionResponse | null>(null);
  const [error, setError] = useState('');

  const bookmakerOptions = Object.values(AFFILIATE_REGISTRY);

  const steps = [
    'Connecting to origin bookmaker unauthenticated API...',
    'Normalizing proprietary market IDs to Mivaj Schema...',
    'Matching fixtures & liquidity on ' + (AFFILIATE_REGISTRY[target]?.shortName || target) + '...',
    'Generating target cart booking code...',
  ];

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter a booking code (e.g. B9-77492)');
      return;
    }

    setError('');
    setResult(null);
    setLoading(true);
    setInterstitialStep(0);
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playTabClickSound();

    // 3,000ms multi-step interstitial for Ezoic ad yield
    const interval = setInterval(() => {
      setInterstitialStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 750);

    try {
      const res = await fetch('/api/converter/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, target, code: code.trim() }),
      });

      const data = await res.json();

      setTimeout(() => {
        clearInterval(interval);
        setLoading(false);
        if (res.ok) {
          setResult(data);
          phoneHardware.triggerHaptic('SUCCESS');
          stadiumAudio.playBookmarkSound();
        } else {
          setError(data.error || 'Conversion failed. Please check code.');
        }
      }, 3000);
    } catch (err) {
      clearInterval(interval);
      setLoading(false);
      setError('Network error converting code. Please retry.');
    }
  };

  const handleSwap = () => {
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playTabClickSound();
    const temp = source;
    setSource(target);
    setTarget(temp);
  };

  return (
    <div className="space-y-6 font-mono text-xs max-w-2xl mx-auto">
      {/* Form Card */}
      <form onSubmit={handleConvert} className="p-5 sm:p-6 rounded-3xl bg-[#0d111a] border-2 border-stadiumGreen/40 shadow-2xl space-y-4 glow-emerald">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-stadiumGreen/20 text-stadiumGreen">🔄</span>
            <span className="font-black text-white text-sm">Cross-Platform Code Converter</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen text-[10px] font-black border border-stadiumGreen/40">
            Instant 5-Bookie Parser
          </span>
        </div>

        {/* Source & Target Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-[10px] text-gray-400 block font-bold">SOURCE BOOKMAKER</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white font-bold text-xs focus:border-stadiumGreen focus:outline-none"
            >
              {bookmakerOptions.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.logoEmoji} {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-center pt-3 sm:pt-4">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-stadiumGreen border border-white/10 hover:rotate-180 transition-all shadow-md"
              title="Swap Platforms"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-[10px] text-gray-400 block font-bold">TARGET BOOKMAKER</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/60 border border-white/20 text-white font-bold text-xs focus:border-stadiumGreen focus:outline-none"
            >
              {bookmakerOptions.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.logoEmoji} {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Code Input */}
        <div className="space-y-1">
          <label className="text-[10px] text-gray-400 block font-bold">PASTE BOOKING CODE</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. B9-84721, SB-19284, 22B-99214..."
            className="w-full p-3.5 rounded-xl bg-black/70 border border-white/20 text-white font-mono text-sm uppercase tracking-wider placeholder-gray-500 focus:border-stadiumGreen focus:outline-none"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300 text-xs">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-stadiumGreen via-emerald-400 to-teal-400 hover:from-stadiumGreen/90 hover:to-emerald-300 text-black font-black text-sm flex items-center justify-center space-x-2 shadow-xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-black" />
              <span>Translating Betting Slip...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-black" />
              <span>Translate &amp; Convert Booking Code</span>
            </>
          )}
        </button>
      </form>

      {/* 3000ms Multi-Step Interstitial for Ezoic Ad Slot Yield */}
      {loading && (
        <div className="p-5 rounded-2xl bg-[#0d111a] border border-stadiumGreen/50 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between text-xs text-stadiumGreen font-black">
            <span>PARSER INTERSTITIAL &bull; STEP {interstitialStep + 1} OF 4</span>
            <span className="animate-pulse">Analyzing liquidity...</span>
          </div>

          <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-white/10">
            <div
              className="h-full bg-stadiumGreen transition-all duration-700"
              style={{ width: `${((interstitialStep + 1) / 4) * 100}%` }}
            />
          </div>

          <p className="text-xs text-gray-300 font-sans text-center">
            {steps[interstitialStep]}
          </p>

          {/* Ezoic Ad Placeholder during interstitial */}
          <div className="p-3 rounded-xl bg-black/40 border border-dashed border-white/10 text-center text-[10px] text-gray-500 font-sans">
            [ Verified Sportsbook Affiliate Wire • Ad Slot #CONV-01 ]
          </div>
        </div>
      )}

      {/* Fallback Banner if Partial Success */}
      {result && result.partial_success && (
        <FallbackBanner
          reason={result.missingMarketsReason}
          alternative={result.suggestedAlternative}
        />
      )}

      {/* Result Card */}
      {result && <ResultCard result={result} />}
    </div>
  );
};
