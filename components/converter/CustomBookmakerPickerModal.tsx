'use client';

import React, { useState } from 'react';
import { X, Search, Check, Sparkles, Globe, Shield, Zap } from 'lucide-react';
import { GLOBAL_BOOKMAKERS, GlobalBookmakerMeta, TARGET_AFFILIATES } from '../../utils/affiliates';
import { phoneHardware } from '../../lib/phone-hardware-engine';
import { stadiumAudio } from '../../lib/sound-synthesizer';

interface CustomBookmakerPickerModalProps {
  isOpen: boolean;
  selectedId: string;
  onSelect: (bookmaker: GlobalBookmakerMeta) => void;
  onClose: () => void;
  title?: string;
}

export const CustomBookmakerPickerModal: React.FC<CustomBookmakerPickerModalProps> = ({
  isOpen,
  selectedId,
  onSelect,
  onClose,
  title = 'SELECT SOURCE BOOKMAKER',
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  if (!isOpen) return null;

  const categories = [
    { id: 'ALL', label: 'All Platforms' },
    { id: 'AFFILIATE', label: 'Top 5 Verified' },
    { id: 'NIGERIA', label: '🇳🇬 Nigeria' },
    { id: 'CRYPTO', label: '🪙 Crypto / Web3' },
    { id: 'UK_EUROPE', label: '🇬🇧 UK & Europe' },
    { id: 'US_SPORTSBOOK', label: '🇺🇸 US Books' },
  ];

  const filtered = GLOBAL_BOOKMAKERS.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase());
    if (activeCategory === 'ALL') return matchesSearch;
    if (activeCategory === 'CRYPTO') return matchesSearch && (b.id === 'STAKE' || b.category === 'CRYPTO');
    return matchesSearch && b.category === activeCategory;
  });

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 animate-fadeIn font-mono text-xs">
      <div className="relative w-full max-w-2xl bg-[#0a0d14] rounded-3xl border-2 border-stadiumGreen/60 shadow-2xl p-4 sm:p-6 space-y-4 max-h-[90vh] flex flex-col text-white glow-emerald">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-stadiumGreen/20 text-stadiumGreen">🌐</span>
            <h3 className="font-black text-sm text-white tracking-wider uppercase">{title}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 50+ bookmakers (e.g. Stake, Bet9ja, 22Bet, SportyBet, Bet365...)"
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/60 border border-white/20 text-white placeholder-gray-500 text-xs font-mono focus:border-stadiumGreen focus:outline-none"
            autoFocus
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                phoneHardware.triggerHaptic('SELECTION');
                stadiumAudio.playTabClickSound();
                setActiveCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-stadiumGreen text-black font-black shadow-md shadow-stadiumGreen/30'
                  : 'bg-panel border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Bookmaker Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto pr-1 flex-1 max-h-[50vh]">
          {filtered.map((b) => {
            const isSelected = selectedId.toUpperCase() === b.id.toUpperCase();
            return (
              <button
                key={b.id}
                onClick={() => {
                  phoneHardware.triggerHaptic('SUCCESS');
                  stadiumAudio.playBookmarkSound();
                  onSelect(b);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all group hover:scale-[1.02] ${
                  isSelected
                    ? 'bg-stadiumGreen/20 border-stadiumGreen shadow-lg shadow-stadiumGreen/20'
                    : 'bg-black/40 border-white/10 hover:border-white/30 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="text-xl p-2 rounded-xl bg-black/50 border border-white/10">{b.logoEmoji}</span>
                  <div className="min-w-0">
                    <div className="font-black text-white text-xs truncate flex items-center space-x-1.5">
                      <span>{b.name}</span>
                      {b.category === 'AFFILIATE' && (
                        <span className="px-1.5 py-0.2 rounded bg-gold/20 text-gold text-[9px] font-mono">
                          ★ TOP
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 block font-sans truncate">{b.promoBadge}</span>
                  </div>
                </div>

                {isSelected && (
                  <div className="p-1 rounded-full bg-stadiumGreen text-black flex-shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
