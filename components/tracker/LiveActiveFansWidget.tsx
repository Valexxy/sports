'use client';
import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { LiveUserTrackerEngine, LiveStats } from '../../lib/live-user-tracker';

export const LiveActiveFansWidget: React.FC = () => {
  const [stats, setStats] = useState<LiveStats>({
    onlineCount: 1482,
    activeCities: ['Awka', 'Onitsha', 'Lagos'],
    trendingMatches: [],
  });

  useEffect(() => {
    LiveUserTrackerEngine.init();
    const unsubscribe = LiveUserTrackerEngine.subscribe((updated) => {
      if (updated && updated.onlineCount) {
        setStats(updated);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-2xl bg-black/70 border border-stadiumGreen/40 text-[10px] sm:text-xs font-mono text-white shadow-md glow-emerald max-w-full overflow-hidden">
      <span className="relative flex h-2 w-2 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stadiumGreen opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-stadiumGreen"></span>
      </span>
      <div className="flex items-center space-x-1 flex-shrink-0">
        <Users className="w-3 h-3 text-stadiumGreen flex-shrink-0" />
        <span className="font-black text-stadiumGreen">{stats.onlineCount.toLocaleString()}</span>
        <span className="text-gray-300 font-sans font-bold text-[10px] sm:text-xs">Online Fans</span>
      </div>
      {stats.activeCities.length > 0 && (
        <span className="text-gray-400 font-sans text-[9px] sm:text-[10px] border-l border-white/10 pl-1.5 sm:pl-2 truncate">
          📍 <span className="hidden xs:inline">Active in </span><strong className="text-gray-200">{stats.activeCities.slice(0, 3).join(', ')}</strong>
        </span>
      )}
    </div>
  );
};
