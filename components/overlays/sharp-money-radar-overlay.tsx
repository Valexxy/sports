'use client';

import React from 'react';
import { X, Zap, ShieldAlert, Activity, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface SharpMoneyRadarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIGNALS = [
  { match: 'Arsenal vs Chelsea', market: 'Arsenal Win (1)', movement: '1.85 ➔ 1.62 (-12%)', volume: '₦14.2M Sharp Volume', alert: 'HEAVY STEAM 🚨' },
  { match: 'Real Madrid vs Barcelona', market: 'Over 2.5 Goals', movement: '1.75 ➔ 1.55 (-11%)', volume: '₦28.5M Syndicates', alert: 'SHARP INFLOW ⚡' },
  { match: 'Bayern Munich vs Dortmund', market: 'Bayern -1.5 AH', movement: '2.10 ➔ 1.88 (-10%)', volume: '₦9.8M Sharp Volume', alert: 'LINE SHIFT 📉' },
];

export const SharpMoneyRadarOverlay: React.FC<SharpMoneyRadarProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn font-mono text-white">
      <div className="glass-panel-premium max-w-xl w-full p-6 rounded-3xl border-2 border-gold/60 shadow-2xl space-y-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10"><X className="w-4 h-4" /></button>
        
        <div className="flex items-center space-x-2.5 border-b border-white/10 pb-3">
          <div className="p-2 rounded-xl bg-gold text-black font-black">
            ⚡
          </div>
          <div>
            <h3 className="font-black text-sm text-white">SHARP MONEY & LIQUIDITY RADAR</h3>
            <p className="text-[10px] text-gray-400 font-sans">
              Real-time syndicate line-movements and volume steam alerts
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {SIGNALS.map((sig, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-black/70 border border-white/10 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-white">{sig.match}</div>
                <div className="text-[10px] text-gray-400 font-sans">{sig.market} &bull; <strong className="text-stadiumGreen">{sig.movement}</strong></div>
                <div className="text-[9px] text-gray-500 font-mono">{sig.volume}</div>
              </div>

              <span className="px-2.5 py-1 rounded-xl bg-gold/20 text-gold text-[9px] font-black border border-gold/30">
                {sig.alert}
              </span>
            </div>
          ))}
        </div>

        <div className="text-[10px] text-gray-400 text-center pt-2 border-t border-white/10">
          Gated WebSocket stream &bull; 0.4ms Market Ingestion Latency
        </div>
      </div>
    </div>
  );
};
