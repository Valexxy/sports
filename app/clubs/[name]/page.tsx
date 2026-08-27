'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, Shield, Trophy, MapPin, Users, User, 
  Globe, ExternalLink, RefreshCw, Newspaper, Check, Star 
} from 'lucide-react';
import { phoneHardware } from '../../../lib/phone-hardware-engine';
import { DeepClubDossier } from '../../api/v1/clubs/[name]/route';

export default function StandaloneClubDossierPage() {
  const params = useParams();
  const rawClubName = (params?.name as string) || 'Chelsea';
  const clubName = decodeURIComponent(rawClubName).replace(/-/g, ' ');

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SQUAD' | 'TROPHIES' | 'TRANSFERS' | 'NEWS'>('OVERVIEW');
  const [squadFilter, setSquadFilter] = useState<'ALL' | 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward'>('ALL');
  const [clubDossier, setClubDossier] = useState<DeepClubDossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/clubs/${encodeURIComponent(clubName)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) setClubDossier(json.data);
        }
      } catch (err) {
        console.warn('Club fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [clubName]);

  const filteredSquad = (clubDossier?.squad || []).filter(p => {
    if (squadFilter !== 'ALL' && p.role !== squadFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#05070B] text-white font-mono pb-24">
      
      {/* Top Header Navigation */}
      <div className="sticky top-0 z-30 bg-black/85 backdrop-blur-xl border-b border-white/10 px-4 py-3 shadow-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/clubs"
            className="flex items-center space-x-2 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-stadiumGreen" />
            <span>Back to Clubs Directory</span>
          </Link>
          
          <div className="flex items-center space-x-3 text-xs font-black">
            <Link href="/players" className="text-gray-400 hover:text-white transition-colors">
              ★ Players
            </Link>
            <span className="text-stadiumGreen flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5" />
              <span>{clubDossier?.name || clubName} DOSSIER</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-stadiumGreen animate-spin mx-auto" />
            <p className="text-sm text-gray-400">Loading verified squad &amp; Wikipedia dossier for {clubName}...</p>
          </div>
        ) : clubDossier ? (
          <div className="space-y-6">
            
            {/* Club Banner Header */}
            <div className="p-6 rounded-3xl bg-neutral-950 border-2 border-stadiumGreen/60 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={clubDossier.badgeUrl}
                  alt={clubDossier.name}
                  className="w-20 h-20 object-contain flex-shrink-0"
                />
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/30 font-bold uppercase">
                      {clubDossier.sport} • {clubDossier.country}
                    </span>
                    <span className="text-xs text-gray-400">Est. {clubDossier.formedYear}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{clubDossier.name}</h1>
                  <span className="text-xs text-gray-300 font-sans block">{clubDossier.league}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {clubDossier.website && (
                  <a
                    href={clubDossier.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all flex items-center space-x-1.5 text-xs font-bold"
                  >
                    <Globe className="w-4 h-4 text-stadiumGreen" />
                    <span>Official Site</span>
                  </a>
                )}
              </div>
            </div>

            {/* Stadium & Head Coach Overview Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-stadiumGreen" /> Home Ground / Stadium
                </span>
                <strong className="text-white text-sm block font-mono">{clubDossier.stadiumName}</strong>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
                  <Users className="w-3.5 h-3.5 text-stadiumGreen" /> Seating Capacity
                </span>
                <strong className="text-white text-sm block font-mono">{clubDossier.stadiumCapacity} Seats</strong>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
                  <User className="w-3.5 h-3.5 text-stadiumGreen" /> Head Coach / Manager
                </span>
                <strong className="text-stadiumGreen text-sm block font-mono">{clubDossier.manager}</strong>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="flex items-center space-x-2 overflow-x-auto border-b border-white/10 pb-3 text-xs">
              {[
                { key: 'OVERVIEW', label: '📖 Overview & Wikipedia' },
                { key: 'SQUAD', label: `👥 Full Squad (${clubDossier.squad.length})` },
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
                  className={`px-4 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap text-xs ${
                    activeTab === tab.key
                      ? 'bg-stadiumGreen text-black font-black shadow-lg shadow-stadiumGreen/20'
                      : 'bg-neutral-900 text-gray-400 border border-neutral-800 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'OVERVIEW' && (
              <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-3">
                <h3 className="text-sm font-black text-stadiumGreen flex items-center space-x-2 font-mono">
                  <Globe className="w-4 h-4 text-stadiumGreen" />
                  <span>WIKIPEDIA CLUB HISTORY &amp; STATUS</span>
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                  {clubDossier.description}
                </p>
              </div>
            )}

            {/* TAB 2: FULL SQUAD */}
            {activeTab === 'SQUAD' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
                  {(['ALL', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'] as const).map(pos => (
                    <button
                      key={pos}
                      onClick={() => setSquadFilter(pos)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                        squadFilter === pos
                          ? 'bg-gold text-black font-black'
                          : 'bg-neutral-900 text-gray-400 border border-neutral-800'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredSquad.map(player => {
                    const hasPhoto = player.photoUrl && !imgErrors[player.id];
                    return (
                      <div
                        key={player.id}
                        className="p-4 rounded-3xl bg-neutral-950 border border-neutral-800 flex items-center space-x-3.5 hover:border-stadiumGreen transition-all"
                      >
                        {hasPhoto ? (
                          <img
                            src={player.photoUrl}
                            alt={player.name}
                            className="w-14 h-14 rounded-2xl object-cover object-top border border-white/10 bg-neutral-900 flex-shrink-0 shadow-md"
                            onError={() => setImgErrors(prev => ({ ...prev, [player.id]: true }))}
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-stadiumGreen/40 flex items-center justify-center font-black text-sm text-stadiumGreen flex-shrink-0">
                            {player.fallbackInitials || '★'}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-1.5">
                            <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] font-black text-gold font-mono">
                              #{player.number}
                            </span>
                            <strong className="text-xs font-black text-white truncate block">{player.name}</strong>
                          </div>
                          <span className="text-[11px] text-gray-400 block truncate">{player.position}</span>
                          <span className="text-[10px] text-stadiumGreen font-bold block">{player.nationality}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: TROPHIES */}
            {activeTab === 'TROPHIES' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {clubDossier.trophies.map((trophy, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-3xl bg-neutral-950 border border-gold/30 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3.5">
                      <span className="text-3xl">{trophy.icon}</span>
                      <div>
                        <strong className="text-sm font-black text-white block">{trophy.title}</strong>
                        <span className="text-xs text-gray-400 font-sans">Official Major Honor</span>
                      </div>
                    </div>

                    <span className="px-3.5 py-1.5 rounded-2xl bg-gold/20 text-gold font-black text-sm font-mono border border-gold/40">
                      {trophy.count}x Winner
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: TRANSFERS */}
            {activeTab === 'TRANSFERS' && (
              <div className="space-y-3">
                {clubDossier.transfers.map((tx, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase ${
                        tx.type === 'IN' ? 'bg-stadiumGreen text-black' : 'bg-red-500 text-white'
                      }`}>
                        {tx.type === 'IN' ? 'SIGNING' : 'DEPARTURE'}
                      </span>
                      <div>
                        <strong className="text-white text-xs sm:text-sm block truncate">{tx.player}</strong>
                        <span className="text-xs text-gray-400 block truncate">From/To: {tx.fromOrTo}</span>
                      </div>
                    </div>

                    <span className="font-mono font-black text-stadiumGreen text-xs sm:text-sm">
                      {tx.fee}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: NEWS */}
            {activeTab === 'NEWS' && (
              <div className="space-y-3">
                {clubDossier.news.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-stadiumGreen transition-all flex items-center justify-between group block"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center space-x-2 text-[10px] text-gray-400">
                        <Newspaper className="w-3.5 h-3.5 text-stadiumGreen" />
                        <span>{item.source} • {item.timeAgo}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-stadiumGreen transition-colors truncate">
                        {item.title}
                      </h4>
                    </div>

                    <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-stadiumGreen flex-shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            )}

          </div>
        ) : (
          <div className="py-24 text-center text-gray-500 text-xs">
            Club not found. <Link href="/clubs" className="text-stadiumGreen underline">Browse all clubs</Link>.
          </div>
        )}

      </div>
    </div>
  );
}
