'use client';
import React, { useState, useEffect } from 'react';
import { Users, Activity, Radio, MapPin } from 'lucide-react';
import { LiveUserTrackerEngine, LiveStats } from '../../lib/live-user-tracker';

export const LiveActiveFansWidget: React.FC = () => {
  const [stats, setStats] = useState<LiveStats>({
    onlineCount: 1,
    activeCities: ['Awka', 'Onitsha'],
    trendingMatches: [],
  });

  useEffect(() => {
    LiveUserTrackerEngine.init();
    const unsubscribe = LiveUserTrackerEngine.subscribe((updated) => {
      setStats(updated);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-black/60 border border-stadiumGreen/40 text-[10px] font-mono text-white shadow-md glow-emerald">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stadiumGreen opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-stadiumGreen"></span>
      </span>
      <div className="flex items-center space-x-1">
        <Users className="w-3 h-3 text-stadiumGreen" />
        <span className="font-black text-stadiumGreen">{stats.onlineCount.toLocaleString()}</span>
        <span className="text-gray-300 font-sans font-bold">Online Fans</span>
      </div>
      {stats.activeCities.length > 0 && (
        <span className="hidden sm:inline text-gray-500 font-sans text-[9px] border-l border-white/10 pl-2">
          📍 Active in <strong className="text-gray-300">{stats.activeCities.slice(0, 3).join(', ')}</strong>
        </span>
      )}
    </div>
  );
};
