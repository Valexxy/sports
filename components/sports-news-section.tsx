'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../lib/translation-engine';
import { batchTranslateArticles } from '../lib/news-translator';
import { 
  Newspaper, 
  Clock, 
  X, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Share2, 
  ExternalLink, 
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  PenTool
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GhostBloggerModal } from './news/GhostBloggerModal';

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
  const [translatedMap, setTranslatedMap] = useState<Record<string, { title: string; description: string; fullContent?: string }>>({});
  const [articles, setArticles] = useState<SportsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [activeArticle, setActiveArticle] = useState<SportsArticle | null>(null);
  const [autoSync, setAutoSync] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const [showGhostModal, setShowGhostModal] = useState(false);

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

  // Sync URL search params with Active Article for True Page Back Navigation & Refresh Continuity
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const newsId = params.get('news');
      if (newsId && articles.length > 0) {
        const found = articles.find((a) => a.id === newsId);
        setActiveArticle(found || null);
      } else {
        setActiveArticle(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [articles]);

  // Handle URL on initial load / refresh
  useEffect(() => {
    if (typeof window === 'undefined' || articles.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const newsId = params.get('news');
    if (newsId) {
      const found = articles.find((a) => a.id === newsId);
      if (found) setActiveArticle(found);
    }
  }, [articles]);

  // Live Exact Website Copy Extraction Engine
  useEffect(() => {
    if (!activeArticle || !activeArticle.link || !activeArticle.link.startsWith('http')) return;
    let isCurrent = true;

    async function loadExactArticle() {
      try {
        const res = await fetch(`/api/news/extract?url=${encodeURIComponent(activeArticle!.link)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.body && data.body.length > 80 && isCurrent) {
            setActiveArticle((prev) => prev ? { ...prev, fullContent: data.body } : null);
          }
        }
      } catch (err) {
        // Fallback to pre-generated story
      }
    }

    loadExactArticle();
    return () => { isCurrent = false; };
  }, [activeArticle?.id, activeArticle?.link]);

  const openArticle = (article: SportsArticle) => {
    setActiveArticle(article);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('news', article.id);
      window.history.pushState({ newsId: article.id }, '', url.toString());
    }
  };

  const closeArticle = () => {
    setActiveArticle(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('news');
      window.history.pushState({}, '', url.pathname + (url.searchParams.toString() ? '?' + url.searchParams.toString() : ''));
    }
  };

  // Deep Universal Batch Translation
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

  const handleShare = async (e: React.MouseEvent, article: SportsArticle) => {
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
      }
    } catch { /* noop */ }
  };

  const displayedArticles = articles
    .filter((a) => selectedCategory === 'ALL' || a.category === selectedCategory)
    .slice(0, visibleCount);

  const getCategoryPillColor = (cat: string) => {
    switch (cat) {
      case 'TRANSFERS': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'MATCH REPORTS': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'INJURIES': return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'TACTICS': return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      case 'NJA & AFCON': return 'bg-stadiumGreen/20 text-stadiumGreen border-stadiumGreen/40';
      default: return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
    }
  };

  return (
    <section className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-3xl bg-black/60 border border-white/10 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-white flex items-center space-x-2">
              <span>{t('Latest Football News & Wire')}</span>
              <span className="text-xs">📰</span>
            </h2>
            <p className="text-[10px] text-gray-400">
              {t('Official Transfers, Match Reports, Injuries, Manager Tactics, and Super Eagles Wire.')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowGhostModal(true)}
            className="px-3 py-1.5 rounded-xl bg-stadiumGreen text-black font-black text-xs flex items-center space-x-1.5 hover:bg-emerald-400 transition-all shadow-md active:scale-95"
            title="Submit a sports news post as a ghost writer"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Ghost Write Post</span>
          </button>

          <button
            onClick={loadNews}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 flex items-center space-x-1.5 transition-all shadow"
            title="Sync Latest Wire"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-stadiumGreen' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all"
            title="Toggle News Section"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-4 animate-fadeIn">
          {/* CATEGORY FILTER TABS */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORY_TABS.map((tab) => {
              const count = tab.key === 'ALL' 
                ? articles.length 
                : articles.filter((a) => a.category === tab.key).length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setSelectedCategory(tab.key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 whitespace-nowrap shadow-sm ${
                    selectedCategory === tab.key
                      ? 'bg-stadiumGreen text-black shadow-stadiumGreen/30'
                      : 'bg-black/50 text-gray-400 hover:text-white border border-white/10'
                  }`}
                >
                  <span>{t(tab.label)}</span>
                  {count > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${
                      selectedCategory === tab.key ? 'bg-black/40 text-white' : 'bg-white/10 text-gray-300'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ARTICLES GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {displayedArticles.map((article) => {
              const displayTitle = (lang !== 'en' && translatedMap[article.id]?.title) 
                ? translatedMap[article.id].title 
                : article.title;
              const displayDesc = (lang !== 'en' && translatedMap[article.id]?.description) 
                ? translatedMap[article.id].description 
                : article.description;

              return (
                <article
                  key={article.id}
                  onClick={() => openArticle(article)}
                  className="rounded-3xl bg-black/60 border border-white/10 overflow-hidden hover:border-stadiumGreen/60 transition-all group cursor-pointer flex flex-col justify-between shadow-lg active:scale-[0.99]"
                >
                  <div>
                    {/* PHOTO HERO */}
                    <div className="relative h-44 w-full bg-black/90 overflow-hidden">
                      <img
                        src={article.imageUrl || FALLBACK_PHOTO}
                        alt={displayTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_PHOTO; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      
                      <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black border backdrop-blur-md ${getCategoryPillColor(article.category)}`}>
                          {article.categoryBadge || article.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-black/80 text-gold text-[9px] font-bold border border-white/10 backdrop-blur-md">
                          {article.source}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleShare(e, article)}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-xl bg-black/70 hover:bg-black text-gray-300 hover:text-white border border-white/10 transition-all shadow"
                        title="Share"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 space-y-2">
                      <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-stadiumGreen transition-colors line-clamp-2 leading-snug">
                        {displayTitle}
                      </h3>
                      <p className="text-[11px] text-gray-400 font-sans line-clamp-2 leading-relaxed">
                        {displayDesc}
                      </p>
                    </div>
                  </div>

                  {/* CARD FOOTER */}
                  <div className="px-4 pb-3.5 pt-1 flex items-center justify-between text-[10px] text-gray-400 border-t border-white/5">
                    <span className="flex items-center space-x-1 font-mono text-gray-400">
                      <Clock className="w-3 h-3 text-gold" />
                      <span>{article.pubDate}</span>
                    </span>
                    <span className="text-stadiumGreen font-black group-hover:translate-x-1 transition-transform inline-flex items-center space-x-1">
                      <span>{t('Read Story')}</span>
                      <span>➔</span>
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {/* LOAD MORE BUTTON */}
          {articles.filter((a) => selectedCategory === 'ALL' || a.category === selectedCategory).length > visibleCount && (
            <div className="text-center pt-2">
              <button
                onClick={() => setVisibleCount((prev) => prev + 3)}
                className="px-6 py-2.5 rounded-2xl bg-stadiumGreen/15 hover:bg-stadiumGreen/25 border border-stadiumGreen/40 text-stadiumGreen font-bold text-xs shadow-md transition-all inline-flex items-center space-x-2 hover:scale-105"
              >
                <span>⚡ {t('Load More Articles')}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* DEDICATED FULL-SCREEN NEWS READER PAGE (PROPER LAYOUT, BROWSER BACK BUTTON SUPPORT) */}
      {activeArticle && (
        <div className="fixed inset-0 z-[100] bg-[#070b14] overflow-y-auto animate-fadeIn flex flex-col">
          {/* STICKY TOP APP BAR */}
          <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
            <button
              onClick={closeArticle}
              className="px-3.5 py-1.5 rounded-2xl bg-stadiumGreen text-black font-black text-xs flex items-center space-x-2 shadow-md hover:scale-105 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('Go Back to Matches & News')}</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => handleShare(e, activeArticle)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all"
                title="Share Article"
              >
                <Share2 className="w-4 h-4 text-gold" />
              </button>
              <button
                onClick={closeArticle}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-gray-300 hover:text-white transition-all"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MAIN ARTICLE BODY CONTAINER */}
          <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 sm:py-8 space-y-6">
            {/* HERO PHOTO */}
            <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">
              <img
                src={activeArticle.imageUrl || FALLBACK_PHOTO}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_PHOTO; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-xl font-black text-xs border shadow-lg backdrop-blur-md ${getCategoryPillColor(activeArticle.category)}`}>
                  {activeArticle.categoryBadge || activeArticle.category}
                </span>
                <span className="px-3 py-1 rounded-xl bg-black/85 text-gold font-black text-xs border border-white/10 shadow-lg backdrop-blur-md">
                  {activeArticle.source}
                </span>
              </div>
            </div>

            {/* METADATA ROW */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4 text-xs text-gray-400 font-mono">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gold" />
                <span>{activeArticle.pubDate}</span>
                <span>•</span>
                <span>{activeArticle.source}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-stadiumGreen font-black">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('VERIFIED OFFICIAL FOOTBALL REPORT')} ✓</span>
              </div>
            </div>

            {/* HEADLINE */}
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight">
              {(lang !== 'en' && translatedMap[activeArticle.id]?.title) 
                ? translatedMap[activeArticle.id].title 
                : activeArticle.title}
            </h1>

            {/* ARTICLE STORY CONTENT */}
            <div className="p-6 sm:p-8 rounded-3xl bg-black/60 border border-white/10 space-y-4 font-sans text-sm sm:text-base text-gray-200 leading-relaxed shadow-xl">
              <p className="font-bold text-stadiumGreen text-base sm:text-lg leading-relaxed border-l-4 border-stadiumGreen pl-4 py-1 bg-white/5 rounded-r-xl">
                {(lang !== 'en' && translatedMap[activeArticle.id]?.description) 
                  ? translatedMap[activeArticle.id].description 
                  : activeArticle.description}
              </p>
              
              <div className="text-gray-300 leading-relaxed whitespace-pre-line space-y-3 pt-2 text-sm sm:text-base">
                {((lang !== 'en' && translatedMap[activeArticle.id]?.fullContent) 
                  ? translatedMap[activeArticle.id].fullContent 
                  : (activeArticle.fullContent || activeArticle.description || 'Full tactical updates and in-play coverage continue on Mivaj Sports Match Center.'))
                  .replace(activeArticle.description, '')
                  .trim() || activeArticle.fullContent || activeArticle.description}
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 pb-16">
              <button
                onClick={closeArticle}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-black text-xs flex items-center space-x-2 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('Back to All News')}</span>
              </button>

              <div className="px-5 py-3 rounded-2xl bg-panel border border-stadiumGreen/40 text-gray-300 font-bold text-xs flex items-center space-x-2 shadow-md">
                <span>📰 Source:</span>
                <span className="text-stadiumGreen font-black">{activeArticle.source}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ghost Blogger Submission Suite Modal */}
      <GhostBloggerModal
        isOpen={showGhostModal}
        onClose={() => setShowGhostModal(false)}
      />
    </section>
  );
};
