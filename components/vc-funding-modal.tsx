'use client';

import React from 'react';
import { X, Rocket, TrendingUp, Users, Cpu, ShieldCheck, Flame, Coins } from 'lucide-react';

interface VcFundingModalProps {
  onClose: () => void;
}

// Startup pitch metrics — the "billion-dollar" story for a zero-budget system.
const METRICS = [
  { icon: Users, label: 'Addressable Users', value: '4.5B', sub: 'Global football fans × betting market' },
  { icon: Coins, label: 'Operating Cost', value: '$0/mo', sub: '100% free API stack + edge caching' },
  { icon: Flame, label: 'Moats', value: '7', sub: 'Settlement oracle, FX, Naija voice, live feed' },
  { icon: Cpu, label: 'AI Predictor', value: '7-Factor', sub: 'World-class Dixon-Coles + momentum' },
  { icon: TrendingUp, label: 'Projected ARR', value: '$2.4M', sub: 'At 0.05% conversion, $4 avg order' },
  { icon: ShieldCheck, label: 'Compliance', value: '18+ Ready', sub: 'Responsible play + legal suite' },
];

const ROADMAP = [
  { phase: 'Seed', round: 'Pre-Seed', ask: '$150K', focus: 'Push notifications + league depth', status: 'Current' },
  { phase: 'Series A', round: 'Series A', ask: '$2.5M', focus: 'Mobile apps + bookmaker integrations', status: 'Next' },
  { phase: 'Scale', round: 'Series B', ask: '$12M', focus: 'Global expansion + fantasy sports', status: 'Future' },
];

export const VcFundingModal: React.FC<VcFundingModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-3xl glass-panel rounded-3xl border border-gold/40 p-6 shadow-2xl my-8 font-mono text-xs">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4 border-b border-white/10 pb-3">
          <div className="p-2.5 rounded-xl bg-gold/20 text-gold border border-gold/40">
            <Rocket className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-white">AURASCORE — INVESTOR PITCH DECK</h2>
            <p className="text-xs text-gray-400">A $0-budget system engineered to look & feel like a billion-dollar platform</p>
          </div>
        </div>

        {/* Elevator pitch */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-gold/15 via-panel to-stadiumGreen/15 border border-gold/30 mb-4">
          <span className="text-[10px] font-black text-gold uppercase tracking-wider">Elevator Pitch</span>
          <p className="text-white font-sans text-sm mt-1.5 leading-relaxed">
            AURASCORE turns the world's most popular sport into a real-time, voice-announced, stat-packed fan experience.
            Every goal, card, kickoff and whistle gets a premium popup FX + Naija Vibe voice commentary — powered entirely by
            free public sports data, client-side WebAudio, and a mathematically audited settlement oracle. Zero server costs,
            zero API bills, infinite ceiling.
          </p>
        </div>

        {/* Key metrics grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
          {METRICS.map((m) => (
            <div key={m.label} className="p-3 rounded-2xl bg-panel border border-white/10 hover:border-gold/40 transition-all">
              <m.icon className="w-4 h-4 text-gold mb-1.5" />
              <span className="block text-lg font-black text-white">{m.value}</span>
              <span className="block text-[10px] font-bold text-stadiumGreen">{m.label}</span>
              <span className="block text-[9px] text-gray-400 mt-0.5">{m.sub}</span>
            </div>
          ))}
        </div>

        {/* Roadmap */}
        <div className="mb-4">
          <span className="text-[10px] font-black text-gold uppercase tracking-wider block mb-2">Funding Roadmap</span>
          <div className="space-y-2">
            {ROADMAP.map((r) => (
              <div key={r.phase} className="flex items-center justify-between p-3 rounded-2xl bg-panel border border-white/10">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${r.status === 'Current' ? 'bg-gold text-black' : 'bg-white/10 text-gray-300'}`}>
                    {r.status.toUpperCase()}
                  </span>
                  <div>
                    <span className="font-black text-white text-xs block">{r.round} · {r.ask}</span>
                    <span className="text-[9px] text-gray-400">{r.focus}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zero-cost stack */}
        <div className="p-4 rounded-2xl bg-stadiumGreen/10 border border-stadiumGreen/30">
          <span className="text-[10px] font-black text-stadiumGreen uppercase tracking-wider">The 100% Free Stack</span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {['ESPN Public Scoreboard', 'Google Web Speech', 'WebAudio SFX', 'LocalStorage Cache', 'Vercel Free Tier', 'RSS News Feeds', 'CSS/Canvas FX', 'Service Worker PWA'].map((t) => (
              <span key={t} className="px-2 py-1 rounded-lg bg-black/40 border border-stadiumGreen/30 text-stadiumGreen font-bold text-[10px]">
                ✓ {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
