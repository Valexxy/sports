'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Trophy, Heart, Search, Filter } from 'lucide-react';

export default function BirthdaysHubPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [selectedSport, setSelectedSport] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/v1/players')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) setPlayers(data.data);
      })
      .catch(() => {});
  }, []);

  const filtered = players.filter((p) => {
    const matchSport = selectedSport === 'ALL' || p.sport === selectedSport;
    const matchQuery = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.team_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSport && matchQuery;
  });

  return (
    <div className="min-h-screen bg-[#05070B] text-white font-mono pb-24">
      
      {/* Top Navbar */}
      <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stadium</span>
          </Link>
          <span className="text-xs font-black text-gold flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GLOBAL STAR BIRTHDAYS & WIKI</span>
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2 py-4">
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            🎂 STAR BIRTHDAY RADAR & WIKI
          </h1>
          <p className="text-xs text-gray-400 max-w-lg mx-auto">
            Explore deep player bios, career stats, and post moderated birthday wishes with instant 9:16 WhatsApp Status sharing cards!
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 glass-panel-premium p-3 rounded-2xl border border-white/10">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search star player..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/70 border border-white/10 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-stadiumGreen"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
            {['ALL', 'SOCCER', 'BASKETBALL', 'BASEBALL'].map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  selectedSport === sport
                    ? 'bg-stadiumGreen text-black shadow-md'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={`/players/${p.external_id || p.id}`}
              className="glass-panel-premium rounded-3xl border border-white/10 p-5 hover:border-stadiumGreen/70 transition-all hover:scale-[1.02] shadow-xl group flex flex-col justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-t from-black to-emerald-950 border border-stadiumGreen/50 overflow-hidden flex items-center justify-center flex-shrink-0">
                  <img
                    src={p.cutout_url || 'https://r2.thesportsdb.com/images/media/player/cutout/b16vvh1726053896.png'}
                    alt={p.name}
                    className="w-full h-full object-contain filter drop-shadow"
                  />
                </div>

                <div className="space-y-0.5 min-w-0 flex-1">
                  <span className="text-[10px] text-gold font-bold block">{p.team_name}</span>
                  <h3 className="font-black text-sm text-white truncate group-hover:text-stadiumGreen transition-colors">
                    {p.name} {p.country_flag}
                  </h3>
                  <span className="text-[10px] text-gray-400 block">{p.position}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-gold font-bold">🎂 {p.date_of_birth}</span>
                <span className="text-stadiumGreen font-black group-hover:translate-x-1 transition-transform">
                  View Wiki ➔
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>

    </div>
  );
}
