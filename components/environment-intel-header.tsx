'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, CloudSun, Wind, RefreshCw, User, Edit3, Check, Globe, 
  Sparkles, Zap, Smartphone, ChevronRight, Volume2, BellRing, Trophy, X, Search, Compass 
} from 'lucide-react';
import { LocationIntelligenceEngine, LocationIntelData } from '../lib/location-intelligence-engine';
import { useTranslation, SUPPORTED_LANGUAGES, LanguageCode } from '../lib/translation-engine';
import { phoneHardware } from '../lib/phone-hardware-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { PowerSaverEngine } from '../lib/power-saver-engine';
import { LiveMatchFxEngine, LiveFxMode, LiveGoalEvent } from '../lib/live-match-fx-engine';
import confetti from 'canvas-confetti';

const POPULAR_HUBS = [
  { city: 'Lagos', state: 'Lagos', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Abuja', state: 'FCT', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Port Harcourt', state: 'Rivers', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Ibadan', state: 'Oyo', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Enugu', state: 'Enugu', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Kano', state: 'Kano', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Accra', state: 'Greater Accra', country: 'Ghana', flag: '🇬🇭' },
  { city: 'Nairobi', state: 'Nairobi', country: 'Kenya', flag: '🇰🇪' },
  { city: 'Johannesburg', state: 'Gauteng', country: 'South Africa', flag: '🇿🇦' },
  { city: 'London', state: 'England', country: 'United Kingdom', flag: '🇬🇧' },
  { city: 'Manchester', state: 'England', country: 'United Kingdom', flag: '🇬🇧' },
  { city: 'New York', state: 'NY', country: 'United States', flag: '🇺🇸' },
];

export const EnvironmentIntelHeader: React.FC = () => {
  const [intel, setIntel] = useState<LocationIntelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [customCitySearch, setCustomCitySearch] = useState('');
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

  const handleSelectCity = (city: string) => {
    LocationIntelligenceEngine.setCustomLocation(city);
    setShowLocationPicker(false);
    loadIntel();
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.1 } });
  };

  const handleAutoDetectGps = () => {
    LocationIntelligenceEngine.clearCustomLocation();
    setShowLocationPicker(false);
    loadIntel();
    try { phoneHardware.triggerHaptic('SUCCESS'); } catch {}
  };

  const handleCustomCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCitySearch.trim()) return;
    handleSelectCity(customCitySearch.trim());
    setCustomCitySearch('');
  };

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
          
          {/* Location Badge (Clickable to switch or enter location) */}
          <button
            onClick={() => {
              try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
              setShowLocationPicker(true);
            }}
            className="flex items-center space-x-1.5 bg-black/80 hover:bg-white/10 px-2.5 py-1 rounded-xl border border-white/10 text-[11px] text-white transition-all group"
            title="Click to change location / city manually or auto-detect"
          >
            <MapPin className="w-3.5 h-3.5 text-stadiumGreen animate-pulse flex-shrink-0" />
            <span className="font-bold">{intel.city}, {intel.countryName}</span>
            <span className="text-[9px] text-stadiumGreen group-hover:underline">({intel.isManualOverride ? 'Set' : 'Auto'}) 📍</span>
          </button>

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

          {/* User Nickname / Personal Device Profile */}
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
                className="p-1 rounded-lg bg-stadiumGreen text-black font-bold"
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

      {/* Interactive Location Picker Modal */}
      {showLocationPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0a0d14] border border-white/15 rounded-3xl p-5 space-y-4 shadow-2xl text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-stadiumGreen" />
                <h3 className="font-black text-sm text-white">Select or Enter Your Location</h3>
              </div>
              <button
                onClick={() => setShowLocationPicker(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Auto Detect Button */}
            <button
              onClick={handleAutoDetectGps}
              className="w-full py-2.5 px-4 rounded-2xl bg-stadiumGreen/20 hover:bg-stadiumGreen/30 border border-stadiumGreen/40 text-stadiumGreen font-black text-xs flex items-center justify-center space-x-2 transition-all"
            >
              <Compass className="w-4 h-4 animate-spin text-stadiumGreen" />
              <span>📍 Auto-Detect GPS Location</span>
            </button>

            {/* Custom City Search Input */}
            <form onSubmit={handleCustomCitySubmit} className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={customCitySearch}
                  onChange={(e) => setCustomCitySearch(e.target.value)}
                  placeholder="Enter city (e.g. Lagos, Abuja, London)..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/80 border border-white/15 text-white text-xs focus:outline-none focus:border-stadiumGreen"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-stadiumGreen text-black font-black text-xs"
              >
                Set
              </button>
            </form>

            {/* Quick Hub Buttons */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Popular Cities & Stadium Hubs:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {POPULAR_HUBS.map((hub) => (
                  <button
                    key={hub.city}
                    onClick={() => handleSelectCity(hub.city)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-stadiumGreen/40 text-left text-xs transition-all flex items-center justify-between"
                  >
                    <span className="font-bold truncate">{hub.city}</span>
                    <span>{hub.flag}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 text-center">
              <span className="text-[10px] text-gray-400">
                Support email: <strong className="text-gold">mivajtips@gmail.com</strong>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
