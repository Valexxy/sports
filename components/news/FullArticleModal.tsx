'use client';

import React, { useState } from 'react';
import { X, Globe, Share2, Sparkles, Check, ChevronDown, Send, MessageCircle } from 'lucide-react';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';
import { LanguageCode } from '../../lib/translation-engine';
import { GenZFanArena } from '../gen-z-fan-arena';

export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  publishedAt: string;
  imageUrl?: string;
  summary: string;
  bodyPidgin: string;
  bodyEnglish: string;
}

interface FullArticleModalProps {
  isOpen: boolean;
  article: NewsArticle | null;
  onClose: () => void;
}

export const FullArticleModal: React.FC<FullArticleModalProps> = ({ isOpen, article, onClose }) => {
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('pidgin');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !article) return null;

  const languages: Array<{ code: LanguageCode; label: string; flag: string }> = [
    { code: 'pidgin', label: 'Nigerian Pidgin', flag: '🇳🇬' },
    { code: 'igbo',   label: 'Asụsụ Igbo',       flag: '🇳🇬' },
    { code: 'hausa',  label: 'Harshen Hausa',    flag: '🇳🇬' },
    { code: 'yoruba', label: 'Èdè Yorùbá',       flag: '🇳🇬' },
    { code: 'en',     label: 'English (UK)',     flag: '🇬🇧' },
    { code: 'fr',     label: 'Français',         flag: '🇫🇷' },
    { code: 'es',     label: 'Español',          flag: '🇪🇸' },
    { code: 'ar',     label: 'العربية',          flag: '🇸🇦' },
    { code: 'pt',     label: 'Português',        flag: '🇵🇹' },
    { code: 'de',     label: 'Deutsch',          flag: '🇩🇪' },
  ];

  // Derive dynamic content based on 10 languages
  const getContent = () => {
    if (selectedLang === 'pidgin') return article.bodyPidgin;
    if (selectedLang === 'en') return article.bodyEnglish;
    if (selectedLang === 'igbo') {
      return `[Asụsụ Igbo] Akụkọ pụrụ iche: ${article.summary}\n\nNdị nyocha egwuregwu anyị kwadoro na mgbanwe a ga-eme ka bọọlụ nwee ọganihu dị ukwuu n'afọ a. Ndị isi otu na ndị nkuzi na-etinye aka iji hụ na egwuregwu na-aga nke ọma.\n\nSonye na ọwa Telegram anyị iji nweta amụma bọọlụ kacha mma na akụkọ ndụ site na ama egwuregwu!`;
    }
    if (selectedLang === 'hausa') {
      return `[Harshen Hausa] Labarai masu zafi: ${article.summary}\n\nMasana harkokin kwallon kafa sun tabbatar da cewa wannan ci gaban zai kawo babban canji a gasar ta bana. Masu kula da kungiyoyi suna shirye-shiryen karshe don tabbatar da nasara.\n\nKasance tare da dandalinmu na Telegram don samun sahihan hasashen wasanni kai tsaye daga filin wasa!`;
    }
    if (selectedLang === 'yoruba') {
      return `[Èdè Yorùbá] Ìròyìn tó ń lọ lọ́wọ́: ${article.summary}\n\nÀwọn olùtúpalẹ̀ bọ́ọ̀lù ti fìdí rẹ̀ múlẹ̀ pé ìdàgbàsókè yìí yóò yí gbogbo eré padà ní àsìkò yìí. Àwọn alákòóso àti olùkọ́ ń ṣe ìtọ́jú ìkẹyìn láti ríi dájú pé àwọn agbábọ́ọ̀lù ń gbá dáadáa.\n\nDarapọ̀ mọ́ ikanni Telegram wa fún àwọn ìsọtẹ́lẹ̀ tó dájú àti ìròyìn tààrà láti pápá ìṣeré!`;
    }
    if (selectedLang === 'fr') {
      return `[Français] Analyse exclusive: ${article.summary}\n\n${article.bodyEnglish}\n\nRejoignez notre chaîne Telegram officielle pour des pronostics d'experts et les dernières informations sportives en direct.`;
    }
    if (selectedLang === 'es') {
      return `[Español] Análisis táctico: ${article.summary}\n\n${article.bodyEnglish}\n\nÚnete a nuestro canal oficial de Telegram para obtener pronósticos verificados y las últimas novedades en directo.`;
    }
    if (selectedLang === 'ar') {
      return `[العربية] تحليل خاص: ${article.summary}\n\n${article.bodyEnglish}\n\nانضم إلى قناتنا الرسمية على تيليجرام للحصول على أحدث التوقعات المؤكدة والأخبار الرياضية المباشرة.`;
    }
    if (selectedLang === 'pt') {
      return `[Português] Análise tática: ${article.summary}\n\n${article.bodyEnglish}\n\nJunte-se ao nosso canal oficial no Telegram para receber previsões verificadas e notícias esportivas em tempo real.`;
    }
    if (selectedLang === 'de') {
      return `[Deutsch] Taktische Analyse: ${article.summary}\n\n${article.bodyEnglish}\n\nTreten Sie unserem offiziellen Telegram-Kanal bei, um geprüfte Wetttipps und Live-Updates direkt aus dem Stadion zu erhalten.`;
    }
    return article.bodyEnglish;
  };

  const currentMeta = languages.find(l => l.code === selectedLang) || languages[0];

  // Universal Share Trigger (Supports any social media in the world)
  const handleUniversalShare = (platform?: 'whatsapp' | 'telegram' | 'twitter' | 'facebook' | 'native') => {
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playBookmarkSound();

    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://mivaj.com';
    const shareText = `🔥 ${article.title}\n\nRead full breakdown on Mivaj Sports 🚀\n${shareUrl}`;

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
      return;
    }

    if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`, '_blank');
      return;
    }

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}&via=mivaj_sports`, '_blank');
      return;
    }

    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
      return;
    }

    // Native Web Share API for Mobile
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: shareUrl,
      }).catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${article.title} - ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 animate-fadeIn font-mono text-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0a0d14] rounded-3xl border-2 border-stadiumGreen/60 shadow-2xl p-4 sm:p-6 space-y-4 max-h-[92vh] flex flex-col text-white glow-emerald my-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-stadiumGreen font-black text-xs transition-all flex items-center space-x-1"
          >
            <span>&larr; Back to Wire</span>
          </button>

          {/* 10-Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="px-3 py-1.5 rounded-xl bg-gold/20 hover:bg-gold/30 text-gold border border-gold/40 font-black text-xs flex items-center space-x-1.5 transition-all shadow-md"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{currentMeta.flag} {currentMeta.label}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showLangDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 max-h-72 overflow-y-auto bg-[#0a0d14] rounded-2xl border-2 border-gold/60 shadow-2xl p-1.5 space-y-1 z-30 animate-fadeIn">
                <div className="px-2.5 py-1 text-[9px] font-black text-gray-400 uppercase tracking-wider border-b border-white/10">
                  Select Language (10 Available)
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang.code);
                      setShowLangDropdown(false);
                      phoneHardware.triggerHaptic('SELECTION');
                      stadiumAudio.playTabClickSound();
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                      selectedLang === lang.code ? 'bg-gold text-black font-black' : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </span>
                    {selectedLang === lang.code && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Article Content Container */}
        <div className="overflow-y-auto pr-1 space-y-4 flex-1">
          {article.imageUrl && (
            <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden border border-white/10 relative">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>
          )}

          <div className="space-y-1">
            <h2 className="text-base sm:text-xl font-black text-white leading-tight">
              {article.title}
            </h2>
            <div className="flex items-center space-x-2 text-[10px] text-gray-400">
              <span className="text-stadiumGreen font-bold">● Published {article.publishedAt}</span>
              <span>&bull;</span>
              <span>Mivaj Sports Editorial Desk</span>
            </div>
          </div>

          {/* Dynamic Takeaway Highlight Box */}
          <div className="p-3.5 rounded-2xl bg-stadiumGreen/10 border border-stadiumGreen/30 space-y-1">
            <span className="text-[10px] text-stadiumGreen font-black uppercase tracking-wider block">
              ⚡ KEY MATCHDAY TAKEAWAY
            </span>
            <p className="text-xs text-white font-sans font-bold">
              {article.summary}
            </p>
          </div>

          {/* Full Body Text */}
          <div className="space-y-3 text-xs sm:text-sm text-gray-200 font-sans leading-relaxed whitespace-pre-line">
            {getContent()}
          </div>

          {/* Gen Z Fan Arena & Live Banter */}
          <div className="pt-3">
            <GenZFanArena
              targetId={article.id}
              targetTitle={article.title}
              type="NEWS"
            />
          </div>
        </div>

        {/* Universal Global Social Share Toolbar */}
        <div className="pt-3 border-t border-white/10 space-y-2 flex-shrink-0">
          <span className="text-[10px] text-gray-400 block font-bold uppercase">
            SHARE THIS STORY TO ANY SOCIAL MEDIA:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handleUniversalShare('whatsapp')}
              className="py-2.5 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-[#25D366] font-black text-[11px] flex items-center justify-center space-x-1.5 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => handleUniversalShare('telegram')}
              className="py-2.5 px-3 rounded-xl bg-[#0088cc]/20 hover:bg-[#0088cc]/30 border border-[#0088cc]/50 text-[#0088cc] font-black text-[11px] flex items-center justify-center space-x-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram</span>
            </button>

            <button
              onClick={() => handleUniversalShare('twitter')}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-[11px] flex items-center justify-center space-x-1.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>X / Twitter</span>
            </button>

            <button
              onClick={() => handleUniversalShare('native')}
              className="py-2.5 px-3 rounded-xl bg-stadiumGreen/20 hover:bg-stadiumGreen/30 border border-stadiumGreen/50 text-stadiumGreen font-black text-[11px] flex items-center justify-center space-x-1.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5 text-stadiumGreen" />
              <span>{copied ? 'Link Copied! ✓' : 'More / Copy'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
