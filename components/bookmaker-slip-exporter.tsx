'use client';

import React, { useState } from 'react';
import { MatchData } from '../lib/sports-api';
import { ExternalLink, Check, Zap, Sparkles } from 'lucide-react';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { useTranslation } from '../lib/translation-engine';
import { NIGERIAN_BOOKMAKERS_REGISTRY, universalBookmakerBridge } from '../lib/universal-bookmaker-registry';
import confetti from 'canvas-confetti';

interface BookmakerSlipExporterProps {
  match: MatchData;
}

export const BookmakerSlipExporter: React.FC<BookmakerSlipExporterProps> = ({ match }) => {
  const { t } = useTranslation();
  const [copiedBookie, setCopiedBookie] = useState<string | null>(null);

  const p = match.prediction;

  const handleExport = (bookmakerId: string) => {
    phoneHardware.triggerHaptic('SUCCESS');
    confetti({ particleCount: 25, spread: 50 });
    
    const result = universalBookmakerBridge.loadBookmakerSlip(
      bookmakerId,
      match.homeTeam,
      match.awayTeam,
      p.topPick.selection,
      p.topPick.odds,
      match.league
    );

    setCopiedBookie(bookmakerId);
    setTimeout(() => setCopiedBookie(null), 3000);
  };

  return (
    <div className="p-4 rounded-3xl bg-black/70 border border-white/10 space-y-3 font-mono text-xs shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-gold animate-pulse" />
          <span className="font-black text-white text-xs">{t('Universal 1-Click Bookmaker Slip')}</span>
        </div>
        <span className="text-[10px] text-stadiumGreen font-black">🇳🇬 8 Nigerian Bookmakers</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {NIGERIAN_BOOKMAKERS_REGISTRY.map((b) => (
          <button
            key={b.id}
            onClick={() => handleExport(b.id)}
            className={`p-2.5 rounded-2xl border font-black text-[11px] transition-all flex items-center justify-between shadow-sm active:scale-95 ${b.badgeClass}`}
            title={`Load slip & booking code on ${b.name}`}
          >
            <div className="flex items-center space-x-1.5 min-w-0">
              <span>{b.logoEmoji}</span>
              <span className="truncate">{b.name}</span>
            </div>
            {copiedBookie === b.id ? (
              <span className="text-[9px] text-white bg-black/70 px-1 py-0.5 rounded flex items-center space-x-0.5">
                <Check className="w-2.5 h-2.5 text-stadiumGreen" />
                <span>Code!</span>
              </span>
            ) : (
              <ExternalLink className="w-3 h-3 opacity-60" />
            )}
          </button>
        ))}
      </div>
      
      <p className="text-[10px] text-gray-400 font-sans text-center">
        {t('1-Tap automatically copies formatted slip + booking code & opens bookmaker app.')}
      </p>
    </div>
  );
};
