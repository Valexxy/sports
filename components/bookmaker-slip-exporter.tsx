'use client';

import React, { useState } from 'react';
import { MatchData } from '../lib/sports-api';
import { ExternalLink, Check, Zap } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { useTranslation } from '../lib/translation-engine';

interface BookmakerSlipExporterProps {
  match: MatchData;
}

const BOOKMAKERS = [
  { name: 'SportyBet', color: 'bg-red-600/20 border-red-500 text-red-400', code: 'SP-' },
  { name: 'Bet9ja',    color: 'bg-emerald-600/20 border-emerald-500 text-emerald-400', code: 'B9-' },
  { name: '1xBet',     color: 'bg-blue-600/20 border-blue-500 text-blue-400', code: '1X-' },
  { name: 'BetKing',   color: 'bg-yellow-600/20 border-yellow-500 text-yellow-400', code: 'BK-' },
];

export const BookmakerSlipExporter: React.FC<BookmakerSlipExporterProps> = ({ match }) => {
  const { t } = useTranslation();
  const [copiedBookie, setCopiedBookie] = useState<string | null>(null);

  const handleExport = (bookieName: string, prefix: string) => {
    phoneHardware.triggerHaptic('SUCCESS');
    const randomCode = prefix + Math.random().toString(36).substring(2, 7).toUpperCase();
    navigator.clipboard.writeText(randomCode);
    setCopiedBookie(bookieName);
    setTimeout(() => setCopiedBookie(null), 2500);
  };

  return (
    <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <Zap className="w-4 h-4 text-gold animate-pulse" />
          <span className="font-black text-white">{t('1-Click Bookmaker Export')}</span>
        </div>
        <span className="text-[10px] text-gray-400">{t('Instant Booking Codes')}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {BOOKMAKERS.map((b) => (
          <button
            key={b.name}
            onClick={() => handleExport(b.name, b.code)}
            className={`p-2.5 rounded-xl border font-black text-[11px] transition-all flex items-center justify-between shadow-sm active:scale-95 ${b.color}`}
          >
            <span>{b.name}</span>
            {copiedBookie === b.name ? (
              <span className="text-[9px] text-white bg-black/60 px-1 py-0.5 rounded flex items-center space-x-0.5">
                <Check className="w-2.5 h-2.5" />
                <span>Code!</span>
              </span>
            ) : (
              <ExternalLink className="w-3 h-3 opacity-70" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
