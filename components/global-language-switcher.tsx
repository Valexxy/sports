'use client';
import React, { useState } from 'react';
import { useTranslation, SUPPORTED_LANGUAGES, LanguageCode } from '../lib/translation-engine';
import { Globe, Check, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';

export const GlobalLanguageSwitcher: React.FC = () => {
  const { lang, setLang, meta } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleSelectLanguage = (code: LanguageCode) => {
    setLang(code);
    setOpen(false);
    phoneHardware.triggerHaptic('SUCCESS');
    stadiumAudio.playTabClickSound();
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.1 } });
  };

  return (
    <div className="relative font-mono text-xs z-40">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-1.5 rounded-2xl bg-black/80 hover:bg-black border border-stadiumGreen/40 hover:border-stadiumGreen px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-black text-white shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95"
        title="Select Language (10 Global & Nigerian Languages)"
      >
        <Globe className="w-3.5 h-3.5 text-stadiumGreen" />
        <span className="text-sm">{meta.flag}</span>
        <span className="text-[10px] text-stadiumGreen uppercase font-black">{meta.code.toUpperCase()}</span>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 z-50 w-72 max-h-[480px] overflow-y-auto rounded-3xl bg-[#0a0d14] border-2 border-stadiumGreen shadow-2xl p-3 space-y-1 animate-scaleIn font-mono text-white glow-emerald">
            <div className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider border-b border-white/10 flex items-center justify-between">
              <span>🌍 SELECT LANGUAGE (10 TOTAL)</span>
              <span className="text-stadiumGreen text-[9px] font-black">NAIJA &bull; GLOBAL</span>
            </div>

            <div className="space-y-1 pt-1">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => handleSelectLanguage(l.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-bold transition-all ${
                    lang === l.code
                      ? 'bg-stadiumGreen text-black font-black shadow-lg shadow-stadiumGreen/30'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className="text-base flex-shrink-0">{l.flag}</span>
                    <div className="min-w-0 truncate">
                      <div className="font-black leading-tight truncate">{l.name} ({l.nativeName})</div>
                      <div className={`text-[9px] truncate ${lang === l.code ? 'text-black/80 font-mono' : 'text-gray-400'}`}>
                        {l.greeting}
                      </div>
                    </div>
                  </div>
                  {lang === l.code && <Check className="w-4 h-4 text-black flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
