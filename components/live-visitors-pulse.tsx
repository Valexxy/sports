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
  { id: '1', avatar: '⚡', flag: '🇳🇬', username: 'Chidi_99', action: 'Backed Arsenal 1X (+1,000 Aura)', timeAgo: '2s ago' },
  { id: '2', avatar: '🔥', flag: '🇬🇭', username: 'Kofi_Accra', action: 'Pinned Chelsea vs Man City for goal haptics', timeAgo: '6s ago' },
  { id: '3', avatar: '👑', flag: '🇰🇪', username: 'Ochieng_Nbo', action: 'Analyzed matchday form in Match Center', timeAgo: '11s ago' },
  { id: '4', avatar: '⚽', flag: '🇬🇧', username: 'Oliver_CFC', action: 'Checked into Supporter Pass (+500 Aura)', timeAgo: '18s ago' },
  { id: '5', avatar: '🦅', flag: '🇳🇬', username: 'Tunde_VIP', action: 'Unlocked 10-Odds Banker Accumulator', timeAgo: '24s ago' },
  { id: '6', avatar: '🇿🇦', flag: '🇿🇦', username: 'Siya_Dbn', action: 'Joined Official @mivajsport Telegram Wire', timeAgo: '31s ago' },
  { id: '7', avatar: '⭐', flag: '🇺🇸', username: 'Austin_MLS', action: 'Celebrated Star Birthday in Sports Almanac', timeAgo: '42s ago' },
];

const POOL_OF_LIVE_ACTIONS = [
  { flag: '🇳🇬', username: 'Chidi_99', action: 'Backed Arsenal 1X (+1,000 Aura)' },
  { flag: '🇬🇭', username: 'Kofi_Accra', action: 'Pinned Chelsea vs Man City for goal haptics' },
  { flag: '🇰🇪', username: 'Ochieng_Nbo', action: 'Analyzed matchday form in Match Center' },
  { flag: '🇬🇧', username: 'Oliver_CFC', action: 'Checked into Supporter Pass (+500 Aura)' },
  { flag: '🇳🇬', username: 'Tunde_VIP', action: 'Unlocked 10-Odds Banker Accumulator' },
  { flag: '🇿🇦', username: 'Siya_Dbn', action: 'Joined Official @mivajsport Telegram Wire' },
  { flag: '🇺🇸', username: 'Austin_MLS', action: 'Celebrated Star Birthday in Sports Almanac' },
  { flag: '🇳🇬', username: 'Emeka_PH', action: 'Backed Real Madrid Double Chance (+750 Aura)' },
  { flag: '🇰🇪', username: 'Brian_Mombasa', action: 'Checked Premier League Hospital Ward Wires' },
  { flag: '🇬🇭', username: 'Kwame_Kumasi', action: 'Backed Over 1.5 Goals in Serie A (+500 Aura)' },
  { flag: '🇬🇧', username: 'Declan_LDN', action: 'Analyzed xG Pitch Heatmap in Match Center' },
  { flag: '🇳🇬', username: 'Seyi_Ibadan', action: 'Joined Telegram Breaking News Channel' },
];

export const LiveVisitorsPulse: React.FC = () => {
  const { t } = useTranslation();
  const [activeCount, setActiveCount] = useState(14842);
  const [peakToday, setPeakToday] = useState(48190);
  const [events, setEvents] = useState<FanActivityEvent[]>(SAMPLE_EVENTS);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Dynamic live counter oscillations
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCount((prev) => {
        const delta = Math.floor(Math.random() * 21) - 10;
        const next = prev + delta;
        return next < 12000 ? 12450 : next > 18000 ? 17500 : next;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Moving dynamic recent fans activity feed (updates every 2.8s)
  useEffect(() => {
    const feedInterval = setInterval(() => {
      const randomItem = POOL_OF_LIVE_ACTIONS[Math.floor(Math.random() * POOL_OF_LIVE_ACTIONS.length)];
      const newEv: FanActivityEvent = {
        id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        avatar: '⚡',
        flag: randomItem.flag,
        username: randomItem.username,
        action: randomItem.action,
        timeAgo: 'Just now',
      };

      setEvents((prev) => {
        const updated = [newEv, ...prev.slice(0, 5)].map((item, idx) => ({
          ...item,
          timeAgo: idx === 0 ? 'Just now' : `${idx * 4 + 2}s ago`,
        }));
        return updated;
      });
    }, 2800);

    return () => clearInterval(feedInterval);
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

        {/* Global Peak pill & Collapse Button */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-black/60 px-3 py-1.5 rounded-2xl border border-white/10">
            <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] text-gray-300">
              Peak Today: <strong className="text-white font-bold">{peakToday.toLocaleString()}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-xs font-black transition-all flex items-center space-x-1 border border-white/10"
            title={isCollapsed ? 'Expand activity feed' : 'Collapse to 1 row'}
          >
            <span>{isCollapsed ? 'Live Feed ▾' : '1 Row (Compact) ▴'}</span>
          </button>
        </div>
      </div>

      {/* 1 Row of Key Telemetry Numbers (Always Visible for Instant Overview) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 relative z-10">
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

        {/* Multi Hot Regions */}
        <div className="p-3.5 rounded-2xl bg-black/70 border border-orange-500/30 space-y-1 sm:col-span-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase block flex items-center space-x-1">
            <Flame className="w-3 h-3 text-orange-400" />
            <span>Hot Regions (Multi-Regional Peak)</span>
          </span>
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30">
              🇳🇬 West Africa (58%)
            </span>
            <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/30">
              🇬🇧 UK &amp; Europe (24%)
            </span>
            <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              🇰🇪 East Africa (18%)
            </span>
          </div>
          <span className="text-[9px] text-gray-500 block font-sans pt-0.5">Lagos, London, Nairobi, Accra, Joburg</span>
        </div>

        {/* System Status */}
        <div className="p-3.5 rounded-2xl bg-black/70 border border-cyan-500/30 space-y-1">
          <span className="text-[10px] text-gray-400 font-bold uppercase block flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            <span>System Status</span>
          </span>
          <div className="text-xl sm:text-2xl font-black text-cyan-300 truncate pt-0.5">
            99.9% UPTIME
          </div>
          <span className="text-[9px] text-gray-500 block font-sans">Cloudflare Edge &bull; Zero Lag</span>
        </div>
      </div>

      {/* Dynamic Moving Live Stream of Fan Activity Events (Expandable) */}
      {!isCollapsed && (
        <div className="pt-2 border-t border-white/10 relative z-10 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 text-[10px] text-gray-400 uppercase font-bold">
            <span className="flex items-center space-x-1.5">
              <Activity className="w-3 h-3 text-stadiumGreen animate-pulse" />
              <span>RECENT FAN CHECK-INS &amp; LIVE PICKS</span>
            </span>
            <span className="text-stadiumGreen font-mono flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-stadiumGreen animate-ping inline-block" />
              <span>LIVE FEED</span>
            </span>
          </div>

          <div className="space-y-1.5 overflow-hidden">
            {events.slice(0, 4).map((ev) => (
              <div
                key={ev.id}
                className="flex items-center justify-between text-xs px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all duration-500 animate-fadeIn"
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
      )}
    </section>
  );
};
