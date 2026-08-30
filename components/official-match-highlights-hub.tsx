'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Play, Video, Sparkles, X, ShieldCheck, Share2, Search, Calendar, ChevronDown, RefreshCw, Radio } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';

interface HighlightItem {
  id: string;
  title: string;
  competition: string;
  thumbnail: string;
  date: string;
  rawDate: string;
  embedHtml: string;
}

type DateFilterType = 'ALL' | 'TODAY' | 'YESTERDAY' | 'WEEK';

export const OfficialMatchHighlightsHub: React.FC = () => {
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('ALL');
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [activeVideo, setActiveVideo] = useState<HighlightItem | null>(null);

  const fetchHighlights = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/highlights');
      const data = await res.json();
      if (data?.videos && Array.isArray(data.videos) && data.videos.length > 0) {
        const formatted: HighlightItem[] = data.videos.map((item: any, idx: number) => ({
          id: `hl-${idx}`,
          title: item.title?.replace(' - ', ' vs ') || 'Match Highlights',
          competition: 'Top Flight Highlights',
          thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
          date: item.date || 'Yesterday',
          rawDate: new Date(Date.now() - 86400000).toISOString(),
          embedHtml: `<iframe src="${item.embedUrl}" width="100%" height="100%" frameborder="0" allowfullscreen allow="autoplay; fullscreen"></iframe>`,
        }));
        setHighlights(formatted);
      } else {
        // Fallback to Scorebat if empty
        const sRes = await fetch('https://www.scorebat.com/video-api/v3/');
        const sData = await sRes.json();
        if (sData?.response && Array.isArray(sData.response)) {
          const sFormatted: HighlightItem[] = sData.response.map((item: any, idx: number) => ({
            id: `hl-${idx}`,
            title: item.title?.replace(' - ', ' vs ') || 'Match Highlights',
            competition: item.competition || 'Top European League',
            thumbnail: item.thumbnail || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
            date: item.date ? new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Recently Played',
            rawDate: item.date || new Date().toISOString(),
            embedHtml: item.videos?.[0]?.embed || '',
          }));
          setHighlights(sFormatted);
        }
      }
    } catch (e) {
      console.warn('Highlights fetch fallback active:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHighlights();
  }, []);

  // Filtered & Searched Highlights
  const filteredHighlights = useMemo(() => {
    return highlights.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || item.title.toLowerCase().includes(q) || item.competition.toLowerCase().includes(q);
      if (!matchesSearch) return false;

      if (dateFilter === 'ALL') return true;

      const itemTime = new Date(item.rawDate).getTime();
      const now = Date.now();
      const oneDay = 24 * 3600 * 1000;

      if (dateFilter === 'TODAY') {
        return now - itemTime < oneDay;
      }
      if (dateFilter === 'YESTERDAY') {
        return now - itemTime >= oneDay && now - itemTime < 2 * oneDay;
      }
      if (dateFilter === 'WEEK') {
        return now - itemTime < 7 * oneDay;
      }

      return true;
    });
  }, [highlights, searchQuery, dateFilter]);

  const handleOpenVideo = (item: HighlightItem) => {
    setActiveVideo(item);
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playAddPickSound();
  };

  return (
    <section className="glass-panel-premium rounded-3xl border-2 border-stadiumGreen/50 p-4 sm:p-6 space-y-4 font-mono text-xs text-white shadow-2xl glow-emerald">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-stadiumGreen via-gold to-emerald-500 text-black font-black text-xl shadow-lg">
            📺
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-black text-sm sm:text-base text-white">
                LATEST MATCH HIGHLIGHTS & GOALS THEATER 🎥
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-stadiumGreen text-black font-black text-[9px]">
                IN-APP HD RECAPS
              </span>
            </div>
            <p className="text-[10px] text-gray-300 font-sans mt-0.5">
              Watch official match highlights, search top teams, and backdate recent derbies with zero external redirects.
            </p>
          </div>
        </div>

        <button
          onClick={fetchHighlights}
          disabled={loading}
          className="p-2 rounded-xl bg-panel border border-white/10 text-stadiumGreen hover:bg-stadiumGreen/20 transition-all self-end sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search & Backdate Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3 rounded-2xl bg-black/60 border border-white/10">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(6);
            }}
            placeholder="Search match or league (e.g. Arsenal, PSG, La Liga)..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-black border border-white/15 text-white placeholder-gray-500 text-xs focus:border-stadiumGreen focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs px-1 rounded bg-white/10"
            >
              x
            </button>
          )}
        </div>

        {/* Backdate Quick Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: 'ALL', label: 'All Recaps' },
            { key: 'TODAY', label: "Today's Games" },
            { key: 'YESTERDAY', label: 'Yesterday' },
            { key: 'WEEK', label: 'This Week' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setDateFilter(tab.key as DateFilterType);
                setVisibleCount(6);
                phoneHardware.triggerHaptic('SELECTION');
              }}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all flex-shrink-0 ${
                dateFilter === tab.key
                  ? 'bg-stadiumGreen text-black shadow-md'
                  : 'bg-panel text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Video Cards Grid */}
      {loading ? (
        <div className="py-12 text-center space-y-2">
          <RefreshCw className="w-6 h-6 text-stadiumGreen animate-spin mx-auto" />
          <span className="text-[11px] text-gray-400">Loading verified official match streams...</span>
        </div>
      ) : filteredHighlights.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredHighlights.slice(0, visibleCount).map((item) => (
              <div
                key={item.id}
                onClick={() => handleOpenVideo(item)}
                className="group cursor-pointer rounded-2xl bg-black/80 border border-white/10 hover:border-stadiumGreen transition-all overflow-hidden shadow-lg flex flex-col justify-between"
              >
                {/* Thumbnail Container with Glowing Play Badge */}
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as any).src = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-stadiumGreen/90 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-gold font-bold text-[9px] border border-white/10 truncate max-w-[180px]">
                    {item.competition}
                  </div>

                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-stadiumGreen text-black font-black text-[9px]">
                    FULL RECAP 🎬
                  </div>
                </div>

                {/* Title & Info */}
                <div className="p-3 space-y-1">
                  <h3 className="font-black text-xs text-white group-hover:text-stadiumGreen transition-colors truncate">
                    {item.title}
                  </h3>
                  <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>{item.date}</span>
                    <span className="text-stadiumGreen font-bold">Watch In-App ➔</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Highlights Toggle */}
          {filteredHighlights.length > visibleCount && (
            <div className="text-center pt-2">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="px-6 py-2.5 rounded-2xl bg-stadiumGreen/20 hover:bg-stadiumGreen/30 border border-stadiumGreen/40 text-stadiumGreen font-black text-xs inline-flex items-center space-x-1.5 hover:scale-105 transition-all"
              >
                <span>Show More Highlights ({filteredHighlights.length - visibleCount} Remaining)</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        /* Clean "Not available now, return later" Fallback */
        <div className="py-12 text-center rounded-3xl bg-black/60 border border-white/10 space-y-3">
          <span className="text-4xl block">⏳</span>
          <h3 className="text-sm font-black text-white">
            Highlights not available now, return later.
          </h3>
          <p className="text-[11px] text-gray-400 max-w-sm mx-auto font-sans">
            Video streams are automatically processed within 15–30 minutes following full-time whistle.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setDateFilter('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-stadiumGreen text-black font-black text-xs hover:scale-105 transition-all"
          >
            View All Recent Highlights
          </button>
        </div>
      )}

      {/* Video Theater Modal (Zero Redirects Guarantee) */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-mono">
          <div className="relative w-full max-w-3xl glass-panel-premium rounded-3xl border-2 border-stadiumGreen p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-stadiumGreen animate-ping" />
                <h3 className="font-black text-sm sm:text-base text-white truncate max-w-[260px] sm:max-w-md">
                  {activeVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-2 rounded-full bg-panel hover:bg-white/10 text-gray-400 hover:text-white border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* In-App Native Player Container */}
            <div className="rounded-2xl overflow-hidden border border-white/20 bg-black shadow-inner relative">
              {activeVideo.embedHtml ? (
                (() => {
                  const srcMatch = activeVideo.embedHtml.match(/src=['"]([^'"]+)['"]/i);
                  const iframeSrc = srcMatch ? srcMatch[1] : '';

                  return (
                    <div className="space-y-2">
                      <div className="w-full aspect-video relative bg-black">
                        {iframeSrc ? (
                          <iframe
                            src={iframeSrc}
                            width="100%"
                            height="100%"
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        ) : (
                          <div
                            dangerouslySetInnerHTML={{ __html: activeVideo.embedHtml }}
                            className="w-full h-full"
                          />
                        )}
                      </div>

                      {/* Direct Stream Fallback Link (Guaranteed Zero-Block) */}
                      {iframeSrc && (
                        <div className="p-2.5 bg-black/80 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap text-xs">
                          <span className="text-[11px] text-gray-300 font-sans">
                            Having playback issues on your browser?
                          </span>
                          <a
                            href={iframeSrc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-stadiumGreen text-black font-black text-[11px] hover:bg-emerald-400 transition-all flex items-center space-x-1.5 shadow"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Play Full HD Stream ➔</span>
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div className="aspect-video flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <span className="text-4xl block">⚽</span>
                  <p className="text-xs text-gray-400 font-sans">Highlights are processing. Check back in a few moments.</p>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
              <span className="text-[10px] text-gray-400">
                HD Official Match Recap &bull; Mivaj Video Center
              </span>
              <button
                onClick={() => {
                  const text = `🔥 Watch ${activeVideo.title} match highlights live on Mivaj Sports! 👉 https://mivaj.com`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="px-4 py-2 rounded-xl bg-[#25D366] text-black font-black text-xs flex items-center space-x-1.5 shadow-md active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share to WhatsApp Status</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
