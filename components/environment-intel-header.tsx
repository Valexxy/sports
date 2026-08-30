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
import { LiveActiveFansWidget } from './tracker/LiveActiveFansWidget';
import confetti from 'canvas-confetti';

const POPULAR_HUBS = [
  // Anambra Priority Hubs
  { city: 'Awka', state: 'Anambra', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Onitsha', state: 'Anambra', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Nnewi', state: 'Anambra', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Ekwulobia', state: 'Anambra', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Ihiala', state: 'Anambra', country: 'Nigeria', flag: '🇳🇬' },
  // Major Nigerian Hubs
  { city: 'Lagos', state: 'Lagos', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Abuja', state: 'FCT', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Enugu', state: 'Enugu', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Port Harcourt', state: 'Rivers', country: 'Nigeria', flag: '🇳🇬' },
  { city: 'Ibadan', state: 'Oyo', country: 'Nigeria', flag: '🇳🇬' },
  // International Hubs
  { city: 'London', state: 'England', country: 'United Kingdom', flag: '🇬🇧' },
  { city: 'Manchester', state: 'England', country: 'United Kingdom', flag: '🇬🇧' },
  { city: 'Nairobi', state: 'Nairobi', country: 'Kenya', flag: '🇰🇪' },
  { city: 'Johannesburg', state: 'Gauteng', country: 'South Africa', flag: '🇿🇦' },
  { city: 'Accra', state: 'Greater Accra', country: 'Ghana', flag: '🇬🇭' },
  { city: 'New York', state: 'NY', country: 'United States', flag: '🇺🇸' },
];

import { UserProfileEngine, UserProfileData } from '../lib/user-profile-engine';

export const EnvironmentIntelHeader: React.FC = () => {
  const [intel, setIntel] = useState<LocationIntelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfileData>(() => UserProfileEngine.getProfile());
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [customCitySearch, setCustomCitySearch] = useState('');
  const [fxMode, setFxMode] = useState<LiveFxMode>('FOLLOWED_ONLY');
  const [latestGoal, setLatestGoal] = useState<LiveGoalEvent | null>(null);
  const { lang, setLang } = useTranslation();

  const loadIntel = async (forceRefresh = false) => {
    setLoading(true);
    const data = await LocationIntelligenceEngine.fetchHyperAccurateLocationIntel(forceRefresh);
    setIntel(data);
    setUserProfile(UserProfileEngine.getProfile());
    setLoading(false);
  };

  useEffect(() => {
    LiveMatchFxEngine.init();
    setFxMode(LiveMatchFxEngine.getFxMode());

    // Initial mount: load cached or detect once
    loadIntel(false);

    // Weather refresh only (every 5 minutes, leaves city locked)
    PowerSaverEngine.setBatteryFriendlyInterval('weather-intel-refresh', () => {
      loadIntel(false);
    }, 300000);

    // Subscribe to live goal events for toast notification
    const unsubscribeGoal = LiveMatchFxEngine.subscribeGoalEvents((event) => {
      setLatestGoal(event);
      setTimeout(() => setLatestGoal(null), 6000);
    });

    // Listen for profile changes (e.g. edited username in profile modal/dashboard)
    const handleProfileUpdate = (e: any) => {
      if (e?.detail) setUserProfile(e.detail);
      else setUserProfile(UserProfileEngine.getProfile());
    };
    window.addEventListener('mivaj_profile_updated', handleProfileUpdate);

    return () => {
      PowerSaverEngine.clearInterval('weather-intel-refresh');
      unsubscribeGoal();
      window.removeEventListener('mivaj_profile_updated', handleProfileUpdate);
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
        
        {/* Left: Hyper-Accurate Location, Weather & Pitch Condition */}
        <div className="flex flex-wrap items-center gap-2 text-xs min-w-0">
          
          {/* Location Badge — click to open 1-Tap City Switcher */}
          <button
            onClick={() => {
              try { phoneHardware.triggerHaptic('SELECTION'); } catch {}
              setShowLocationPicker(true);
            }}
            className="flex items-center space-x-1.5 bg-black/80 hover:bg-white/10 px-2.5 py-1 rounded-xl border border-white/10 text-[11px] text-white transition-all group"
            title="Click to change location"
          >
            <MapPin className="w-3.5 h-3.5 text-stadiumGreen animate-pulse flex-shrink-0" />
            <span className="font-bold truncate max-w-[210px] sm:max-w-[280px]">
              {intel.formattedAddress || `${intel.city}, ${intel.countryName}`}
            </span>
            <span className="text-[9px] text-stadiumGreen">
              📍
            </span>
          </button>

          {/* Live Weather & Pitch Condition */}
          <div className="flex items-center space-x-1.5 bg-black/80 px-2.5 py-1 rounded-xl border border-white/10 text-[11px]">
            <CloudSun className="w-3.5 h-3.5 text-gold flex-shrink-0" />
            <span className="font-bold text-white">{intel.temperature}°C</span>
            <span className="text-gray-400 font-sans hidden md:inline">{intel.weatherDescription}</span>
            {intel.pitchCondition && (
              <span className="hidden lg:inline text-[9px] text-stadiumGreen font-mono px-1.5 py-0.5 rounded bg-stadiumGreen/10 border border-stadiumGreen/30">
                {intel.pitchCondition}
              </span>
            )}
          </div>

          {/* Regional Greeting Text */}
          <div className="hidden xl:flex items-center space-x-1.5 text-stadiumGreen font-black text-xs">
            <span>👋</span>
            <span className="truncate">{intel.localGreeting}</span>
          </div>

          {/* Real-time Live Fans Online Tracker */}
          <LiveActiveFansWidget />
        </div>

        {/* Right: FX Toggle + User Profile Link + Refresh */}
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
            title="Live Goal Alerts & Haptic Vibrations: Click to toggle (Followed Matches 📳 / All Live Games 🔥 / Muted 🔕)"
          >
            <Zap className={`w-3 h-3 ${fxMode === 'FOLLOWED_ONLY' ? 'text-stadiumGreen' : fxMode === 'ALL_LIVE' ? 'text-gold animate-pulse' : 'text-gray-500'}`} />
            <span>{fxMode === 'FOLLOWED_ONLY' ? '📳 Goal Alerts: Followed' : fxMode === 'ALL_LIVE' ? '🔥 Goal Alerts: All Live' : '🔕 Goal Alerts: Off'}</span>
          </button>

          {/* Profile Name (Edited ONLY in profile dashboard) */}
          <a
            href="/dashboard"
            className="flex items-center space-x-1.5 bg-black/70 hover:bg-white/10 px-2.5 py-1 rounded-xl border border-stadiumGreen/40 text-[10px] text-stadiumGreen hover:text-white transition-all shadow-sm group"
            title="Your fan profile — click to edit username, check level & referrals in Dashboard"
          >
            <User className="w-3 h-3 text-gold group-hover:scale-110 transition-transform" />
            <span className="font-black truncate max-w-[120px]">@{userProfile.username.replace(/^@/, '')}</span>
            <span className="text-[9px] px-1 rounded bg-stadiumGreen/20 text-stadiumGreen font-mono font-bold">
              LVL {userProfile.level?.level || 4}
            </span>
          </a>

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

      {/* 1-TAP CITY / AREA LOCATION SWITCHER MODAL */}
      {showLocationPicker && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowLocationPicker(false)}
        >
          <div
            className="bg-[#0a0f1a] border border-stadiumGreen/40 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-stadiumGreen" />
                <h3 className="font-extrabold text-sm text-white">Select Your Location</h3>
              </div>
              <button
                onClick={() => setShowLocationPicker(false)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* GPS Auto-Detect */}
            <button
              onClick={handleAutoDetectGps}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-stadiumGreen hover:bg-emerald-400 text-black font-extrabold text-xs transition-all shadow-md active:scale-95"
            >
              <MapPin className="w-4 h-4" />
              <span>Auto-Detect via GPS (Satellite Accurate)</span>
            </button>

            {/* Custom City Search */}
            <form onSubmit={handleCustomCitySubmit} className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={customCitySearch}
                onChange={(e) => setCustomCitySearch(e.target.value)}
                placeholder="Type any city or area worldwide..."
                className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-16 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-stadiumGreen"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-3 py-1 bg-white/10 hover:bg-stadiumGreen hover:text-black rounded-lg text-[10px] font-bold transition-colors"
              >
                Set
              </button>
            </form>

            {/* Quick Location Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Quick Select:</span>
              <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-0.5">
                {POPULAR_HUBS.map((hub) => (
                  <button
                    key={hub.city}
                    onClick={() => handleSelectCity(hub.city)}
                    className={`p-2 rounded-xl border text-left text-[10px] transition-all flex flex-col ${
                      intel?.city?.toLowerCase() === hub.city.toLowerCase()
                        ? 'bg-stadiumGreen/20 border-stadiumGreen text-white font-bold'
                        : 'bg-black/40 border-white/5 text-gray-300 hover:border-stadiumGreen/50 hover:bg-white/5'
                    }`}
                  >
                    <span className="truncate">{hub.flag} {hub.city}</span>
                    <span className="text-[8px] text-gray-500 truncate">{hub.state}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
