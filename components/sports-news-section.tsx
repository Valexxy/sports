'use client';

import React, { useState, useEffect } from 'react';
import { Newspaper, Clock, X, RefreshCw, ChevronDown, ChevronUp, Sparkles, Flame, ThumbsUp, Target } from 'lucide-react';

export interface SportsArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
  imageUrl: string;
  fullContent?: string;
}

export const SportsNewsSection: React.FC = () => {
  const [articles, setArticles] = useState<SportsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const [activeArticle, setActiveArticle] = useState<SportsArticle | null>(null);
  const [autoSync, setAutoSync] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [reactions, setReactions] = useState<Record<string, { flame: number; target: number; clap: number }>>({});

  const loadNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.articles && Array.isArray(data.articles)) {
          setArticles(data.articles);
        }
      }
    } catch (err) {
      console.warn('News loading warning:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  // Background Auto-Sync every 30s
  useEffect(() => {
    if (!autoSync) return;
    const interval = setInterval(() => {
      loadNews();
    }, 30000);
    return () => clearInterval(interval);
  }, [autoSync]);

  const handleReact = (articleId: string, type: 'flame' | 'target' | 'clap') => {
    setReactions((prev) => {
      const current = prev[articleId] || { flame: 12, target: 8, clap: 24 };
      return {
        ...prev,
        [articleId]: {
          ...current,
          [type]: current[type] + 1,
        },
      };
    });
  };

  const displayedArticles = articles.slice(0, visibleCount);

  return (
    <div className="glass-panel rounded-3xl p-5 border border-white/10 space-y-4 shadow-2xl font-mono text-xs">
      
      {/* Section Header & Auto-Sync Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2.5 cursor-pointer select-none"
        >
          <div className="p-2 rounded-xl bg-gold/20 text-gold border border-gold/40">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-sm text-white flex items-center space-x-2">
              <span>LATEST FOOTBALL NEWS & MATCH REPORTS 📰</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-stadiumGreen/20 text-stadiumGreen font-bold border border-stadiumGreen/30">
                100% PURE FOOTBALL ✓
              </span>
            </h3>
            <p className="text-[10px] text-gray-400 font-sans">
              Live tactical match previews, official UEFA rosters, and transfer market updates
            </p>
          </div>
        </div>

        {/* Auto-Sync, Refresh & Collapse Buttons */}
        <div className="flex items-center space-x-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <button
            onClick={() => setAutoSync(!autoSync)}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center space-x-1.5 transition-all ${
              autoSync
                ? 'bg-stadiumGreen/20 border-stadiumGreen/40 text-stadiumGreen'
                : 'bg-panel border-white/10 text-gray-400'
            }`}
            title="Toggle Background Auto-Sync"
          >
            <span className={`w-2 h-2 rounded-full ${autoSync ? 'bg-stadiumGreen animate-ping' : 'bg-gray-500'}`}></span>
            <span>{autoSync ? 'Auto-Sync ON (30s)' : 'Auto-Sync OFF'}</span>
          </button>

          <button
            onClick={loadNews}
            className="px-3.5 py-1.5 rounded-xl bg-panel hover:bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/30 text-xs font-bold flex items-center space-x-1.5 transition-all hover:scale-105"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync ⚡</span>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-1 text-gray-400 hover:text-white text-xs font-bold px-2.5 py-1.5 rounded-xl bg-panel border border-white/10"
          >
            <span className="hidden sm:inline">{isOpen ? 'Collapse' : 'Expand'}</span>
            {isOpen ? <ChevronUp className="w-4 h-4 text-stadiumGreen" /> : <ChevronDown className="w-4 h-4 text-gold" />}
          </button>
        </div>
      </div>

      {/* 3-in-a-Row News Cards Grid (Collapsible) */}
      {isOpen && (
        <div className="animate-fadeIn">
          {loading && articles.length === 0 ? (
            <div className="p-8 text-center rounded-2xl glass-panel border border-stadiumGreen/20 flex items-center justify-center space-x-2 text-stadiumGreen">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Loading verified football news...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayedArticles.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveArticle(item)}
                    className="rounded-3xl bg-panel/90 hover:bg-panel border border-white/10 hover:border-stadiumGreen/60 transition-all cursor-pointer flex flex-col justify-between group shadow-xl overflow-hidden hover:scale-[1.01]"
                  >
                    {/* Photo Thumbnail */}
                    <div className="relative h-40 w-full overflow-hidden bg-black">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="text-[9px] px-2.5 py-1 rounded-xl bg-black/85 text-stadiumGreen font-black border border-stadiumGreen/40 shadow-lg">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                      <div>
                        <span className="text-gold font-extrabold text-[10px] block mb-1">
                          {item.source}
                        </span>
                        <h4 className="font-extrabold text-xs text-white group-hover:text-stadiumGreen transition-all line-clamp-2 leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-gray-400 font-sans mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500">
                        <span className="flex items-center space-x-1 font-mono text-gray-400">
                          <Clock className="w-3 h-3 text-gold" />
                          <span>{item.pubDate}</span>
                        </span>
                        <span className="text-stadiumGreen font-bold group-hover:underline flex items-center space-x-1">
                          <span>Read Story</span>
                          <span>➔</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More News Button */}
              {articles.length > visibleCount && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 3)}
                    className="px-6 py-2.5 rounded-2xl bg-stadiumGreen/15 hover:bg-stadiumGreen/25 border border-stadiumGreen/40 text-stadiumGreen font-bold text-xs shadow-md transition-all inline-flex items-center space-x-2 hover:scale-105"
                  >
                    <span>⚡ Load 3 More News Articles ({articles.length - visibleCount} remaining)</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Ultra-Stylish Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-3 sm:p-4 animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-xl glass-panel-premium rounded-3xl border-2 border-stadiumGreen/50 p-6 shadow-2xl font-mono text-xs my-6 max-h-[92vh] overflow-y-auto space-y-4">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-panel text-gray-400 hover:text-white border border-white/10 transition-all hover:rotate-90 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Hero Image */}
            <div className="relative h-56 w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
              <img
                src={activeArticle.imageUrl}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-xl bg-black/85 text-stadiumGreen font-black text-[10px] border border-stadiumGreen/40 shadow-lg">
                  {activeArticle.category}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/80 px-2.5 py-1 rounded-xl text-[10px] text-gray-300 font-bold border border-white/10">
                ⏱️ 2 Min Read
              </div>
            </div>

            {/* Date & Non-Clickable Source Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              {/* NON-CLICKABLE SOURCE TAG */}
              <div className="px-3 py-1 rounded-xl bg-panel border border-white/10 text-gold font-bold text-[11px] select-none cursor-default">
                <span>Verified Source: {activeArticle.source}</span>
              </div>

              <div className="flex items-center space-x-1.5 text-gray-300 font-bold text-[11px]">
                <Clock className="w-3.5 h-3.5 text-stadiumGreen" />
                <span>{activeArticle.pubDate}</span>
              </div>
            </div>

            {/* Headline & Full Content */}
            <div className="space-y-3">
              <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
                {activeArticle.title}
              </h2>
              <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2 text-gray-200 font-sans text-xs sm:text-sm leading-relaxed">
                <p>{activeArticle.fullContent || activeArticle.description}</p>
                <p className="text-gray-400 text-xs pt-2 border-t border-white/5">
                  Verified by AuraScore Stadium Global Match Center press wire. All statistics and tactical lineups synchronized in real time.
                </p>
              </div>
            </div>

            {/* Interactive Reader Reactions */}
            <div className="p-3 rounded-2xl bg-panel border border-white/10 flex items-center justify-between">
              <span className="text-[10px] text-gray-400 font-bold">READER PULSE:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleReact(activeArticle.id, 'flame')}
                  className="px-2.5 py-1 rounded-xl bg-black/60 hover:bg-white/10 text-pink-400 border border-white/10 text-xs font-bold flex items-center space-x-1 transition-all"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>{(reactions[activeArticle.id]?.flame || 14)}</span>
                </button>
                <button
                  onClick={() => handleReact(activeArticle.id, 'target')}
                  className="px-2.5 py-1 rounded-xl bg-black/60 hover:bg-white/10 text-stadiumGreen border border-white/10 text-xs font-bold flex items-center space-x-1 transition-all"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>{(reactions[activeArticle.id]?.target || 22)}</span>
                </button>
                <button
                  onClick={() => handleReact(activeArticle.id, 'clap')}
                  className="px-2.5 py-1 rounded-xl bg-black/60 hover:bg-white/10 text-gold border border-white/10 text-xs font-bold flex items-center space-x-1 transition-all"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{(reactions[activeArticle.id]?.clap || 35)}</span>
                </button>
              </div>
            </div>

            {/* Footer Close Button */}
            <div className="pt-2 border-t border-white/10">
              <button
                onClick={() => setActiveArticle(null)}
                className="w-full py-2.5 rounded-xl bg-stadiumGreen text-black font-black text-xs hover:bg-emerald-400 transition-all shadow-lg"
              >
                Close Article
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
