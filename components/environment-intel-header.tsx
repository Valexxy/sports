'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, CloudSun, Wind, RefreshCw, User, Edit3, Check, Globe, 
  Sparkles, Zap, Smartphone, ChevronRight, Volume2, BellRing, Trophy 
} from 'lucide-react';
import { LocationIntelligenceEngine, LocationIntelData } from '../lib/location-intelligence-engine';
import { useTranslation, SUPPORTED_LANGUAGES, LanguageCode } from '../lib/translation-engine';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { PowerSaverEngine } from '../lib/power-saver-engine';
import { LiveMatchFxEngine, LiveFxMode, LiveGoalEvent } from '../lib/live-match-fx-engine';
import confetti from 'canvas-confetti';

export const EnvironmentIntelHeader: React.FC = () => {
  const [intel, setIntel] = useState<LocationIntelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const [fxMode, setFxMode] = useState<LiveFxMode>('FOLLOWED_ONLY');
  const [latestGoal, setLatestGoal] = useState<LiveGoalEvent | null>(null);
  const { lang, setLang } = useTranslation();

  const loadIntel = async () => {
    setLoading(true);
    const data = await LocationIntelligenceEngine.fetchHyperAccurateLocationIntel();
    setIntel(data);
    setNicknameInput(data.userNickname);
    setLoading(false);
  };

  useEffect(() => {
    LiveMatchFxEngine.init();
    setFxMode(LiveMatchFxEngine.getFxMode());

    loadIntel();

    // Battery-friendly refresh: pauses automatically when phone screen is locked or tab is hidden
    PowerSaverEngine.setBatteryFriendlyInterval('weather-intel-refresh', () => {
      loadIntel();
    }, 60000);

    // Subscribe to live goal events for toast notification
    const unsubscribeGoal = LiveMatchFxEngine.subscribeGoalEvents((event) => {
      setLatestGoal(event);
      setTimeout(() => setLatestGoal(null), 6000);
    });

    return () => {
      PowerSaverEngine.clearInterval('weather-intel-refresh');
      unsubscribeGoal();
    };
  }, []);

  const handleSaveNickname = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicknameInput.trim()) return;
    LocationIntelligenceEngine.setUserNickname(nicknameInput.trim());
    setEditingName(false);
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.2 } });
  };

  const handleToggleFxMode = () => {
    const nextMode: LiveFxMode = fxMode === 'FOLLOWED_ONLY' ? 'ALL_LIVE' : fxMode === 'ALL_LIVE' ? 'OFF' : 'FOLLOWED_ONLY';
    setFxMode(nextMode);
    LiveMatchFxEngine.setFxMode(nextMode);
  };

  const handleApplyRegionalLanguage = (suggestedLang: LanguageCode) => {
    setLang(suggestedLang);
    try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
    try { stadiumAudio.playTabClickSound(); } catch {}
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.2 } });
  };

  if (!intel) return null;

  const currentLangMeta = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];
  const suggestedLangMeta = SUPPORTED_LANGUAGES.find(l => l.code === intel.suggestedLanguage);

  return (
    <div className="w-full bg-gradient-to-r from-panel via-black to-panel border-b border-stadiumGreen/30 text-white font-mono text-xs relative z-40 shadow-lg">
      
      {/* Live Goal Pop Alert (Dynamic Island Style) */}
      {latestGoal && (
        <div className="bg-gradient-to-r from-stadiumGreen via-gold to-stadiumGreen p-2 text-black font-black text-xs flex items-center justify-between animate-bounce shadow-2xl">
          <div className="flex items-center space-x-2 truncate">
            <span className="p-1 rounded-lg bg-black text-stadiumGreen">⚽ GOAL!</span>
            <span>{latestGoal.scoringTeam} scores in {latestGoal.homeTeam} {latestGoal.homeScore}-{latestGoal.awayScore} {latestGoal.awayTeam} ({latestGoal.matchTime})</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] uppercase font-bold flex-shrink-0">
            {latestGoal.league}
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
        
        {/* Left: Hyper-Accurate Location, Weather & Greeting */}
        <div className="flex flex-wrap items-center gap-2 text-xs min-w-0">
          
          {/* Location Badge */}
          <div className="flex items-center space-x-1.5 bg-black/80 px-2.5 py-1 rounded-xl border border-white/10 text-[11px] text-white">
            <MapPin className="w-3.5 h-3.5 text-stadiumGreen animate-pulse flex-shrink-0" />
            <span className="font-bold">{intel.city}, {intel.countryName}</span>
          </div>

          {/* Live Weather & Temp */}
          <div className="flex items-center space-x-1.5 bg-black/80 px-2.5 py-1 rounded-xl border border-white/10 text-[11px]">
            <CloudSun className="w-3.5 h-3.5 text-gold flex-shrink-0" />
            <span className="font-bold text-white">{intel.temperature}°C</span>
            <span className="text-gray-400 font-sans hidden md:inline">{intel.weatherDescription}</span>
          </div>

          {/* Regional Greeting Text */}
          <div className="hidden lg:flex items-center space-x-1.5 text-stadiumGreen font-black text-xs">
            <span>👋</span>
            <span className="truncate">{intel.localGreeting}</span>
          </div>
        </div>

        {/* Right: Suggested Dialect Auto-Switch + FX Toggle + User Handle + Refresh */}
        <div className="flex items-center space-x-2 text-xs">
          
          {/* Live Phone Effects Toggle (Followed / All / Off) */}
          <button
            onClick={handleToggleFxMode}
            className={`px-2.5 py-1 rounded-xl border text-[10px] font-black transition-all flex items-center space-x-1 ${
              fxMode === 'FOLLOWED_ONLY'
                ? 'bg-stadiumGreen/20 text-stadiumGreen border-stadiumGreen/40'
                : fxMode === 'ALL_LIVE'
                ? 'bg-gold/20 text-gold border-gold/40'
                : 'bg-panel text-gray-400 border-white/10'
            }`}
            title="Toggle Live Match Goal Vibrations & Flash"
          >
            <Zap className="w-3 h-3" />
            <span>FX: {fxMode === 'FOLLOWED_ONLY' ? 'Followed 📳' : fxMode === 'ALL_LIVE' ? 'All Live 🔥' : 'Muted'}</span>
          </button>

          {/* Regional Dialect Suggestion Pill (if current language differs from region) */}
          {suggestedLangMeta && lang !== intel.suggestedLanguage && (
            <button
              onClick={() => handleApplyRegionalLanguage(intel.suggestedLanguage)}
              className="px-2.5 py-1 rounded-xl bg-stadiumGreen/20 hover:bg-stadiumGreen text-stadiumGreen hover:text-black border border-stadiumGreen/40 text-[10px] font-black transition-all flex items-center space-x-1 shadow-sm"
              title={`Switch to local ${suggestedLangMeta.name}`}
            >
              <span>{suggestedLangMeta.flag}</span>
              <span>Switch to {suggestedLangMeta.nativeName}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}

          {/* User Nickname / Device Profile */}
          {editingName ? (
            <form onSubmit={handleSaveNickname} className="flex items-center space-x-1">
              <input
                type="text"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                placeholder="Enter Nickname"
                className="px-2 py-0.5 rounded-lg bg-black border border-stadiumGreen text-white text-[11px] w-28 focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="p-1 rounded-lg bg-stadiumGreen text-black"
                title="Save"
              >
                <Check className="w-3 h-3" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="flex items-center space-x-1.5 bg-black/60 hover:bg-white/10 px-2.5 py-1 rounded-xl border border-white/10 text-[10px] text-gray-300 hover:text-white transition-all"
              title="Click to customize your fan handle"
            >
              <User className="w-3 h-3 text-gold" />
              <span className="font-bold truncate max-w-[100px]">{intel.userNickname}</span>
              <span className="text-[9px] text-gray-500 font-sans hidden sm:inline">({intel.deviceName})</span>
              <Edit3 className="w-2.5 h-2.5 text-gray-400" />
            </button>
          )}

          {/* Manual Intel Refresh */}
          <button
            onClick={loadIntel}
            className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            title="Refresh Location & Weather"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-stadiumGreen' : ''}`} />
          </button>
        </div>

      </div>
    </div>
  );
};
