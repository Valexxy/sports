'use client';

import React, { useState } from 'react';
import { useTranslation, SUPPORTED_LANGUAGES, LanguageCode } from '../lib/translation-engine';
import { Globe, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const GlobalLanguageSwitcher: React.FC<{ floating?: boolean }> = ({ floating = false }) => {
  const { lang, setLang, meta } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleSelectLanguage = (code: LanguageCode) => {
    setLang(code);
    setOpen(false);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.2 } });
    if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate([60]);
  };

  if (floating) {
    return (
      <div className="fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-50 font-mono">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center space-x-2 rounded-full bg-black/95 hover:bg-black border-2 border-stadiumGreen px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs font-black text-white shadow-2xl backdrop-blur-xl transition-all hover:scale-105 active:scale-95 glow-emerald"
          title="Change language / Ede / Asụsụ / Harshe"
        >
          <Globe className="w-4 h-4 text-stadiumGreen animate-spin-slow" />
          <span className="text-base">{meta.flag}</span>
          <span className="text-[11px] text-stadiumGreen uppercase font-black">{meta.name}</span>
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <div className="absolute bottom-12 right-0 z-50 w-72 max-h-[440px] overflow-y-auto rounded-3xl glass-panel-premium border-2 border-stadiumGreen shadow-2xl p-2.5 space-y-1 animate-scaleIn">
              <div className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider border-b border-white/10 flex items-center justify-between">
                <span>🌍 SELECT LANGUAGE / ASÙSÙ</span>
                <span className="text-stadiumGreen text-[9px] font-black">NAIJA FIRST 🇳🇬</span>
              </div>

              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => handleSelectLanguage(l.code)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-left text-xs font-bold transition-all ${
                    lang === l.code
                      ? 'bg-stadiumGreen text-black font-black shadow-lg shadow-stadiumGreen/30'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-base">{l.flag}</span>
                    <div>
                      <div className="font-black leading-tight">{l.name}</div>
                      <div className={`text-[9px] ${lang === l.code ? 'text-black/80 font-mono' : 'text-gray-400'}`}>
                        {l.greeting}
                      </div>
                    </div>
                  </div>
                  {lang === l.code && <Check className="w-4 h-4 text-black flex-shrink-0" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-1.5 rounded-2xl bg-black/80 hover:bg-black border border-stadiumGreen/40 hover:border-stadiumGreen px-3 py-2 text-xs font-black text-white shadow-xl backdrop-blur-md transition-all hover:scale-105"
        title="Change language / Ede / Asụsụ / Harshe"
      >
        <Globe className="w-3.5 h-3.5 text-stadiumGreen animate-spin-slow" />
        <span className="text-sm">{meta.flag}</span>
        <span className="font-mono text-[11px] text-stadiumGreen uppercase font-black">{meta.name}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 z-50 w-72 max-h-[440px] overflow-y-auto rounded-3xl glass-panel-premium border-2 border-stadiumGreen/50 shadow-2xl p-2.5 space-y-1 animate-scaleIn font-mono">
            <div className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider border-b border-white/10 flex items-center justify-between">
              <span>🌍 SELECT LANGUAGE / ASÙSÙ</span>
              <span className="text-stadiumGreen text-[9px] font-black">NAIJA FIRST 🇳🇬</span>
            </div>

            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => handleSelectLanguage(l.code)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-left text-xs font-bold transition-all ${
                  lang === l.code
                    ? 'bg-stadiumGreen text-black font-black shadow-lg shadow-stadiumGreen/30'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-base">{l.flag}</span>
                  <div>
                    <div className="font-black leading-tight">{l.name}</div>
                    <div className={`text-[9px] ${lang === l.code ? 'text-black/80 font-mono' : 'text-gray-400'}`}>
                      {l.greeting}
                    </div>
                  </div>
                </div>
                {lang === l.code && <Check className="w-4 h-4 text-black flex-shrink-0" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
