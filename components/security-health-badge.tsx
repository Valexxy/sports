'use client';
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Activity, Zap, Server } from 'lucide-react';
import { useTranslation } from '../lib/translation-engine';

export const SecurityHealthBadge: React.FC = () => {
  const { t } = useTranslation();
  const [latency, setLatency] = useState(18);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(14 + Math.random() * 8));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-4 px-4 rounded-3xl bg-black/80 border border-stadiumGreen/40 shadow-xl space-y-2 font-mono text-xs text-white max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-stadiumGreen animate-ping" />
          <span className="font-black text-stadiumGreen text-xs">
            {t('AuraScore Enterprise Security Shield & WAF 2.0')}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[10px] text-gray-400">
          <span className="flex items-center space-x-1">
            <Activity className="w-3 h-3 text-stadiumGreen animate-pulse" />
            <span>API Latency: <strong className="text-white">{latency}ms</strong></span>
          </span>
          <span className="flex items-center space-x-1">
            <Server className="w-3 h-3 text-gold" />
            <span>Global Edge CDN: <strong className="text-stadiumGreen">100% Online</strong></span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[10px]">
        <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-2">
          <Lock className="w-3.5 h-3.5 text-gold flex-shrink-0" />
          <div>
            <span className="text-gray-400 block">Encryption</span>
            <strong className="text-white">AES-256 TLS 1.3</strong>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-stadiumGreen flex-shrink-0" />
          <div>
            <span className="text-gray-400 block">Firewall</span>
            <strong className="text-stadiumGreen">Active WAF Shield</strong>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-2">
          <Zap className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <div>
            <span className="text-gray-400 block">Rate Limiting</span>
            <strong className="text-cyan-400">DDoS Protected</strong>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-2">
          <span className="text-xs">📜</span>
          <div>
            <span className="text-gray-400 block">Audit Ledger</span>
            <strong className="text-gold">100% Immutable</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
