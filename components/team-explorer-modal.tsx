'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  X, Search, Shield, Trophy, Activity, Calendar, ExternalLink, 
  Globe, RefreshCw, Sparkles, MapPin, Users, User, ArrowRight, 
  TrendingUp, Newspaper, Check, Star, BookOpen, MessageSquare, ChevronRight, FileText
} from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { DeepClubDossier, DeepTrophyDetail, DeepTransferRecord, DeepNewsArticle } from '../app/api/v1/clubs/[name]/route';

interface TeamExplorerModalProps {
  initialTeamName?: string;
  onClose: () => void;
  onSelectPlayer?: (playerName: string) => void;
}

export const TeamExplorerModal: React.FC<TeamExplorerModalProps> = ({ 
  initialTeamName, 
  onClose,
  onSelectPlayer 
}) => {
  const [search, setSearch] = useState(initialTeamName || 'Chelsea');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SQUAD' | 'TROPHIES' | 'TRANSFERS' | 'NEWS'>('OVERVIEW');
  const [squadFilter, setSquadFilter] = useState<'ALL' | 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward'>('ALL');
  const [clubDossier, setClubDossier] = useState<DeepClubDossier | null>(null);
  const [loading, setLoading] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  // Interactive Sub-Modals
  const [selectedTrophy, setSelectedTrophy] = useState<DeepTrophyDetail | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<DeepNewsArticle | null>(null);
  const [selectedTransfer, setSelectedTransfer] = useState<DeepTransferRecord | null>(null);

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

  const handlePlayerClick = (playerName: string) => {
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playCelebrateSound();
    if (onSelectPlayer) {
      onSelectPlayer(playerName);
    } else {
      window.location.href = `/players/${encodeURIComponent(playerName)}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 animate-fadeIn overflow-y-auto font-mono">
      <div className="relative w-full max-w-4xl glass-panel-premium rounded-3xl border-2 border-stadiumGreen/70 p-4 sm:p-7 shadow-2xl my-auto text-white space-y-4 max-h-[92vh] flex flex-col justify-between">
        
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-bold text-stadiumGreen uppercase">
                <Shield className="w-3.5 h-3.5" />
                <span>OFFICIAL CLUB DOSSIER • SQUAD, TRANSFERS, TROPHIES &amp; NEWS</span>
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

          {/* Search Bar */}
          <div className="relative mt-3">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFetchClubDossier(search);
              }}
              placeholder="Search any club in the world (e.g. Chelsea, Arsenal, Real Madrid, Galatasaray)..."
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
              { key: 'TROPHIES', label: `🏆 Trophy Cabinet (${clubDossier?.trophies?.length || 0})` },
              { key: 'TRANSFERS', label: `⚡ Transfers (${clubDossier?.transfers?.length || 0})` },
              { key: 'NEWS', label: `📰 Latest News (${clubDossier?.news?.length || 0})` }
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

        {/* Tab 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && clubDossier && (
          <div className="space-y-4 overflow-y-auto max-h-[50vh] pr-1">
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

        {/* Tab 2: FULL SQUAD (CLICKING ANY PLAYER OPENS FULL PROFILE) */}
        {activeTab === 'SQUAD' && clubDossier && (
          <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-1">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {filteredSquad.map(player => {
                const hasPhoto = player.photoUrl && !imgErrors[player.id];
                return (
                  <button
                    type="button"
                    key={player.id}
                    onClick={() => handlePlayerClick(player.name)}
                    className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-stadiumGreen hover:bg-neutral-900/80 transition-all flex items-center space-x-3 text-left group"
                    title={`Click to view ${player.name} full player profile & Wikipedia dossier`}
                  >
                    {hasPhoto ? (
                      <img
                        src={player.photoUrl}
                        alt={player.name}
                        className="w-12 h-12 rounded-xl object-cover object-top border border-white/10 bg-neutral-900 flex-shrink-0 group-hover:scale-105 transition-transform"
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
                        <strong className="text-xs text-white truncate block group-hover:text-stadiumGreen transition-colors">
                          {player.name}
                        </strong>
                      </div>
                      <span className="text-[10px] text-gray-400 block truncate">{player.position}</span>
                      <span className="text-[9px] text-stadiumGreen font-bold block">{player.nationality}</span>
                    </div>

                    <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-stadiumGreen flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: TROPHY CABINET (CLICKING ANY TROPHY OPENS INTERACTIVE WINNING FINALS DRAWER) */}
        {activeTab === 'TROPHIES' && clubDossier && (
          <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {clubDossier.trophies.map((trophy) => (
                <button
                  type="button"
                  key={trophy.id}
                  onClick={() => {
                    phoneHardware.triggerHaptic('SELECTION');
                    stadiumAudio.playCelebrateSound();
                    setSelectedTrophy(trophy);
                  }}
                  className="p-4 rounded-2xl bg-neutral-950 border border-gold/30 hover:border-gold hover:bg-neutral-900 transition-all flex items-center justify-between text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl group-hover:scale-110 transition-transform">{trophy.icon}</span>
                    <div>
                      <strong className="text-sm text-white block group-hover:text-gold transition-colors">{trophy.title}</strong>
                      <span className="text-[10px] text-gray-400 font-sans">Click to view winning finals &amp; history</span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-xl bg-gold/20 text-gold font-black text-xs font-mono border border-gold/40 flex items-center space-x-1">
                    <span>{trophy.count}x Winner</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: TRANSFERS & SIGNINGS (COMPREHENSIVELY EXPLAINED IN FULL) */}
        {activeTab === 'TRANSFERS' && clubDossier && (
          <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-1">
            {clubDossier.transfers.map((tx) => (
              <div
                key={tx.id}
                onClick={() => {
                  phoneHardware.triggerHaptic('SELECTION');
                  setSelectedTransfer(tx);
                }}
                className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-stadiumGreen hover:bg-neutral-900/60 transition-all space-y-2 cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase ${
                      tx.type === 'IN' ? 'bg-stadiumGreen text-black' : 'bg-red-500 text-white'
                    }`}>
                      {tx.type === 'IN' ? 'SIGNING' : 'DEPARTURE'}
                    </span>
                    <strong className="text-white text-sm block">{tx.player} ({tx.age} Yrs • {tx.nationality})</strong>
                  </div>

                  <span className="font-mono font-black text-stadiumGreen text-xs sm:text-sm">
                    {tx.fee}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-sans text-gray-300">
                  <div>
                    <span className="text-gray-500 font-bold block text-[10px]">CONTRACT &amp; DURATION:</span>
                    <span>{tx.contractLength}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold block text-[10px]">SOURCE / DESTINATION:</span>
                    <span>From/To: <strong>{tx.fromOrTo}</strong></span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs text-neutral-300 font-sans leading-relaxed">
                  <strong className="text-gold text-[10px] uppercase font-mono block">Tactical Role &amp; Squad Impact:</strong>
                  {tx.tacticalRole}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: LATEST NEWS (DIRECT INLINE NEWS READER ON THE WEBSITE) */}
        {activeTab === 'NEWS' && clubDossier && (
          <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-1">
            {clubDossier.news.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  phoneHardware.triggerHaptic('SELECTION');
                  setSelectedArticle(item);
                }}
                className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-stadiumGreen hover:bg-neutral-900/80 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center space-x-2 text-[10px] text-gray-400">
                    <Newspaper className="w-3.5 h-3.5 text-stadiumGreen" />
                    <span>{item.source} • {item.timeAgo} • {item.readTime}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-stadiumGreen transition-colors truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-sans line-clamp-1">
                    {item.summary}
                  </p>
                </div>

                <span className="px-3 py-1.5 rounded-xl bg-white/5 group-hover:bg-stadiumGreen group-hover:text-black text-stadiumGreen text-xs font-bold transition-all flex items-center space-x-1 ml-3 flex-shrink-0">
                  <span>Read Article</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* 🏆 SUB-MODAL 1: INTERACTIVE TROPHY HONORS DRAWER */}
      {selectedTrophy && (
        <div className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
          <div className="relative w-full max-w-xl glass-panel-premium rounded-3xl border-2 border-gold/70 p-5 sm:p-7 shadow-2xl my-auto text-white space-y-4">
            <button
              onClick={() => setSelectedTrophy(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3.5 border-b border-white/10 pb-3">
              <span className="text-4xl">{selectedTrophy.icon}</span>
              <div>
                <span className="text-[10px] font-black uppercase text-gold">OFFICIAL MAJOR HONOR</span>
                <h3 className="text-xl font-black text-white">{selectedTrophy.title}</h3>
                <span className="text-xs text-stadiumGreen font-bold font-mono">{selectedTrophy.count}x Total Wins ({selectedTrophy.winningYears.join(', ')})</span>
              </div>
            </div>

            <p className="text-xs text-neutral-300 font-sans leading-relaxed">
              {selectedTrophy.description}
            </p>

            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-black text-gold uppercase font-mono flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" /> Historic Championship Finals
              </span>

              <div className="space-y-2">
                {selectedTrophy.historicFinals.map((f, i) => (
                  <div key={i} className="p-3 rounded-2xl bg-neutral-950 border border-white/10 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-white text-xs">{f.year} Final vs {f.opponent}</strong>
                      <span className="px-2 py-0.5 rounded bg-stadiumGreen text-black font-black text-[10px]">{f.score}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 block">🏟️ {f.venue}</span>
                    <span className="text-[10px] text-gold font-bold block">👑 Winning Captain / Hero: {f.captain}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedTrophy(null)}
              className="w-full py-3 rounded-2xl bg-gold text-black font-black text-xs shadow-lg hover:brightness-110 transition-all"
            >
              Close Trophy Dossier
            </button>
          </div>
        </div>
      )}

      {/* 📰 SUB-MODAL 2: DIRECT ON-SITE NEWS ARTICLE READER */}
      {selectedArticle && (
        <div className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
          <div className="relative w-full max-w-2xl glass-panel-premium rounded-3xl border-2 border-stadiumGreen/70 p-5 sm:p-7 shadow-2xl my-auto text-white space-y-4 max-h-[88vh] overflow-y-auto">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1.5 border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2 text-[10px] text-stadiumGreen font-bold">
                <Newspaper className="w-3.5 h-3.5" />
                <span>{selectedArticle.source} • {selectedArticle.timeAgo} • By {selectedArticle.author}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                {selectedArticle.title}
              </h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-neutral-200 font-sans leading-relaxed">
              {selectedArticle.fullContent.split('\n\n').map((para, pIdx) => (
                <p key={pIdx}>{para}</p>
              ))}
            </div>

            {selectedArticle.keyQuotes && selectedArticle.keyQuotes.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-neutral-950 border border-gold/40 space-y-2">
                <span className="text-[10px] font-black text-gold uppercase font-mono block">VERIFIED PRESS QUOTES:</span>
                {selectedArticle.keyQuotes.map((quote, qIdx) => (
                  <blockquote key={qIdx} className="text-xs text-neutral-300 italic pl-3 border-l-2 border-gold font-sans">
                    {quote}
                  </blockquote>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="w-full py-3 rounded-2xl bg-stadiumGreen text-black font-black text-xs shadow-lg hover:brightness-110 transition-all"
            >
              Finished Reading
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
