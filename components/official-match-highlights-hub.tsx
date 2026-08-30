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
          competition: item.competition || 'Top Flight Highlights',
          thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
          date: item.date || 'Yesterday',
          rawDate: new Date(Date.now() - 86400000).toISOString(),
          embedHtml: `<iframe src="${item.embedUrl}" width="100%" height="100%" frameborder="0" allowfullscreen allow="autoplay; fullscreen; picture-in-picture; accelerometer; gyroscope"></iframe>`,
        }));
        setHighlights(formatted);
      } else {
        // Fallback to direct verified DailyMotion feed
        const sRes = await fetch('https://api.dailymotion.com/videos?search=football+highlights&fields=id,title,thumbnail_720_url,embed_url,duration,created_time&limit=25');
        const sData = await sRes.json();
        if (sData?.list && Array.isArray(sData.list)) {
          const sFormatted: HighlightItem[] = sData.list.map((item: any, idx: number) => ({
            id: `hl-dm-${idx}`,
            title: item.title?.replace(/^Highlights_/i, '').replace(/_Matchday.*$/i, '').replace(' - ', ' vs ') || 'Match Highlights',
            competition: 'Top European Flight',
            thumbnail: item.thumbnail_720_url || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
            date: new Date(item.created_time * 1000).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
            rawDate: new Date(item.created_time * 1000).toISOString(),
            embedHtml: `<iframe src="https://www.dailymotion.com/embed/video/${item.id}?autoplay=1&mute=0&ui-logo=0&sharing-enable=0" width="100%" height="100%" frameborder="0" allowfullscreen allow="autoplay; fullscreen; picture-in-picture; accelerometer; gyroscope"></iframe>`,
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
              placeholder="Search highlights..."
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

      {/* Date Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {(['ALL', 'TODAY', 'YESTERDAY', 'WEEK'] as DateFilterType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setDateFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
              dateFilter === tab
                ? 'bg-stadiumGreen text-black shadow-md'
                : 'bg-black/50 text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            {tab === 'ALL' && '⚡ All Highlights'}
            {tab === 'TODAY' && '🔥 Today'}
            {tab === 'YESTERDAY' && '📅 Yesterday'}
            {tab === 'WEEK' && '⭐ This Week'}
          </button>
        ))}
      </div>

      {/* Highlights Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-3xl bg-white/5 border border-white/10 p-3 space-y-3 animate-pulse">
              <div className="w-full aspect-video rounded-2xl bg-white/10" />
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredHighlights.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHighlights.slice(0, visibleCount).map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenVideo(item)}
              className="group cursor-pointer rounded-3xl bg-black/60 border border-white/10 hover:border-stadiumGreen/60 p-3 space-y-3 transition-all duration-300 hover:shadow-2xl hover:shadow-stadiumGreen/10 flex flex-col justify-between"
            >
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-stadiumGreen/90 text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* On-Screen Watermark Badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 border border-stadiumGreen/40 text-[9px] font-black text-stadiumGreen backdrop-blur-sm">
                  MIVAJ HIGHLIGHTS
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-gray-400">
                  <span className="text-emerald-400 font-bold truncate max-w-[180px]">{item.competition}</span>
                  <span>{item.date}</span>
                </div>
                <h3 className="font-black text-xs text-white group-hover:text-stadiumGreen transition-colors line-clamp-2">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center rounded-3xl bg-black/60 border border-white/10 space-y-3">
          <Video className="w-8 h-8 text-gray-500 mx-auto" />
          <h3 className="text-white font-black text-xs">No highlights match your filter</h3>
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

      {/* Video Theater Modal (Zero Redirects • Exclusive On-Site Player with Mivaj Watermark) */}
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

            {/* In-App Native Player Container with Mivaj Sports Watermark HUD */}
            <div className="rounded-2xl overflow-hidden border border-white/20 bg-black shadow-inner relative">
              {activeVideo.embedHtml ? (
                (() => {
                  const srcMatch = activeVideo.embedHtml.match(/src=['"]([^'"]+)['"]/i);
                  const iframeSrc = srcMatch ? srcMatch[1] : '';

                  return (
                    <div className="relative w-full aspect-video bg-black">
                      {/* Top Right Live Watermark */}
                      <div className="absolute top-3 right-3 z-10 pointer-events-none px-2.5 py-1 rounded-lg bg-black/80 border border-stadiumGreen/50 text-[10px] font-black text-stadiumGreen tracking-wider backdrop-blur-md flex items-center space-x-1.5 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-stadiumGreen animate-pulse" />
                        <span>MIVAJ SPORTS &bull; mivaj.com</span>
                      </div>

                      {iframeSrc ? (
                        <iframe
                          src={iframeSrc}
                          width="100%"
                          height="100%"
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                          allowFullScreen
                          loading="eager"
                        />
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{ __html: activeVideo.embedHtml }}
                          className="w-full h-full"
                        />
                      )}
                    </div>
                  );
                })()
              ) : (
                <div className="aspect-video flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <span className="text-4xl block">⚽</span>
                  <p className="text-xs text-gray-400 font-sans">Highlights are processing. Check back shortly.</p>
                </div>
              )}
            </div>

            {/* Exclusive On-Site Watermarked Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs">
              <span className="text-[11px] text-gray-300 font-mono flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-stadiumGreen" />
                <span>Official HD Match Recap &bull; Exclusively on <strong>mivaj.com</strong></span>
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
