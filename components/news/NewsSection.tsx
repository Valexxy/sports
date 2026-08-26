'use client';

import React, { useState } from 'react';
import { Sparkles, Flame, Trophy, Activity, Globe, ChevronRight } from 'lucide-react';
import { FullArticleModal, NewsArticle } from './FullArticleModal';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';

const SAMPLE_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    title: "Summer transfer tori window: Grading big signings in men's soccer",
    category: 'TRANSFERS',
    readTime: '2 min read',
    publishedAt: 'Just Now',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    summary: 'The 2026 summer transfer tori window is open. Here is how we rated the biggest deals across European football.',
    bodyPidgin: `Toris dey hot: The 2026 summer transfer tori window is open. Here is how we rated the biggest deals.

All the top analysts for stadium don confirm say this development go change the whole momentum for the league. The management and technical crew dey put final touches to ensure maximum performance for the upcoming fixtures.

Top clubs like Real Madrid, Arsenal, Barcelona, and Manchester City dey finalize agreements with elite agents across South America and Europe to secure game-changers before the deadline closes.

Make you join our official Telegram channel make you no miss any insider banger picks and live commentary updates as they drop live from the stadium!`,
    bodyEnglish: `The 2026 summer transfer window is officially open. Here is our comprehensive breakdown and tactical grading of the highest-profile deals completed across Europe's top five leagues.

Clubs including Real Madrid, Arsenal, Barcelona, and Manchester City are finalizing multimillion-euro agreements to reinforce key tactical areas ahead of the upcoming European campaigns.

Follow our live wire on Telegram for real-time match previews, tactical footprints, and verified betting picks.`,
  },
  {
    id: 'news-2',
    title: 'Champions League Quarterfinal Draw: Tacticians breakdown tactical matchups',
    category: 'MATCH_REPORTS',
    readTime: '3 min read',
    publishedAt: '1h ago',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    summary: 'Tactical analysis and head-to-head records ahead of the titanic European clashes this week.',
    bodyPidgin: `The UEFA Champions League draw don land and everywhere don burst! 

Big teams dey face heavy hurdles as the quarterfinal fixtures don line up properly. Coaches and managers dey sharpen their masterclass formations to ensure dem collect all maximum points on top the green pitch.

Our deep data analytics team don run 10,000 computer simulations using Poisson models and Dixon-Coles algorithms to give you the most accurate prediction outcomes.`,
    bodyEnglish: `The UEFA Champions League quarterfinal draw has produced seismic encounters across the continent. Managers are refining tactical setups to exploit transition phases and press triggers.

Our quantitative engine has simulated each tie 10,000 times using Poisson distributions and historical home-away parameters to forecast exact qualification likelihoods.`,
  },
  {
    id: 'news-3',
    title: 'Injury Wire: Key squad updates ahead of explosive weekend fixtures',
    category: 'INJURIES',
    readTime: '1 min read',
    publishedAt: '2h ago',
    imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80',
    summary: 'Medical team bulletins, fitness tests, and confirmed team lineups for top European clubs.',
    bodyPidgin: `Medical reports don drop for top team players ahead of the weekend clashes.

Doctors and fitness coaches dey run late fitness checks on star wingers and midfielders to see who go fit start for first XI. Bettors must take note of these lineup shifts before locking their slips.`,
    bodyEnglish: `Official squad fitness reports have been released by Premier League and La Liga medical staffs ahead of the upcoming matchday.

Key attackers and central midfielders are undergoing late fitness assessments. Ensure you verify confirmed starting XIs before placing matchday wagers.`,
  },
  {
    id: 'news-4',
    title: 'NBA Playoffs & Combat Wire: Heavyweight championship fight preview',
    category: 'MULTI_SPORT',
    readTime: '4 min read',
    publishedAt: '3h ago',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    summary: 'Complete multi-sport breakdown spanning NBA playoffs, UFC combat events, and ATP Tennis.',
    bodyPidgin: `No be only football dey sweet! NBA Basketball and UFC Combat fights dey shake the whole world this weekend.

From slam dunks to knockout rounds, our multi-sport engine don normalize all odds into verified moneyline and point spread slips ready for instant 1-tap betting.`,
    bodyEnglish: `Beyond football, the NBA postseason and UFC Heavyweight Championship card are scheduled for blockbuster action this weekend.

Our multi-sport taxonomy translates fight props, point totals, and moneyline selections into unified betting slips ready for instant export.`,
  },
];

export const NewsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const categories = [
    { id: 'ALL', label: 'All News (42)' },
    { id: 'TRANSFERS', label: '🔥 Transfers (28)' },
    { id: 'MATCH_REPORTS', label: '🏆 Match Reports (6)' },
    { id: 'INJURIES', label: '🚑 Injuries (2)' },
    { id: 'MULTI_SPORT', label: '🏀 Basketball & Multi-Sport' },
  ];

  const filteredArticles = SAMPLE_ARTICLES.filter((a) => {
    if (activeCategory === 'ALL') return true;
    return a.category === activeCategory;
  });

  const featured = filteredArticles[0] || SAMPLE_ARTICLES[0];

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-[#0a0d14] border-2 border-stadiumGreen/40 space-y-4 font-mono text-xs shadow-2xl glow-emerald">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-xl bg-stadiumGreen/20 text-stadiumGreen">📰</span>
          <h3 className="font-black text-sm text-white uppercase tracking-wider">
            EDITORIAL NEWS WIRE &amp; GLOBAL SPORTS
          </h3>
        </div>

        <span className="text-[10px] text-stadiumGreen font-bold flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-stadiumGreen animate-ping" />
          <span>Sync Wire</span>
        </span>
      </div>

      {/* Category Pills (Active & Clickable!) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              phoneHardware.triggerHaptic('SELECTION');
              stadiumAudio.playTabClickSound();
              setActiveCategory(c.id);
            }}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
              activeCategory === c.id
                ? 'bg-stadiumGreen text-black font-black shadow-md shadow-stadiumGreen/30'
                : 'bg-panel border border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Featured Big Article Card */}
      {featured && (
        <div
          onClick={() => {
            phoneHardware.triggerHaptic('SUCCESS');
            stadiumAudio.playBookmarkSound();
            setSelectedArticle(featured);
          }}
          className="p-5 rounded-3xl bg-gradient-to-t from-black via-black/80 to-transparent border border-white/10 relative overflow-hidden group cursor-pointer hover:border-stadiumGreen/60 transition-all shadow-xl"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.6)), url(${featured.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="space-y-2 pt-16">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full bg-crimson text-white text-[9px] font-black uppercase">
                BREAKING WIRE
              </span>
              <span className="px-2 py-0.5 rounded-full bg-stadiumGreen/20 text-stadiumGreen text-[9px] font-black uppercase">
                {featured.category}
              </span>
            </div>

            <h4 className="font-black text-white text-sm sm:text-base group-hover:text-stadiumGreen transition-colors line-clamp-2">
              {featured.title}
            </h4>

            <p className="text-[11px] text-gray-300 font-sans line-clamp-2">
              {featured.summary}
            </p>

            <div className="pt-2 flex items-center justify-between text-[10px] text-gray-400">
              <span>⏰ {featured.readTime}</span>
              <span className="px-3 py-1 rounded-xl bg-stadiumGreen text-black font-black flex items-center space-x-1 group-hover:scale-105 transition-transform">
                <span>Quick Take</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Other Filtered Articles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {filteredArticles.slice(1).map((art) => (
          <div
            key={art.id}
            onClick={() => {
              phoneHardware.triggerHaptic('SUCCESS');
              stadiumAudio.playBookmarkSound();
              setSelectedArticle(art);
            }}
            className="p-3.5 rounded-2xl bg-black/60 border border-white/10 hover:border-stadiumGreen/40 cursor-pointer space-y-2 transition-all hover:scale-[1.02]"
          >
            <span className="px-2 py-0.5 rounded bg-white/10 text-gray-300 text-[9px] font-bold">
              {art.category}
            </span>
            <h5 className="font-bold text-white text-xs line-clamp-2 hover:text-stadiumGreen transition-colors">
              {art.title}
            </h5>
            <span className="text-[10px] text-gray-500 block font-sans">
              {art.readTime} &bull; {art.publishedAt}
            </span>
          </div>
        ))}
      </div>

      {/* Full Article Modal */}
      <FullArticleModal
        isOpen={!!selectedArticle}
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

    </div>
  );
};
