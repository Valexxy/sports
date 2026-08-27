'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Search, Shield, Trophy, Activity, Calendar, ExternalLink, 
  Globe, RefreshCw, Sparkles, MapPin, Users, User, ArrowRight, 
  TrendingUp, Newspaper, Check, Star 
} from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { DeepClubDossier, ClubPlayerMember } from '../app/api/v1/clubs/[name]/route';

interface TeamExplorerModalProps {
  initialTeamName?: string;
  onClose: () => void;
}

export const TeamExplorerModal: React.FC<TeamExplorerModalProps> = ({ initialTeamName, onClose }) => {
  const [search, setSearch] = useState(initialTeamName || 'Chelsea');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SQUAD' | 'TROPHIES' | 'TRANSFERS' | 'NEWS'>('OVERVIEW');
  const [squadFilter, setSquadFilter] = useState<'ALL' | 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward'>('ALL');
  const [clubDossier, setClubDossier] = useState<DeepClubDossier | null>(null);
  const [loading, setLoading] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleFetchClubDossier = async (clubName: string) => {
    if (!clubName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/clubs/${encodeURIComponent(clubName.trim())}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setClubDossier(json.data);
        }
      }
    } catch (err) {
      console.warn('Club fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchClubDossier(initialTeamName || 'Chelsea');
  }, [initialTeamName]);

  const filteredSquad = (clubDossier?.squad || []).filter(p => {
    if (squadFilter !== 'ALL' && p.role !== squadFilter) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 animate-fadeIn overflow-y-auto font-mono">
      <div className="relative w-full max-w-4xl glass-panel-premium rounded-3xl border-2 border-stadiumGreen/70 p-4 sm:p-7 shadow-2xl my-auto text-white space-y-4 max-h-[92vh] flex flex-col justify-between">
        
        {/* Top Close Button & Header */}
        <div>
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-bold text-stadiumGreen uppercase">
                <Shield className="w-3.5 h-3.5" />
                <span>OFFICIAL CLUB DOSSIER • FULL SQUAD, TRANSFERS &amp; NEWS</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white truncate">
                {clubDossier?.name || 'CLUB DIRECTORY'} ({clubDossier?.league})
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-all flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="relative mt-3">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFetchClubDossier(search);
              }}
              placeholder="Search any club in the world (e.g. Chelsea, Arsenal, Real Madrid, Galatasaray, Lakers)..."
              className="w-full pl-10 pr-24 py-2.5 rounded-2xl bg-neutral-950 border border-neutral-700 text-xs text-white placeholder-gray-500 focus:border-stadiumGreen focus:outline-none font-mono"
            />
            <button
              type="button"
              onClick={() => handleFetchClubDossier(search)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-stadiumGreen text-black font-black text-[11px] hover:bg-emerald-400 transition-all"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
            </button>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pt-3 border-b border-white/10 pb-2.5 text-xs">
            {[
              { key: 'OVERVIEW', label: '📖 Overview & Stadium' },
              { key: 'SQUAD', label: `👥 Full Squad (${clubDossier?.squad?.length || 0})` },
              { key: 'TROPHIES', label: '🏆 Trophy Cabinet' },
              { key: 'TRANSFERS', label: '⚡ Transfers & Signings' },
              { key: 'NEWS', label: '📰 Latest Club News' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => {
                  phoneHardware.triggerHaptic('SELECTION');
                  setActiveTab(tab.key as any);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap text-[11px] ${
                  activeTab === tab.key
                    ? 'bg-stadiumGreen text-black font-black shadow-lg shadow-stadiumGreen/20'
                    : 'bg-neutral-900 text-gray-400 border border-neutral-800 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: OVERVIEW & STADIUM */}
        {activeTab === 'OVERVIEW' && clubDossier && (
          <div className="space-y-4 overflow-y-auto max-h-[50vh] pr-1">
            
            {/* Club Header Badge + Info */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center space-x-4">
              <img
                src={clubDossier.badgeUrl}
                alt={clubDossier.name}
                className="w-16 h-16 object-contain flex-shrink-0"
              />
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/30 font-bold uppercase">
                  {clubDossier.sport} • {clubDossier.country}
                </span>
                <h3 className="text-xl font-black text-white truncate">{clubDossier.name}</h3>
                <span className="text-xs text-gray-400 font-sans block">{clubDossier.league} • Founded {clubDossier.formedYear}</span>
              </div>
            </div>

            {/* Stadium, Capacity & Manager Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-sans">
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-0.5">
                <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-stadiumGreen" /> Home Ground / Stadium
                </span>
                <strong className="text-white text-xs block font-mono">{clubDossier.stadiumName}</strong>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-0.5">
                <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
                  <Users className="w-3.5 h-3.5 text-stadiumGreen" /> Seating Capacity
                </span>
                <strong className="text-white text-xs block font-mono">{clubDossier.stadiumCapacity} Seats</strong>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-0.5">
                <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
                  <User className="w-3.5 h-3.5 text-stadiumGreen" /> Head Coach / Manager
                </span>
                <strong className="text-stadiumGreen text-xs block font-mono">{clubDossier.manager}</strong>
              </div>
            </div>

            {/* Wikipedia Dossier */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1.5">
              <span className="text-xs font-black text-stadiumGreen flex items-center space-x-1.5 font-mono">
                <Globe className="w-3.5 h-3.5 text-stadiumGreen" />
                <span>WIKIPEDIA OVERVIEW &amp; CLUB HISTORY</span>
              </span>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                {clubDossier.description}
              </p>
            </div>

          </div>
        )}

        {/* Tab 2: FULL SQUAD & PLAYER CUTOUTS */}
        {activeTab === 'SQUAD' && clubDossier && (
          <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-1">
            
            {/* Position Filter Pills */}
            <div className="flex items-center space-x-1 overflow-x-auto text-[10px]">
              {(['ALL', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'] as const).map(pos => (
                <button
                  key={pos}
                  onClick={() => setSquadFilter(pos)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    squadFilter === pos
                      ? 'bg-gold text-black font-black'
                      : 'bg-neutral-900 text-gray-400 border border-neutral-800'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>

            {/* 3-Column Squad Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {filteredSquad.map(player => {
                const hasPhoto = player.photoUrl && !imgErrors[player.id];
                return (
                  <div
                    key={player.id}
                    className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center space-x-3 hover:border-stadiumGreen transition-all"
                  >
                    {hasPhoto ? (
                      <img
                        src={player.photoUrl}
                        alt={player.name}
                        className="w-12 h-12 rounded-xl object-cover object-top border border-white/10 bg-neutral-900 flex-shrink-0"
                        onError={() => setImgErrors(prev => ({ ...prev, [player.id]: true }))}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-stadiumGreen/40 flex items-center justify-center font-black text-xs text-stadiumGreen flex-shrink-0">
                        {player.fallbackInitials || '★'}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1">
                        <span className="px-1 py-0.2 rounded bg-white/10 text-[9px] font-black text-gold font-mono">
                          #{player.number}
                        </span>
                        <strong className="text-xs text-white truncate block">{player.name}</strong>
                      </div>
                      <span className="text-[10px] text-gray-400 block truncate">{player.position}</span>
                      <span className="text-[9px] text-stadiumGreen font-bold block">{player.nationality}</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Tab 3: TROPHY CABINET */}
        {activeTab === 'TROPHIES' && clubDossier && (
          <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {clubDossier.trophies.map((trophy, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-neutral-950 border border-gold/30 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{trophy.icon}</span>
                    <div>
                      <strong className="text-sm text-white block">{trophy.title}</strong>
                      <span className="text-[10px] text-gray-400 font-sans">Official Major Honor</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-xl bg-gold/20 text-gold font-black text-sm font-mono border border-gold/40">
                    {trophy.count}x Winner
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: TRANSFERS & SIGNINGS */}
        {activeTab === 'TRANSFERS' && clubDossier && (
          <div className="space-y-2.5 overflow-y-auto max-h-[50vh] pr-1">
            {clubDossier.transfers.map((tx, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                    tx.type === 'IN' ? 'bg-stadiumGreen text-black' : 'bg-red-500 text-white'
                  }`}>
                    {tx.type === 'IN' ? 'SIGNING' : 'DEPARTURE'}
                  </span>
                  <div>
                    <strong className="text-white text-xs block truncate">{tx.player}</strong>
                    <span className="text-[10px] text-gray-400 block truncate">From/To: {tx.fromOrTo}</span>
                  </div>
                </div>

                <span className="font-mono font-black text-stadiumGreen text-xs">
                  {tx.fee}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: LATEST CLUB NEWS */}
        {activeTab === 'NEWS' && clubDossier && (
          <div className="space-y-2.5 overflow-y-auto max-h-[50vh] pr-1">
            {clubDossier.news.map((item, idx) => (
              <a
                key={idx}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-stadiumGreen transition-all flex items-center justify-between group block"
              >
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center space-x-1.5 text-[10px] text-gray-400">
                    <Newspaper className="w-3 h-3 text-stadiumGreen" />
                    <span>{item.source} • {item.timeAgo}</span>
                  </div>
                  <h4 className="text-xs font-black text-white group-hover:text-stadiumGreen transition-colors truncate">
                    {item.title}
                  </h4>
                </div>

                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-stadiumGreen flex-shrink-0 ml-2" />
              </a>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
