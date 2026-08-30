'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Play, Video, Sparkles, X, ShieldCheck, Search, Calendar, ChevronDown, RefreshCw, ExternalLink, Radio, Tv } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';

interface HighlightItem {
  id: string;
  title: string;
  competition: string;
  thumbnail: string;
  date: string;
  rawDate: string;
  embedUrl: string;
  youtubeUrl: string;
  directWatchUrl: string;
}

type DateFilterType = 'ALL' | 'TODAY' | 'YESTERDAY' | 'WEEK';
type StreamSource = 'YOUTUBE' | 'DAILYMOTION';

export const OfficialMatchHighlightsHub: React.FC = () => {
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('ALL');
  const [visibleCount, setVisibleCount] = useState<number>(6);
  const [activeVideo, setActiveVideo] = useState<HighlightItem | null>(null);
  const [currentStreamSource, setCurrentStreamSource] = useState<StreamSource>('YOUTUBE');

  const fetchHighlights = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/highlights');
      const data = await res.json();
      if (data?.videos && Array.isArray(data.videos) && data.videos.length > 0) {
        const formatted: HighlightItem[] = data.videos.map((item: any, idx: number) => {
          const rawTitle = item.title?.replace(/^Highlights_/i, '').replace(/_Matchday.*$/i, '').replace(/_ACT$/i, '').replace(' - ', ' vs ') || 'Match Highlights';
          return {
            id: `hl-${idx}`,
            title: rawTitle,
            competition: item.competition || 'Top Flight Highlights',
            thumbnail: item.thumbnail || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
            date: item.date || 'Recent',
            rawDate: new Date().toISOString(),
            embedUrl: `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(rawTitle + ' highlights official')}&autoplay=1`,
            youtubeUrl: `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(rawTitle + ' highlights')}&autoplay=1`,
            directWatchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(rawTitle + ' official match highlights recap')}`,
          };
        });
        setHighlights(formatted);
      }
    } catch (e) {
      console.warn('Highlights fetch notice:', e);
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
      return true;
    });
  }, [highlights, searchQuery]);

  const handleOpenVideo = (item: HighlightItem) => {
    setActiveVideo(item);
    setCurrentStreamSource('YOUTUBE');
    try {
      phoneHardware.triggerHaptic('SELECTION');
      stadiumAudio.playSelectGoalFx();
    } catch {}
  };

  return (
    <section className="space-y-4 font-mono">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-black/60 border border-white/10 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-stadiumGreen/20 border border-stadiumGreen/40 flex items-center justify-center text-stadiumGreen">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-white flex items-center space-x-2">
              <span>Official Match Highlights Hub</span>
              <span className="text-xs">🎬</span>
            </h2>
            <p className="text-[10px] text-gray-400 font-sans">
              Watch verified European, League, and Cup highlights directly on Mivaj Sports.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search matches..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-stadiumGreen font-sans"
            />
          </div>
          <button
            onClick={fetchHighlights}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all flex-shrink-0"
            title="Refresh Highlights"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-stadiumGreen' : ''}`} />
          </button>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHighlights.slice(0, visibleCount).map((item) => (
          <div
            key={item.id}
            onClick={() => handleOpenVideo(item)}
            className="group relative rounded-3xl overflow-hidden bg-black/70 border border-white/10 hover:border-stadiumGreen/60 transition-all duration-300 cursor-pointer shadow-xl hover:scale-[1.02] flex flex-col justify-between"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-black">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-stadiumGreen/90 text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-current translate-x-0.5" />
                </div>
              </div>

              {/* Competition Badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-black/80 border border-white/10 text-[9px] font-black text-gold backdrop-blur-md">
                {item.competition}
              </div>

              {/* Verified Badge */}
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-stadiumGreen/20 border border-stadiumGreen/50 text-[9px] font-black text-stadiumGreen backdrop-blur-md flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-stadiumGreen animate-pulse" />
                <span>HD STREAM</span>
              </div>
            </div>

            <div className="p-3.5 space-y-2">
              <h3 className="font-extrabold text-xs text-white group-hover:text-stadiumGreen transition-colors line-clamp-2">
                {item.title}
              </h3>
              <div className="flex items-center justify-between text-[10px] text-gray-400 font-sans pt-1 border-t border-white/5">
                <span>{item.date}</span>
                <span className="text-stadiumGreen font-mono font-bold flex items-center space-x-1">
                  <span>Watch Recap</span>
                  <span>➔</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < filteredHighlights.length && (
        <div className="text-center pt-2">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="px-5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white transition-all inline-flex items-center space-x-2"
          >
            <span>Load More Matches</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Video Theater Modal (Multi-Source Unblocked Player with Mivaj Watermark) */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-mono">
          <div className="relative w-full max-w-3xl glass-panel-premium rounded-3xl border-2 border-stadiumGreen p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-stadiumGreen animate-ping flex-shrink-0" />
                <h3 className="font-black text-sm sm:text-base text-white truncate max-w-[240px] sm:max-w-md">
                  {activeVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-2 rounded-full bg-panel hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stream Channel Source Selector */}
            <div className="flex items-center space-x-2 text-xs">
              <button
                onClick={() => setCurrentStreamSource('YOUTUBE')}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all flex items-center space-x-1.5 ${
                  currentStreamSource === 'YOUTUBE'
                    ? 'bg-stadiumGreen text-black shadow-md'
                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Broadcaster Stream 1</span>
              </button>

              <a
                href={activeVideo.directWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-gold/20 hover:bg-gold text-gold hover:text-black border border-gold/40 text-[10px] font-black transition-all flex items-center space-x-1.5 ml-auto"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>1-Tap Full HD Theater ➔</span>
              </a>
            </div>

            {/* In-App Native Player Container with Mivaj Sports Watermark HUD */}
            <div className="rounded-2xl overflow-hidden border border-white/20 bg-black shadow-inner relative">
              <div className="relative w-full aspect-video bg-black">
                {/* Top Right Live Watermark */}
                <div className="absolute top-3 right-3 z-10 pointer-events-none px-2.5 py-1 rounded-lg bg-black/80 border border-stadiumGreen/50 text-[10px] font-black text-stadiumGreen tracking-wider backdrop-blur-md flex items-center space-x-1.5 shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-stadiumGreen animate-pulse" />
                  <span>MIVAJ SPORTS &bull; mivaj.com</span>
                </div>

                <iframe
                  src={activeVideo.embedUrl}
                  width="100%"
                  height="100%"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  loading="eager"
                />
              </div>
            </div>

            {/* Exclusive On-Site Watermarked Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs">
              <span className="text-[11px] text-gray-300 font-mono flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-stadiumGreen" />
                <span>Official HD Match Recap &bull; <strong>mivaj.com</strong></span>
              </span>
              <span className="text-[10px] text-stadiumGreen font-mono font-bold bg-stadiumGreen/10 border border-stadiumGreen/30 px-2.5 py-1 rounded-lg">
                🔒 Protected Stream &bull; Mivaj Sports
              </span>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
