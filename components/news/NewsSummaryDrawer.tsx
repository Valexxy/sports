'use client';

import React, { useState } from 'react';
import { X, Zap, Globe2, Sparkles, Share2, ArrowRight } from 'lucide-react';
import { stadiumAudio } from '../../lib/sound-synthesizer';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { translateToPidgin } from '../../lib/pidgin-translator';

interface NewsSummaryDrawerProps {
  article: {
    id: string;
    title: string;
    description: string;
    url: string;
    imageUrl?: string;
    category?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onReadFull?: (article: any) => void;
}

export const NewsSummaryDrawer: React.FC<NewsSummaryDrawerProps> = ({
  article,
  isOpen,
  onClose,
  onReadFull,
}) => {
  const [usePidgin, setUsePidgin] = useState(true);

  if (!isOpen || !article) return null;

  const pidginTitle = translateToPidgin(article.title);
  const pidginDesc = translateToPidgin(article.description);

  const bullets = usePidgin
    ? [
        pidginTitle,
        pidginDesc,
        'Join Mivaj Telegram make you no miss any hot transfer banger!',
      ]
    : [
        article.title,
        article.description,
        'Full verified reporting and updates published on official sports wire.',
      ];

  const handleShareWhatsApp = () => {
    phoneHardware.triggerHaptic('SELECTION');
    stadiumAudio.playBookmarkSound();
    const text = encodeURIComponent(`🚨 *${usePidgin ? pidginTitle : article.title}*\n\n${usePidgin ? pidginDesc : article.description}\n\nRead on Mivaj: https://mivaj.com`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center animate-fadeIn font-mono text-xs">
      <div className="w-full max-w-xl bg-[#0d111a] border-t-2 border-stadiumGreen/60 rounded-t-3xl p-5 space-y-4 text-white shadow-2xl animate-slideUp glow-emerald">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2 text-stadiumGreen">
            <Zap className="w-4 h-4 fill-stadiumGreen" />
            <span className="font-black text-sm">3-BULLET QUICK TAKE</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                phoneHardware.triggerHaptic('SELECTION');
                stadiumAudio.playTabClickSound();
                setUsePidgin(!usePidgin);
              }}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-black border transition-all ${
                usePidgin ? 'bg-gold text-black border-gold shadow' : 'bg-white/10 text-gray-300 border-white/10'
              }`}
            >
              <span>{usePidgin ? '🇳🇬 Pidgin ON' : 'Translate Pidgin'}</span>
            </button>

            <button onClick={onClose} className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bullets */}
        <div className="space-y-2.5 font-sans text-xs text-gray-200">
          {bullets.map((b, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-black/50 border border-white/5 flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-lg bg-stadiumGreen/20 text-stadiumGreen font-mono font-black text-[10px] flex items-center justify-center flex-shrink-0">
                {idx + 1}
              </span>
              <p className="leading-relaxed">{b}</p>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between gap-2">
          <button
            onClick={() => {
              phoneHardware.triggerHaptic('SELECTION');
              stadiumAudio.playAddPickSound();
              onClose();
              if (onReadFull) onReadFull(article);
            }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-stadiumGreen text-black font-black text-xs hover:bg-stadiumGreen/90 transition-all flex items-center justify-center space-x-1.5 shadow-lg"
          >
            <span>Read Full Article</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="px-3.5 py-2.5 rounded-xl bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 font-bold text-xs flex items-center space-x-1.5 hover:bg-[#25D366] hover:text-black transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share WhatsApp</span>
          </button>
        </div>

      </div>
    </div>
  );
};
