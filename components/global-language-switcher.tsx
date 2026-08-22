'use client';

import React, { useState, useEffect } from 'react';
import {
  SUPPORTED_LANGUAGES,
  LanguageCode,
  getStoredLanguage,
  setStoredLanguage,
  getLanguageMeta,
  detectBrowserLanguage,
} from '../lib/translation-engine';
import { Globe } from 'lucide-react';

/**
 * GLOBAL LANGUAGE SWITCHER
 * Auto-detects the visitor's browser language on first load and lets them
 * switch to any of 34 supported languages. The selection is persisted and the
 * document `lang`/`dir` attributes are kept in sync for a11y & RTL support.
 */
export function useAppLanguage(): LanguageCode {
  const [lang, setLang] = useState<LanguageCode>('en');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = getStoredLanguage();
    const initial = stored || detectBrowserLanguage();
    setLang(initial);
    applyLanguage(initial);
  }, []);

  return lang;
}

function applyLanguage(code: LanguageCode) {
  if (typeof document === 'undefined') return;
  const meta = getLanguageMeta(code);
  document.documentElement.lang = code;
  document.documentElement.dir = meta.dir;
}

export function changeLanguage(code: LanguageCode) {
  setStoredLanguage(code);
  applyLanguage(code);
  // Re-render consumers via a custom event.
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('aurascore:language', { detail: code }));
  }
}

export const GlobalLanguageSwitcher: React.FC = () => {
  const [lang, setLang] = useState<LanguageCode>('en');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const initial = getStoredLanguage() || detectBrowserLanguage();
    setLang(initial);

    const handler = (e: Event) => {
      setLang((e as CustomEvent).detail || 'en');
    };
    window.addEventListener('aurascore:language', handler);
    return () => window.removeEventListener('aurascore:language', handler);
  }, []);

  const meta = getLanguageMeta(lang);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-1.5 rounded-2xl bg-panel border border-white/10 hover:border-stadiumGreen/40 px-2.5 py-2 text-xs font-bold text-white transition-all"
        title="Change language / Language"
      >
        <Globe className="w-3.5 h-3.5 text-stadiumGreen" />
        <span>{meta.flag}</span>
        <span className="hidden sm:inline">{meta.code.toUpperCase()}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 z-50 w-64 max-h-[420px] overflow-y-auto rounded-2xl glass-panel-premium border border-stadiumGreen/30 shadow-2xl p-2">
            <div className="px-2 py-1.5 text-[10px] font-black text-gray-400 uppercase tracking-wider border-b border-white/10 mb-1">
              🌍 Language / Sprache / Idioma
            </div>
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  changeLanguage(l.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-bold transition-all ${
                  lang === l.code
                    ? 'bg-stadiumGreen/20 text-stadiumGreen'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-base">{l.flag}</span>
                  <span>{l.name}</span>
                </span>
                {lang === l.code && <span className="text-stadiumGreen">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};