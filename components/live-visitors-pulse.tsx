'use client';
import React, { useState, useEffect } from 'react';
import { Users, Flame, Globe2, Activity, Zap, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../lib/translation-engine';

interface FanActivityEvent {
  id: string;
  avatar: string;
  flag: string;
  username: string;
  action: string;
  timeAgo: string;
}

const SAMPLE_EVENTS: FanActivityEvent[] = [
  { id: '1', avatar: '⚡', flag: '🇳🇬', username: 'Chidi_99', action: 'Staked 1,000 Aura on Arsenal 1X Banker', timeAgo: '2s ago' },
  { id: '2', avatar: '🔥', flag: '🇬🇭', username: 'Kofi_Accra', action: 'Pinned Chelsea vs Man City for goal haptics', timeAgo: '6s ago' },
  { id: '3', avatar: '👑', flag: '🇰🇪', username: 'Ochieng_Nbo', action: 'Revealed SportyBet code in Code Converter', timeAgo: '11s ago' },
  { id: '4', avatar: '⚽', flag: '🇬🇧', username: 'Oliver_CFC', action: 'Checked into Supporter Pass (+500 Aura)', timeAgo: '18s ago' },
  { id: '5', avatar: '🦅', flag: '🇳🇬', username: 'Tunde_VIP', action: 'Unlocked 10-Odds Banker Accumulator', timeAgo: '24s ago' },
  { id: '6', avatar: '🇿🇦', flag: '🇿🇦', username: 'Siya_Dbn', action: 'Joined Official @mivajsport Telegram Wire', timeAgo: '31s ago' },
  { id: '7', avatar: '⭐', flag: '🇺🇸', username: 'Austin_MLS', action: 'Celebrated Star Birthday in Sports Almanac', timeAgo: '42s ago' },
];

export const LiveVisitorsPulse: React.FC = () => {
  const { t } = useTranslation();
  const [activeCount, setActiveCount] = useState(14842);
  const [peakToday, setPeakToday] = useState(48190);
  const [events, setEvents] = useState<FanActivityEvent[]>(SAMPLE_EVENTS);

  // Organic live counter oscillations (simulating active WebSocket connections)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCount((prev) => {
        const delta = Math.floor(Math.random() * 21) - 10; // -10 to +10
        const next = prev + delta;
        return next < 12000 ? 12450 : next > 18000 ? 17500 : next;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="my-6 rounded-3xl bg-gradient-to-br from-[#0a0f18] via-[#05070c] to-black border border-stadiumGreen/40 p-4 sm:p-6 shadow-2xl relative overflow-hidden font-mono text-white glow-emerald">
      {/* Background stadium light aura */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-stadiumGreen/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-3.5 h-3.5 rounded-full bg-stadiumGreen animate-ping absolute inset-0" />
            <div className="w-3.5 h-3.5 rounded-full bg-stadiumGreen relative" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center space-x-1.5">
                <span>STADIUM FAN PULSE</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40">
                  {t('LIVE')}
                </span>
              </h2>
            </div>
            <p className="text-[11px] text-gray-400 font-sans">
              Real-time fans worldwide viewing bankers, standings & injury wires
            </p>
          </div>
        </div>

        {/* Global Peak pill */}
        <div className="flex items-center space-x-2 bg-black/60 px-3 py-1.5 rounded-2xl border border-white/10">
          <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] text-gray-300">
            Peak Today: <strong className="text-white font-bold">{peakToday.toLocaleString()}</strong>
          </span>
        </div>
      </div>

      {/* Grid of Key Telemetry Numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 relative z-10">
        {/* Active Fans Online */}
        <div className="p-3.5 rounded-2xl bg-black/70 border border-stadiumGreen/30 space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase block flex items-center space-x-1">
            <Users className="w-3 h-3 text-stadiumGreen" />
            <span>Active Fans</span>
          </span>
          <div className="text-2xl sm:text-3xl font-black text-stadiumGreen">
            {activeCount.toLocaleString()}
          </div>
          <span className="text-[9px] text-gray-500 block font-sans">Live sessions in last 60s</span>
        </div>

        {/* Bankers Checked */}
        <div className="p-3.5 rounded-2xl bg-black/70 border border-gold/30 space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase block flex items-center space-x-1">
            <Zap className="w-3 h-3 text-gold" />
            <span>Bankers Staked</span>
          </span>
          <div className="text-2xl sm:text-3xl font-black text-gold">
            28,410
          </div>
          <span className="text-[9px] text-gray-500 block font-sans">Aura predictions entered</span>
        </div>

        {/* Top Region */}
        <div className="p-3.5 rounded-2xl bg-black/70 border border-white/10 space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase block flex items-center space-x-1">
            <Flame className="w-3 h-3 text-orange-400" />
            <span>Hot Region</span>
          </span>
          <div className="text-base sm:text-lg font-black text-white truncate pt-1">
            🇳🇬 West Africa (68%)
          </div>
          <span className="text-[9px] text-gray-500 block font-sans">Lagos, Accra, Abuja</span>
        </div>

        {/* Ref Ledger Verified */}
        <div className="p-3.5 rounded-2xl bg-black/70 border border-cyan-500/30 space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase block flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            <span>System Status</span>
          </span>
          <div className="text-base sm:text-lg font-black text-cyan-300 truncate pt-1">
            99.9% UPTIME
          </div>
          <span className="text-[9px] text-gray-500 block font-sans">Cloudflare Edge Shield</span>
        </div>
      </div>

      {/* Live Stream of Fan Activity Events */}
      <div className="pt-2 border-t border-white/10 relative z-10">
        <div className="flex items-center justify-between pb-2 text-[10px] text-gray-400 uppercase font-bold">
          <span className="flex items-center space-x-1.5">
            <Activity className="w-3 h-3 text-stadiumGreen animate-pulse" />
            <span>RECENT FAN CHECK-INS &amp; AURA STAKES</span>
          </span>
          <span className="text-stadiumGreen font-mono">LIVE FEED</span>
        </div>

        <div className="space-y-1.5 max-h-36 overflow-hidden">
          {events.slice(0, 4).map((ev) => (
            <div
              key={ev.id}
              className="flex items-center justify-between text-xs px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all"
            >
              <div className="flex items-center space-x-2 min-w-0">
                <span className="text-sm flex-shrink-0">{ev.flag}</span>
                <span className="font-bold text-white truncate text-[11px]">@{ev.username}</span>
                <span className="text-[11px] text-gray-400 font-sans truncate">{ev.action}</span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono flex-shrink-0 ml-2">{ev.timeAgo}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
