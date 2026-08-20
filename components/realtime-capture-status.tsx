'use client';

import React, { useState } from 'react';
import { useRealtimeCapture } from '../lib/use-realtime-capture';
import { Radio, Activity, Cpu, Zap, Wifi, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

export const RealtimeCaptureStatus: React.FC = () => {
  const { telemetry } = useRealtimeCapture();
  const [isOpen, setIsOpen] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="glass-panel rounded-2xl p-3 sm:p-3.5 border border-stadiumGreen/40 font-mono text-xs shadow-xl space-y-2">
      
      {/* Main Status Bar with Collapsible Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer select-none"
      >
        
        {/* Left: Engine Status Badge */}
        <div className="flex items-center space-x-2.5">
          <div className="relative flex items-center justify-center">
            <div className={`w-3 h-3 rounded-full ${telemetry.isConnected ? 'bg-stadiumGreen animate-ping' : 'bg-gold animate-pulse'}`}></div>
            <div className={`w-2.5 h-2.5 rounded-full absolute ${telemetry.isConnected ? 'bg-stadiumGreen' : 'bg-gold'}`}></div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-white text-xs">REAL-TIME DATA CAPTURING ENGINE ⚡</span>
              <span className="px-2 py-0.2 rounded bg-stadiumGreen text-black font-black text-[9px]">
                {telemetry.isConnected ? 'ONLINE (1s SYNC)' : 'RECONNECTING'}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-sans hidden sm:block">
              Per-second live match event ingestion, sub-20ms edge streaming & automated referee settlement.
            </span>
          </div>
        </div>

        {/* Right: Live Telemetry Metrics & Collapse Button */}
        <div className="flex items-center space-x-3 self-stretch sm:self-auto justify-between sm:justify-end text-[10px]">
          
          <div className="flex items-center space-x-1.5 bg-black/60 px-2.5 py-1 rounded-xl border border-white/10">
            <Activity className="w-3 h-3 text-stadiumGreen animate-pulse" />
            <span className="text-gray-400">Rate:</span>
            <span className="text-white font-bold">{telemetry.packetsPerMin}</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-black/60 px-2.5 py-1 rounded-xl border border-white/10">
            <Wifi className="w-3 h-3 text-gold" />
            <span className="text-gray-400">Latency:</span>
            <span className="text-gold font-bold">{telemetry.latencyMs}ms</span>
          </div>

          <div className="flex items-center space-x-1 text-gray-400 text-xs font-bold px-2 py-1 rounded-lg bg-panel border border-white/10">
            <span className="hidden sm:inline">{isOpen ? 'Collapse' : 'Expand'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-stadiumGreen" /> : <ChevronDown className="w-3.5 h-3.5 text-gold" />}
          </div>

        </div>

      </div>

      {/* Expandable Live Ingestion Feeds Drawer (Collapsible) */}
      {isOpen && (
        <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-2 animate-fadeIn text-[10px]">
          <div className="p-2 rounded-xl bg-black/50 border border-white/5 space-y-0.5">
            <span className="text-gray-400 block font-bold">1. ESPN AKAMAI CDN</span>
            <span className="text-stadiumGreen font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-stadiumGreen"></span>
              <span>10s Ingest • 0 Quota Loss</span>
            </span>
          </div>

          <div className="p-2 rounded-xl bg-black/50 border border-white/5 space-y-0.5">
            <span className="text-gray-400 block font-bold">2. BBC SPORT LIVE WIRE</span>
            <span className="text-stadiumGreen font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-stadiumGreen"></span>
              <span>Sub-Second Goal Alerts</span>
            </span>
          </div>

          <div className="p-2 rounded-xl bg-black/50 border border-white/5 space-y-0.5">
            <span className="text-gray-400 block font-bold">3. OPEN-METEO WEATHER</span>
            <span className="text-gold font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
              <span>Stadium Temp & Rain Model</span>
            </span>
          </div>

          <div className="p-2 rounded-xl bg-black/50 border border-white/5 space-y-0.5">
            <span className="text-cyan-400 block font-bold">4. EDGE STREAM RELAY</span>
            <span className="text-cyan-400 font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>1,000 Client Broadcast/s</span>
            </span>
          </div>
        </div>
      )}

    </div>
  );
};
