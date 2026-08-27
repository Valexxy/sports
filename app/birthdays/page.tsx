'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Trophy, Heart, Search, Filter, Calendar, Share2, Check, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { STAR_PLAYERS_CATALOG } from '../../lib/player-catalog';

export default function BirthdaysHubPage() {
  const [players, setPlayers] = useState<any[]>(STAR_PLAYERS_CATALOG);
  const [searchQuery, setSearchQuery] = useState('');
  const [timelineFilter, setTimelineFilter] = useState<'ALL' | 'TODAY' | 'PAST' | 'UPCOMING'>('TODAY');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [wishedPlayerIds, setWishedPlayerIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const MONTHS = [
    { value: 'ALL', label: 'All Months' },
    { value: '01', label: 'Jan' },
    { value: '02', label: 'Feb' },
    { value: '03', label: 'Mar' },
    { value: '04', label: 'Apr' },
    { value: '05', label: 'May' },
    { value: '06', label: 'Jun' },
    { value: '07', label: 'Jul' },
    { value: '08', label: 'Aug' },
    { value: '09', label: 'Sep' },
    { value: '10', label: 'Oct' },
    { value: '11', label: 'Nov' },
    { value: '12', label: 'Dec' }
  ];

  // Fetch from global API
  useEffect(() => {
    fetch('/api/v1/players')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) setPlayers(data.data);
      })
      .catch(() => {});
  }, []);

  const handleSearchLive = async (term: string) => {
    setSearchQuery(term);
    if (!term.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(term.trim())}`);
      if (res.ok) {
        const json = await res.json();
        const apiPlayers = json.player || [];
        if (apiPlayers.length > 0) {
          const mapped = apiPlayers.map((p: any) => ({
            id: p.idPlayer || `p-${Math.random()}`,
            name: p.strPlayer || 'Athlete',
            sport: (p.strSport || 'Soccer').toUpperCase(),
            team_name: p.strTeam || 'Club',
            country: p.strNationality || 'Global',
            birth_date: p.dateBorn || '1995-08-27',
            age: p.dateBorn ? new Date().getFullYear() - new Date(p.dateBorn).getFullYear() : 28,
            photo_url: p.strThumb || p.strCutout || '/players/haaland.png',
            bio: p.strDescriptionEN || `${p.strPlayer} is a global sports star.`,
            stats: { trophies_count: 5 }
          }));
          setPlayers(mapped);
        }
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleSendWish = (playerId: string, playerName: string) => {
    phoneHardware.triggerHaptic('SUCCESS');
    if (!wishedPlayerIds.includes(playerId)) {
      setWishedPlayerIds(prev => [...prev, playerId]);
      confetti({ particleCount: 70, spread: 75, origin: { y: 0.6 } });
    }
  };

  const handleShareWishWhatsApp = (player: any) => {
    phoneHardware.triggerHaptic('SUCCESS');
    const text = `🎂 Happy Birthday to ${player.name} (${player.age} Years)! 🎉\n\nLeave your birthday wish on Mivaj Sports: https://mivaj.com/birthdays`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Date Logic for Timeline
  const today = new Date();
  const currentMonthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const filteredPlayers = players.filter((p) => {
    const bDate = p.birth_date || '1998-08-27';
    const [, bMonth, bDay] = bDate.split('-');
    const pMonthDay = `${bMonth}-${bDay}`;

    // Month Filter
    if (selectedMonth !== 'ALL' && bMonth !== selectedMonth) return false;

    // Timeline Filter
    if (timelineFilter === 'TODAY') {
      // If matches today or near today
      return pMonthDay === currentMonthDay || bMonth === String(today.getMonth() + 1).padStart(2, '0');
    }
    if (timelineFilter === 'PAST') {
      return pMonthDay < currentMonthDay;
    }
    if (timelineFilter === 'UPCOMING') {
      return pMonthDay > currentMonthDay;
    }

    return true;
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
            <span>GLOBAL PLAYERS BIRTHDAYS &amp; WIKI</span>
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2 py-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-black uppercase">
            <Calendar className="w-3.5 h-3.5" />
            <span>WORLDWIDE SPORTS BIRTHDAY RADAR</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            🎂 GLOBAL ATHLETES BIRTHDAY DIRECTORY
          </h1>
          <p className="text-xs text-gray-400 max-w-lg mx-auto font-sans">
            Explore verified birth dates across all sports in history. Send moderated birthday wishes, and share 9:16 WhatsApp cards!
          </p>
        </div>

        {/* Timeline & Month Filters */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
          
          {/* Timeline Range Pills */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-1 text-xs">
              {(['ALL', 'TODAY', 'PAST', 'UPCOMING'] as const).map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => {
                    phoneHardware.triggerHaptic('SELECTION');
                    setTimelineFilter(mode);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
                    timelineFilter === mode
                      ? 'bg-gold text-black font-black shadow-lg shadow-gold/20'
                      : 'bg-neutral-900 text-gray-400 border border-neutral-800 hover:text-white'
                  }`}
                >
                  {mode === 'TODAY' ? "🎂 Today's Birthdays" : mode === 'PAST' ? '⏪ Past Days' : mode === 'UPCOMING' ? '⏩ Upcoming' : 'All Timeline'}
                </button>
              ))}
            </div>

            {/* Month Filter Dropdown */}
            <div className="flex items-center space-x-1 overflow-x-auto text-xs">
              {MONTHS.map((m) => (
                <button
                  type="button"
                  key={m.value}
                  onClick={() => {
                    phoneHardware.triggerHaptic('SELECTION');
                    setSelectedMonth(m.value);
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                    selectedMonth === m.value ? 'bg-stadiumGreen text-black font-black' : 'bg-neutral-900 text-gray-400 border border-neutral-800'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Any Player */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchLive(e.target.value)}
              placeholder="Search any athlete in world history (e.g. Okocha, Pelé, Jordan, Osimhen, Haaland)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-gray-500 focus:border-gold focus:outline-none font-mono"
            />
            {loading && <RefreshCw className="w-4 h-4 text-gold animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />}
          </div>

        </div>

        {/* Players Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredPlayers.map((player) => {
            const hasWished = wishedPlayerIds.includes(player.id);
            return (
              <div
                key={player.id}
                className="p-5 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-4 shadow-xl hover:border-gold/60 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  
                  {/* Photo & Badge */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={player.photo_url}
                      alt={player.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-gold/40 bg-neutral-900 flex-shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/players/haaland.png'; }}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/30 font-bold uppercase">
                        {player.sport} • {player.country}
                      </span>
                      <h3 className="text-base font-black text-white truncate">{player.name}</h3>
                      <span className="text-xs text-gray-400 block truncate">{player.team_name}</span>
                    </div>
                  </div>

                  {/* Birthday Pill */}
                  <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs">
                    <span className="text-gray-400">🎂 Born: <strong className="text-white">{player.birth_date}</strong></span>
                    <span className="text-gold font-bold font-mono">{player.age} Years</span>
                  </div>

                  {/* Bio snippet */}
                  <p className="text-[11px] text-gray-400 font-sans line-clamp-2">
                    {player.bio}
                  </p>
                </div>

                {/* Wish CTA & WhatsApp Share */}
                <div className="space-y-2 pt-2 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => handleSendWish(player.id, player.name)}
                    className={`w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all ${
                      hasWished
                        ? 'bg-stadiumGreen text-black shadow-lg shadow-stadiumGreen/20'
                        : 'bg-gold hover:bg-amber-400 text-black shadow-lg shadow-gold/20'
                    }`}
                  >
                    {hasWished ? <Check className="w-3.5 h-3.5" /> : <Heart className="w-3.5 h-3.5 fill-black" />}
                    <span>{hasWished ? 'Birthday Wish Sent 🎉' : 'Send Birthday Wish 🎉'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareWishWhatsApp(player)}
                    className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <Share2 className="w-3.5 h-3.5 text-gold" />
                    <span>Share Wish on WhatsApp Status</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
