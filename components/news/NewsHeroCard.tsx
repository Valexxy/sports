'use client';

import React from 'react';
import { Share2, Clock, Zap, ArrowRight } from 'lucide-react';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';

interface NewsHeroCardProps {
  article: {
    id: string;
    title: string;
    description: string;
    url: string;
    imageUrl?: string;
    category?: string;
    publishedAt?: string;
  };
  onOpenSummary?: (article: any) => void;
  onOpenFullArticle?: (article: any) => void;
}

export const NewsHeroCard: React.FC<NewsHeroCardProps> = ({ article, onOpenSummary, onOpenFullArticle }) => {
  const handleShareWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playBookmarkSound();
    const text = encodeURIComponent(`🚨 *${article.title}*\n\n${article.description}\n\nRead on Mivaj: https://mivaj.com`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleClickCard = () => {
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playAddPickSound();
    if (onOpenFullArticle) {
      onOpenFullArticle(article);
    }
  };

  return (
    <div
      onClick={handleClickCard}
      className="relative rounded-3xl overflow-hidden cursor-pointer group border border-white/10 hover:border-stadiumGreen/60 transition-all duration-500 shadow-2xl min-h-[340px] sm:min-h-[400px] flex flex-col justify-end p-5 sm:p-7 glow-emerald"
    >
      <img
        src={article.imageUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80'}
        alt={article.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.75]"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80';
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

      <div className="relative z-10 space-y-2.5 font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-crimson text-white text-[11px] font-black tracking-wider flex items-center space-x-1 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>🔴 BREAKING WIRE</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-stadiumGreen text-[11px] font-bold">
            {article.category || 'GLOBAL SPORTS'}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white leading-tight group-hover:text-stadiumGreen transition-colors line-clamp-3">
          {article.title}
        </h2>

        <p className="text-gray-300 text-xs sm:text-sm font-sans line-clamp-2 leading-relaxed">
          {article.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
          <div className="flex items-center space-x-3 text-gray-400 text-[11px]">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-stadiumGreen" />
              <span>⏱ 2 min read</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenSummary && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSummary(article);
                }}
                className="px-3 py-1.5 rounded-xl bg-stadiumGreen/20 hover:bg-stadiumGreen text-stadiumGreen hover:text-black border border-stadiumGreen/40 font-black text-[10px] transition-all flex items-center space-x-1"
              >
                <Zap className="w-3 h-3" />
                <span>Quick Take</span>
              </button>
            )}

            <button
              onClick={handleShareWhatsApp}
              className="p-2 rounded-xl bg-white/10 hover:bg-[#25D366] text-white hover:text-black border border-white/10 transition-all"
              title="Share on WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
