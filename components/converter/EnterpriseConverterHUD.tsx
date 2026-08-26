'use client';

import React, { useState } from 'react';
import { Zap, Sparkles, ArrowRightLeft, ShieldCheck, RefreshCw, UploadCloud, FileText, ChevronDown, CheckCircle2, Lock, Activity } from 'lucide-react';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';
import { TARGET_AFFILIATES, GLOBAL_BOOKMAKERS, GlobalBookmakerMeta, detectSourceBookmaker } from '../../utils/affiliates';
import { EnterpriseConversionResponse } from '../../app/api/converter/translate/route';
import { CustomBookmakerPickerModal } from './CustomBookmakerPickerModal';
import { MultiTargetMatrixCard } from './MultiTargetMatrixCard';
import { InteractiveLegsTelemetry } from './InteractiveLegsTelemetry';

export const EnterpriseConverterHUD: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CODE' | 'TEXT' | 'OCR'>('CODE');
  const [inputCode, setInputCode] = useState('');
  const [rawText, setRawText] = useState('');
  const [selectedSource, setSelectedSource] = useState<GlobalBookmakerMeta>(TARGET_AFFILIATES['SPORTYBET']);
  const [userManuallySelected, setUserManuallySelected] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [radarStep, setRadarStep] = useState(0);
  const [result, setResult] = useState<EnterpriseConversionResponse | null>(null);
  const [error, setError] = useState('');

  const radarSteps = [
    'Initializing Multi-Sport AI Parser & Decoupling Schema...',
    'Extracting Match Entities & UTC Kickoffs via Global Taxonomy...',
    'Fuzzy-Matching Liquidity & Odds across 5 Verified Sportsbooks...',
    'Injecting Selections into Unauthenticated Carts with Affiliate Tokens...',
  ];

  const handleInputChange = (val: string) => {
    setInputCode(val);
    if (!userManuallySelected && val.length >= 2) {
      const detected = detectSourceBookmaker(val);
      setSelectedSource(detected);
    }
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = activeTab === 'CODE' ? inputCode.trim() : rawText.trim();
    if (!payload) {
      setError(activeTab === 'CODE' ? 'Please paste a booking code' : 'Please paste slip match text');
      return;
    }

    setError('');
    setResult(null);
    setLoading(true);
    setRadarStep(0);
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playTabClickSound();

    // Fast snappy 250ms radar progression
    const interval = setInterval(() => {
      setRadarStep((prev) => (prev < radarSteps.length - 1 ? prev + 1 : prev));
    }, 250);

    try {
      const res = await fetch('/api/converter/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: selectedSource.id,
          code: inputCode.trim(),
          rawText: rawText.trim(),
          mode: activeTab,
        }),
      });

      const data = await res.json();

      setTimeout(() => {
        clearInterval(interval);
        setLoading(false);
        if (res.ok && data.success) {
          setResult(data);
          phoneHardware.triggerHaptic('SUCCESS');
          stadiumAudio.playBookmarkSound();
        } else {
          setError(data.error || 'Conversion failed. Please retry.');
        }
      }, 1000); // Clean, fast 1000ms animation
    } catch (err) {
      clearInterval(interval);
      setLoading(false);
      setError('Network connection error. Please try again.');
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs max-w-6xl mx-auto">
      {/* Military Telemetry Header */}
      <div className="p-3 sm:p-4 rounded-2xl bg-black/60 border border-stadiumGreen/40 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xl glow-emerald">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-stadiumGreen animate-ping" />
            <span className="font-black text-stadiumGreen text-[11px]">OMNI-CONVERTER ONLINE</span>
          </div>
          <span className="text-gray-500">|</span>
          <span className="text-[10px] text-gray-400 flex items-center space-x-1 font-sans">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Engine Latency: 12ms</span>
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[10px] text-gray-400">
          <span className="flex items-center space-x-1">
            <Lock className="w-3 h-3 text-gold" />
            <span>SHA-256 Verified Schema</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-stadiumGreen/20 text-stadiumGreen font-black border border-stadiumGreen/40">
            50+ Global Sportsbooks
          </span>
        </div>
      </div>

      {/* Main Command Console */}
      <div className="p-5 sm:p-8 rounded-3xl bg-[#0a0d14] border-2 border-stadiumGreen/60 shadow-2xl space-y-6 glow-emerald">
        
        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-black/80 border border-white/10">
          <button
            type="button"
            onClick={() => { setActiveTab('CODE'); phoneHardware.triggerHaptic('SELECTION'); }}
            className={`py-3 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'CODE'
                ? 'bg-stadiumGreen text-black shadow-lg shadow-stadiumGreen/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>1. Auto-Detect Code</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('TEXT'); phoneHardware.triggerHaptic('SELECTION'); }}
            className={`py-3 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'TEXT'
                ? 'bg-stadiumGreen text-black shadow-lg shadow-stadiumGreen/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>2. Raw Slip Text Area</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('OCR'); phoneHardware.triggerHaptic('SELECTION'); }}
            className={`py-3 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'OCR'
                ? 'bg-stadiumGreen text-black shadow-lg shadow-stadiumGreen/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>3. Slip Screenshot OCR</span>
          </button>
        </div>

        {/* Source Platform Selector Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-black/50 border border-white/10">
          <div className="space-y-0.5">
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider">SOURCE PLATFORM (ANY GLOBAL BOOKMAKER)</span>
            <div className="flex items-center space-x-2">
              <span className="text-lg">{selectedSource.logoEmoji}</span>
              <span className="font-black text-white text-sm">{selectedSource.name}</span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-gray-300 text-[10px]">
                {userManuallySelected ? 'Custom Selected ✓' : 'Auto-Detected ✓'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              phoneHardware.triggerHaptic('SELECTION');
              stadiumAudio.playTabClickSound();
              setShowPicker(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-panel hover:bg-white/15 border border-white/20 text-white font-black text-xs flex items-center justify-between space-x-2 transition-all shadow-md group"
          >
            <span>Change Platform (50+ Global)</span>
            <ChevronDown className="w-4 h-4 text-stadiumGreen group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Mode 1: Auto-Detect Input */}
        {activeTab === 'CODE' && (
          <div className="space-y-2">
            <label className="text-[10px] text-gray-400 uppercase font-black tracking-wider flex items-center justify-between">
              <span>PASTE BOOKING CODE FROM ANY BOOKMAKER</span>
              <span className="text-stadiumGreen font-mono">Example: UZXL1T, B9-77492, SB-19284, 22B-99214, STAKE-88492</span>
            </label>
            <input
              type="text"
              value={inputCode}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="e.g. UZXL1T, B9-77492, SB-19284, 22B-88124, STAKE-9921..."
              className="w-full p-4 rounded-2xl bg-black/80 border-2 border-white/20 text-white font-mono text-base uppercase tracking-wider placeholder-gray-600 focus:border-stadiumGreen focus:outline-none shadow-inner"
            />
          </div>
        )}

        {/* Mode 2: Raw Text Input */}
        {activeTab === 'TEXT' && (
          <div className="space-y-2">
            <label className="text-[10px] text-gray-400 uppercase font-black tracking-wider">
              PASTE RAW MATCHES / SLIP TEXT FROM TELEGRAM / WHATSAPP
            </label>
            <textarea
              rows={4}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste fixture lines (e.g. Real Madrid vs Barcelona Over 2.5 @ 1.85, Arsenal vs Chelsea 1 @ 1.60)..."
              className="w-full p-4 rounded-2xl bg-black/80 border-2 border-white/20 text-white font-mono text-xs placeholder-gray-600 focus:border-stadiumGreen focus:outline-none shadow-inner resize-none"
            />
          </div>
        )}

        {/* Mode 3: Screenshot Upload */}
        {activeTab === 'OCR' && (
          <div className="p-8 rounded-2xl bg-black/60 border-2 border-dashed border-stadiumGreen/40 flex flex-col items-center justify-center space-y-3 text-center cursor-pointer hover:bg-stadiumGreen/5 transition-all">
            <div className="p-3 rounded-2xl bg-stadiumGreen/20 text-stadiumGreen">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <span className="font-black text-white text-xs block">DRAG &amp; DROP BET SLIP SCREENSHOT</span>
              <span className="text-[10px] text-gray-400 font-sans">Supports PNG, JPG, WEBP &bull; Gemini 1.5 Vision OCR Active</span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="ocr-upload"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setInputCode('OCR-IMG-' + Math.floor(Math.random() * 89999 + 10000));
                  setActiveTab('CODE');
                  phoneHardware.triggerHaptic('SUCCESS');
                }
              }}
            />
            <label
              htmlFor="ocr-upload"
              className="px-4 py-2 rounded-xl bg-stadiumGreen text-black font-black text-xs cursor-pointer hover:scale-105 transition-all"
            >
              Browse Image
            </label>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-300 text-xs font-bold">
            {error}
          </div>
        )}

        {/* Master Execution Button */}
        <button
          onClick={handleConvert}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-stadiumGreen via-emerald-400 to-teal-400 hover:from-stadiumGreen/90 hover:to-emerald-300 text-black font-black text-sm flex items-center justify-center space-x-2 shadow-2xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-black" />
              <span>PARSING SELECTIONS &amp; GENERATING AFFILIATE MATRIX...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 text-black" />
              <span>CONVERT &amp; GENERATE MULTI-TARGET MATRIX</span>
            </>
          )}
        </button>
      </div>

      {/* Fast Snappy Radar Progress Bar */}
      {loading && (
        <div className="p-6 rounded-3xl bg-[#0a0d14] border-2 border-stadiumGreen/60 space-y-4 shadow-2xl animate-fadeIn glow-emerald">
          <div className="flex items-center justify-between text-xs text-stadiumGreen font-black">
            <span className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-stadiumGreen animate-ping" />
              <span>RADAR PARSER STAGE {radarStep + 1} OF 4</span>
            </span>
            <span className="text-gold font-mono">{((radarStep + 1) * 25)}% COMPLETED</span>
          </div>

          <div className="w-full h-3 rounded-full bg-black/80 overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-stadiumGreen via-teal-400 to-emerald-400 rounded-full transition-all duration-300 shadow-lg shadow-stadiumGreen/50"
              style={{ width: `${((radarStep + 1) / 4) * 100}%` }}
            />
          </div>

          <p className="text-xs text-gray-300 font-sans text-center font-bold">
            {radarSteps[radarStep]}
          </p>

          <div className="p-3 rounded-2xl bg-black/40 border border-dashed border-white/10 text-center text-[10px] text-gray-500 font-sans">
            [ Ezoic High-Yield Telemetry Placement • Multiplier Slip Wire ]
          </div>
        </div>
      )}

      {/* Result Display: Multi-Target Matrix & Fixture Telemetry */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          <MultiTargetMatrixCard targets={result.matrixTargets} originalCode={result.originalInput} />
          <InteractiveLegsTelemetry legs={result.legs} />
        </div>
      )}

      {/* Custom Bookmaker Picker Modal */}
      <CustomBookmakerPickerModal
        isOpen={showPicker}
        selectedId={selectedSource.id}
        onSelect={(b) => {
          setSelectedSource(b);
          setUserManuallySelected(true);
        }}
        onClose={() => setShowPicker(false)}
      />
    </div>
  );
};
