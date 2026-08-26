'use client';

import React from 'react';
import { Share2, Clock, Zap, ArrowRight } from 'lucide-react';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';

interface NewsCardProps {
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

export const NewsCard: React.FC<NewsCardProps> = ({ article, onOpenSummary, onOpenFullArticle }) => {
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
      className="w-[280px] sm:w-[320px] flex-shrink-0 bg-[#0d111a] border border-white/[0.08] hover:border-stadiumGreen/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(16,185,129,0.3)] group flex flex-col justify-between cursor-pointer font-mono glow-emerald"
    >
      <div>
        <div className="aspect-[16/10] overflow-hidden relative bg-black/60">
          <img
            src={article.imageUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80'}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80';
            }}
          />

          <div className="absolute top-2.5 left-2.5">
            <span className="bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-stadiumGreen px-2.5 py-1 rounded-full">
              {article.category || 'HOT WIRE'}
            </span>
          </div>
        </div>

        <div className="p-3.5 space-y-1.5">
          <h3 className="font-black text-xs sm:text-sm text-white group-hover:text-stadiumGreen transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>
          <p className="line-clamp-2 text-gray-400 text-xs font-sans leading-relaxed">
            {article.description}
          </p>
        </div>
      </div>

      <div className="px-3.5 pb-3.5 pt-1 flex items-center justify-between border-t border-white/5 text-[11px] text-gray-500">
        <span className="flex items-center space-x-1">
          <Clock className="w-3 h-3 text-stadiumGreen" />
          <span>Just now</span>
        </span>

        <div className="flex items-center space-x-1.5">
          {onOpenSummary && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                phoneHardware.triggerHaptic('SELECTION');
                stadiumAudio.playAddPickSound();
                onOpenSummary(article);
              }}
              className="px-2 py-1 rounded-lg bg-stadiumGreen/15 hover:bg-stadiumGreen text-stadiumGreen hover:text-black font-black text-[10px] transition-all flex items-center space-x-1 border border-stadiumGreen/30"
            >
              <Zap className="w-2.5 h-2.5" />
              <span>Quick Take</span>
            </button>
          )}

          <button
            onClick={handleShareWhatsApp}
            className="p-1 rounded-lg bg-white/5 hover:bg-[#25D366] text-gray-400 hover:text-black transition-all"
            title="Share on WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
