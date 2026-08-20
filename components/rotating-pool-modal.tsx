'use client';

import React, { useState } from 'react';
import { RotatingApiPoolEngine, RotatingPoolResponse } from '../lib/rotating-api-pool';
import { X, Cpu, Sparkles, RefreshCw, Zap, ShieldCheck } from 'lucide-react';

interface RotatingPoolModalProps {
  onClose: () => void;
}

export const RotatingPoolModal: React.FC<RotatingPoolModalProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [poolResult, setPoolResult] = useState<RotatingPoolResponse | null>(null);

  const handleTestRotatingPool = async () => {
    setLoading(true);
    const res = await RotatingApiPoolEngine.queryRotatingAiPool('Analyze Arsenal vs Chelsea xG tactical match breakdown in 2 sentences.');
    setPoolResult(res);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-stadiumGreen/50 p-6 shadow-2xl font-mono text-xs space-y-4">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-white/10 pb-3">
          <div className="p-2.5 rounded-xl bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40">
            <Cpu className="w-6 h-6 text-stadiumGreen" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-white">INTERNATIONAL ROTATING API POOL SYSTEM ⚡</h2>
            <p className="text-xs text-gray-400">Multi-Provider Failover: Groq AI ➔ Google Gemini ➔ HuggingFace ➔ Dixon-Coles</p>
          </div>
        </div>

        {/* Providers Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
          <div className="p-2.5 rounded-xl bg-panel border border-stadiumGreen/40 text-center">
            <span className="text-stadiumGreen font-bold block">PROVIDER 1</span>
            <strong className="text-white block mt-0.5">Groq Cloud AI</strong>
            <span className="text-[9px] text-stadiumGreen">ACTIVE (100%)</span>
          </div>

          <div className="p-2.5 rounded-xl bg-panel border border-gold/40 text-center">
            <span className="text-gold font-bold block">PROVIDER 2</span>
            <strong className="text-white block mt-0.5">Google Gemini</strong>
            <span className="text-[9px] text-gold">STANDBY (100%)</span>
          </div>

          <div className="p-2.5 rounded-xl bg-panel border border-cyberPurple/40 text-center">
            <span className="text-cyberPurple font-bold block">PROVIDER 3</span>
            <strong className="text-white block mt-0.5">Hugging Face</strong>
            <span className="text-[9px] text-cyberPurple">STANDBY (100%)</span>
          </div>

          <div className="p-2.5 rounded-xl bg-panel border border-white/20 text-center">
            <span className="text-gray-400 font-bold block">PROVIDER 4</span>
            <strong className="text-white block mt-0.5">QStash Queue</strong>
            <span className="text-[9px] text-gray-300">STREAMING</span>
          </div>
        </div>

        {/* Test Response Box */}
        {poolResult && (
          <div className="p-4 rounded-2xl bg-black/60 border border-stadiumGreen/40 space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-stadiumGreen font-bold">ROUTER ACTIVE PROVIDER: {poolResult.providerUsed}</span>
              <span className="text-gold font-bold">LATENCY: {poolResult.latencyMs}ms</span>
            </div>
            <p className="text-white font-sans text-xs leading-relaxed">
              "{poolResult.textResponse}"
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleTestRotatingPool}
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-stadiumGreen text-black font-black text-xs shadow-lg hover:scale-105 transition-all flex items-center justify-center space-x-2 glow-emerald"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Executing AI Provider Failover Test...' : 'Test AI Rotating Pool Failover ⚡'}</span>
        </button>

      </div>
    </div>
  );
};
