'use client';
import React from 'react';
import { Globe, DollarSign, Activity } from 'lucide-react';

interface SettingsBarProps {
  selectedSport: 'SOCCER' | 'BASKETBALL' | 'TENNIS';
  onSelectSport: (sport: 'SOCCER' | 'BASKETBALL' | 'TENNIS') => void;
  currency: string;
  onChangeCurrency: (curr: string) => void;
  oddsFormat: 'DECIMAL' | 'FRACTIONAL' | 'AMERICAN';
  onChangeOddsFormat: (fmt: 'DECIMAL' | 'FRACTIONAL' | 'AMERICAN') => void;
}

export const GlobalSettingsBar: React.FC<SettingsBarProps> = ({
  selectedSport,
  onSelectSport,
  currency,
  onChangeCurrency,
  oddsFormat,
  onChangeOddsFormat,
}) => {
  return (
    <div className="bg-panel/80 p-3 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
      
      {/* Multi-Sport Selector */}
      <div className="flex items-center space-x-1.5 w-full sm:w-auto">
        <Activity className="w-4 h-4 text-stadiumGreen" />
        <span className="text-gray-400 font-bold uppercase mr-1">SPORT:</span>
        <button
          onClick={() => onSelectSport('SOCCER')}
          className={`px-3 py-1 rounded-xl font-bold transition-all ${
            selectedSport === 'SOCCER' ? 'bg-stadiumGreen text-black' : 'bg-black/40 text-gray-400 hover:text-white'
          }`}
        >
          ⚽ Football
        </button>
        <button
          onClick={() => onSelectSport('BASKETBALL')}
          className={`px-3 py-1 rounded-xl font-bold transition-all ${
            selectedSport === 'BASKETBALL' ? 'bg-gold text-black' : 'bg-black/40 text-gray-400 hover:text-white'
          }`}
        >
          🏀 NBA
        </button>
        <button
          onClick={() => onSelectSport('TENNIS')}
          className={`px-3 py-1 rounded-xl font-bold transition-all ${
            selectedSport === 'TENNIS' ? 'bg-cyberPurple text-white' : 'bg-black/40 text-gray-400 hover:text-white'
          }`}
        >
          🎾 Tennis
        </button>
      </div>

      {/* Global Currency & Odds Format Selector */}
      <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
        
        {/* Currency Picker */}
        <div className="flex items-center space-x-1">
          <Globe className="w-3.5 h-3.5 text-gold" />
          <select
            value={currency}
            onChange={(e) => onChangeCurrency(e.target.value)}
            className="bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-white font-bold focus:border-stadiumGreen focus:outline-none"
          >
            <option value="$">USD ($)</option>
            <option value="€">EUR (€)</option>
            <option value="£">GBP (£)</option>
            <option value="₦">NGN (₦)</option>
            <option value="KSh">KES (KSh)</option>
            <option value="R">ZAR (R)</option>
          </select>
        </div>

        {/* Odds Format Picker */}
        <select
          value={oddsFormat}
          onChange={(e) => onChangeOddsFormat(e.target.value as any)}
          className="bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-stadiumGreen font-bold focus:border-stadiumGreen focus:outline-none"
        >
          <option value="DECIMAL">Decimal (1.85)</option>
          <option value="FRACTIONAL">Fractional (5/6)</option>
          <option value="AMERICAN">American (-118)</option>
        </select>

      </div>

    </div>
  );
};
