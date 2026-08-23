'use client';

import React from 'react';
import { Sparkles, Radio, Activity } from 'lucide-react';
import { useTranslation } from '../lib/translation-engine';

export const StadiumSmartPreloader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-6 font-mono text-center animate-fadeIn select-none">
      {/* Pulsing Neon Stadium Emblem */}
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-stadiumGreen via-panel to-gold p-1 animate-pulse shadow-2xl shadow-stadiumGreen/40">
          <div className="w-full h-full bg-void rounded-[22px] flex items-center justify-center text-3xl">
            ⚡
          </div>
        </div>
        <div className="absolute -inset-2 rounded-3xl border border-stadiumGreen/30 animate-ping pointer-events-none" />
      </div>

      {/* Title & Status */}
      <div className="space-y-2 max-w-sm">
        <h3 className="font-black text-base text-white uppercase tracking-widest flex items-center justify-center space-x-2">
          <span>AuraScore Stadium</span>
          <span className="px-2 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen text-[10px] font-black">2.0</span>
        </h3>
        <p className="text-xs text-gray-400 font-sans">
          {t('Synchronizing live fixtures, Poisson odds & referee feeds...')}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-2 bg-black/80 rounded-full overflow-hidden border border-white/10 p-0.5">
        <div className="h-full bg-gradient-to-r from-stadiumGreen via-emerald-400 to-gold rounded-full animate-progress" />
      </div>

      {/* Telemetry Micro-Badges */}
      <div className="flex items-center space-x-3 text-[10px] text-gray-500">
        <span className="flex items-center space-x-1 text-stadiumGreen font-bold">
          <Radio className="w-3 h-3 animate-pulse" />
          <span>ESPN In-Play: ACTIVE</span>
        </span>
        <span>&bull;</span>
        <span className="flex items-center space-x-1 text-gold font-bold">
          <Activity className="w-3 h-3" />
          <span>WAF Protected</span>
        </span>
      </div>
    </div>
  );
};
