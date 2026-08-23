'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../lib/translation-engine';
import { batchTranslateArticles } from '../lib/news-translator';
import { Newspaper, Clock, X, RefreshCw, ChevronDown, ChevronUp, Flame, ThumbsUp, Target, Share2, ExternalLink, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface SportsArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
  categoryBadge: string;
  imageUrl: string;
  fullContent?: string;
}

const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80';

const CATEGORY_TABS = [
  { key: 'ALL', label: '⚡ All News', emoji: '⚡' },
  { key: 'TRANSFERS', label: '🔥 Transfers', emoji: '🔥' },
  { key: 'MATCH REPORTS', label: '🚨 Match Reports', emoji: '🚨' },
  { key: 'INJURIES', label: '🚑 Injuries', emoji: '🚑' },
  { key: 'TACTICS', label: '🧠 Manager & Tactics', emoji: '🧠' },
  { key: 'NJA & AFCON', label: '🇳🇬 Naija & AFCON', emoji: '🇳🇬' },
  { key: 'UCL & EUROPE', label: '⭐ UCL & Europe', emoji: '⭐' },
];

export const SportsNewsSection: React.FC = () => {
  const { lang, t } = useTranslation();
  const [translatedMap, setTranslatedMap] = useState<Record<string, { title: string; description: string }>>({});
  const [articles, setArticles] = useState<SportsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [activeArticle, setActiveArticle] = useState<SportsArticle | null>(null);
  const [autoSync, setAutoSync] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSource, setSelectedSource] = useState('ALL');

  const loadNews = async () => {
    try {
      const res = await fetch('/api/news', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.articles && Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(data.articles);
        }
      }
    } catch (err) {
      console.warn('News loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  // Neural Digital Translation Effect for News Articles across Nigerian & International Languages
  useEffect(() => {
    if (lang === 'en' || articles.length === 0) {
      setTranslatedMap({});
      return;
    }
    let isMounted = true;

    async function runBatchTranslation() {
      const res = await batchTranslateArticles(articles, lang);
      if (isMounted) {
        setTranslatedMap(res);
      }
    }

    runBatchTranslation();
    return () => {
      isMounted = false;
    };
  }, [lang, articles]);

  // Background High-Frequency Auto-Sync (Every 25s)
  useEffect(() => {
    if (!autoSync) return;
    const interval = setInterval(loadNews, 25000);
    return () => clearInterval(interval);
  }, [autoSync]);

  const sources = useMemo(() => {
    const set = new Set<string>(articles.map((a) => a.source).filter(Boolean));
    return ['ALL', ...Array.from(set).slice(0, 5)];
  }, [articles]);

  const displayedArticles = articles
    .filter((a) => selectedCategory === 'ALL' || a.category === selectedCategory)
    .filter((a) => selectedSource === 'ALL' || a.source === selectedSource)
    .slice(0, visibleCount);

  const handleShare = async (e: React.MouseEvent, article: SportsArticle) => {
    e.stopPropagation();
    const shareData = {
      title: article.title,
      text: `${(lang !== 'en' && translatedMap[article.id]?.title) ? translatedMap[article.id].title : article.title} — via AuraScore Stadium`,
      url: article.link,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard?.writeText(article.link);
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      }
    } catch { /* ignored */ }
  };

  const getCategoryPillColor = (cat: string) => {
    switch (cat) {
      case 'TRANSFERS':
        return 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-orange-500/50 text-orange-400';
      case 'MATCH REPORTS':
        return 'bg-stadiumGreen/20 border-stadiumGreen/50 text-stadiumGreen';
      case 'INJURIES':
        return 'bg-crimson/20 border-crimson/50 text-crimson';
      case 'NJA & AFCON':
        return 'bg-emerald-500/25 border-emerald-400/60 text-emerald-300';
      case 'UCL & EUROPE':
        return 'bg-blue-500/20 border-blue-400/50 text-blue-300';
      case 'TACTICS':
        return 'bg-purple-500/20 border-purple-400/50 text-purple-300';
      default:
        return 'bg-gold/20 border-gold/40 text-gold';
    }
  };

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
              <span>LATEST FOOTBALL NEWS & MATCH WIRE 📰</span>
              
            </h3>
            <span className="text-[10px] text-gray-400 font-sans">
              Official Transfers, Match Reports, Injuries, Manager Tactics, and Super Eagles Wire.
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <button
            onClick={() => setAutoSync(!autoSync)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all ${
              autoSync
                ? 'bg-stadiumGreen/20 border-stadiumGreen text-stadiumGreen shadow-md'
                : 'bg-panel border-white/10 text-gray-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoSync ? 'bg-stadiumGreen animate-ping' : 'bg-gray-500'}`} />
            <span>{autoSync ? 'Auto-Sync ON (25s)' : 'Auto-Sync Paused'}</span>
          </button>

          <button
            onClick={() => { setLoading(true); loadNews(); }}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-panel hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-bold flex items-center space-x-1 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gold ${loading ? 'animate-spin' : ''}`} />
            <span>Sync ⚡</span>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-xl bg-panel hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all"
          >
            {isOpen ? <ChevronUp className="w-4 h-4 text-stadiumGreen" /> : <ChevronDown className="w-4 h-4 text-gold" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-4">
          
          {/* Smart Category Filter Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORY_TABS.map((cat) => {
              const count = cat.key === 'ALL'
                ? articles.length
                : articles.filter((a) => a.category === cat.key).length;

              return (
                <button
                  key={cat.key}
                  onClick={() => { setSelectedCategory(cat.key); setVisibleCount(6); }}
                  className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl border text-xs font-black transition-all ${
                    selectedCategory === cat.key
                      ? 'bg-stadiumGreen text-black border-stadiumGreen shadow-lg shadow-stadiumGreen/20 scale-105'
                      : 'bg-panel/80 text-gray-400 hover:text-white border-white/10 hover:border-white/20'
                  }`}
                >
                  <span>{t(cat.label)}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedCategory === cat.key ? 'bg-black/30 text-black' : 'bg-white/10 text-gray-300'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* News Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedArticles.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveArticle(item)}
                className="rounded-3xl border border-white/10 bg-panel/70 hover:border-stadiumGreen/50 hover:bg-panel/90 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer shadow-xl hover:scale-[1.01]"
              >
                {/* Guaranteed Working Image Header */}
                <div className="relative h-44 w-full overflow-hidden bg-black">
                  <img
                    src={item.imageUrl || FALLBACK_PHOTO}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_PHOTO;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-xl font-black border backdrop-blur-md shadow-md ${getCategoryPillColor(item.category)}`}>
                      {item.categoryBadge || item.category}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-xl bg-black/80 text-gold font-bold border border-white/10 backdrop-blur-md">
                      {item.source}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleShare(e, item)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-xl bg-black/80 text-gray-300 hover:text-gold border border-white/10 backdrop-blur-md transition-all shadow"
                    title="Share article"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Article Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <h4 className="font-extrabold text-xs sm:text-sm text-white group-hover:text-stadiumGreen transition-all line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-sans mt-1.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500">
                    <span className="flex items-center space-x-1 font-mono text-gray-400">
                      <Clock className="w-3 h-3 text-gold" />
                      <span>{item.pubDate}</span>
                    </span>
                    <span className="text-stadiumGreen font-bold group-hover:underline flex items-center space-x-1">
                      <span>{t("Read Story")}</span>
                      <span>➔</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {articles.filter((a) => selectedCategory === 'ALL' || a.category === selectedCategory).length > visibleCount && (
            <div className="text-center pt-2">
              <button
                onClick={() => setVisibleCount((prev) => prev + 3)}
                className="px-6 py-2.5 rounded-2xl bg-stadiumGreen/15 hover:bg-stadiumGreen/25 border border-stadiumGreen/40 text-stadiumGreen font-bold text-xs shadow-md transition-all inline-flex items-center space-x-2 hover:scale-105"
              >
                <span>⚡ Load 3 More Articles</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* Full Article Reader Modal (100% Mobile-Friendly with Guaranteed Full Text) */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-2xl glass-panel-premium rounded-3xl border-2 border-stadiumGreen/60 p-4 sm:p-6 shadow-2xl font-mono text-xs my-4 max-h-[92vh] overflow-y-auto space-y-4">
            
            {/* Sticky Top-Right Close Button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 p-2 rounded-2xl bg-black/80 text-gray-300 hover:text-white border border-white/20 transition-all hover:rotate-90 z-20 shadow-xl"
              title="Close Story"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* High-Resolution Hero Photo */}
            <div className="relative h-48 sm:h-64 w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
              <img
                src={activeArticle.imageUrl || FALLBACK_PHOTO}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_PHOTO; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-xl font-black text-[10px] border shadow-lg backdrop-blur-md ${getCategoryPillColor(activeArticle.category)}`}>
                  {activeArticle.categoryBadge || activeArticle.category}
                </span>
                <span className="px-3 py-1 rounded-xl bg-black/85 text-gold font-black text-[10px] border border-white/10 shadow-lg backdrop-blur-md">
                  {activeArticle.source}
                </span>
              </div>
            </div>

            {/* Article Body */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-gray-400 text-[10px]">
                <span className="flex items-center space-x-1 font-mono text-gray-300">
                  <Clock className="w-3.5 h-3.5 text-gold" />
                  <span>{activeArticle.pubDate}</span>
                </span>
                <span className="text-stadiumGreen font-black">VERIFIED OFFICIAL REPORT ✓</span>
              </div>

              <h2 className="text-lg sm:text-2xl font-black text-white leading-snug">
                {(lang !== 'en' && translatedMap[activeArticle.id]?.title) ? translatedMap[activeArticle.id].title : activeArticle.title}
              </h2>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                <p className="text-gray-200 font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {(lang !== 'en' && translatedMap[activeArticle.id]?.description) ? translatedMap[activeArticle.id].description : (activeArticle.fullContent || activeArticle.description)}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                <a
                  href={activeArticle.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-stadiumGreen text-black font-black text-xs flex items-center space-x-1.5 hover:bg-emerald-400 transition-all shadow-md active:scale-95"
                >
                  <span>{t('Read Story')} ({activeArticle.source})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={(e) => handleShare(e, activeArticle)}
                  className="px-4 py-2.5 rounded-xl bg-black/80 border border-white/10 text-white font-bold text-xs flex items-center space-x-1.5 hover:bg-white/15 transition-all shadow active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5 text-gold" />
                  <span>{t('Share Story')}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
