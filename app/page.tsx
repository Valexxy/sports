'use client';

import React, { useState, useEffect } from 'react';
import { StadiumHeader } from '../components/stadium-header';
import { MatchCard } from '../components/match-card';
import { MatchesTableView } from '../components/matches-table-view';
import { LiveScoreStadiumHub } from '../components/livescore-stadium-hub';
import { LeagueStandingsTable } from '../components/league-standings-table';
import { SmartVisitorBanner } from '../components/smart-visitor-banner';
import { ReceiptModal } from '../components/receipt-modal';
import { BankrollCalculatorModal } from '../components/bankroll-calculator';
import { PublicLedgerModal } from '../components/public-ledger';
import { MatchInsightsModal } from '../components/match-insights-modal';
import { UserProfileModal } from '../components/user-profile-modal';
import { PredictionHistoryModal } from '../components/prediction-history-modal';
import { TeamExplorerModal } from '../components/team-explorer-modal';
import { BirthdayCenterModal } from '../components/birthday-center-modal';
import { TipsterLeaderboardModal } from '../components/tipster-leaderboard-modal';
import { StadiumForumModal } from '../components/stadium-forum-modal';
import { LegalModal } from '../components/legal-modal';
import { ApiRegistryModal } from '../components/api-registry-modal';
import { HistoryArchiveModal } from '../components/history-archive-modal';
import { EffectsModal } from '../components/effects-modal';
import { RotatingPoolModal } from '../components/rotating-pool-modal';
import { GenZLiveAlerts } from '../components/genz-live-alerts';
import { GoogleDateNavigator } from '../components/google-date-navigator';
import { CloutCardGenerator } from '../components/clout-card-generator';
import { ReverseJinxModal } from '../components/reverse-jinx-modal';
import { OfflineBanner } from '../components/offline-banner';
import { ErrorBoundary } from '../components/error-boundary';
import { BroadcastTicker, TriggerUpdate } from '../components/broadcast-ticker';
import { TriggerUpdatesSection } from '../components/trigger-updates-section';
import { SportsNewsSection } from '../components/sports-news-section';
import { BetSlipDrawer, BetItem } from '../components/bet-slip-drawer';
import { MobileAppDock } from '../components/mobile-app-dock';
import { GlobalSettingsBar } from '../components/global-settings-bar';
import { fetchLiveMatches, MatchData } from '../lib/sports-api';
import { computeRealPlatformAnalytics } from '../lib/real-analytics-engine';
import { startVoiceSearch } from '../lib/voice-engine';
import { getSmartVisitorDetails, SmartVisitorData } from '../lib/smart-visitor-engine';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { PhoneHardwareBanner } from '../components/phone-install-banner';
import { SettlementLedgerSection } from '../components/settlement-ledger-section';
import { RealtimeCaptureStatus } from '../components/realtime-capture-status';
import { GlobalClubExplorer } from '../components/global-club-explorer';
import { MatchAlertScheduler } from '../lib/match-alert-scheduler';
import { Sparkles, Search, LayoutGrid, List, ChevronDown, ChevronUp, Mic, MapPin, Camera, ShieldAlert, Cpu, RefreshCw, Radio, Share2 } from 'lucide-react';

export default function Home() {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'LIVE' | 'UPCOMING' | 'PLAYED' | 'BANKERS'>('ALL');
  
  // Single Source of Truth Location State
  const [visitorData, setVisitorData] = useState<SmartVisitorData | null>(null);

  useEffect(() => {
    getSmartVisitorDetails().then((data) => setVisitorData(data));
  }, []);

  // View Mode & Pagination state
  const [visibleCount, setVisibleCount] = useState(12);
  const [displayMode, setDisplayMode] = useState<'DETAILED' | 'LIVESCORE' | 'COMPACT'>('LIVESCORE');

  // Real Analytics Engine Computation
  const platformAnalytics = computeRealPlatformAnalytics();

  // Multi-Sport & Global Currency / Odds Format state
  const [selectedSport, setSelectedSport] = useState<'SOCCER' | 'BASKETBALL' | 'TENNIS'>('SOCCER');
  const [currency, setCurrency] = useState('$');
  const [oddsFormat, setOddsFormat] = useState<'DECIMAL' | 'FRACTIONAL' | 'AMERICAN'>('DECIMAL');

  // Mobile Dock Tab state
  const [activeDockTab, setActiveDockTab] = useState('MATCHES');

  // Modals state
  const [selectedMatchForReceipt, setSelectedMatchForReceipt] = useState<MatchData | null>(null);
  const [selectedMatchForInsights, setSelectedMatchForInsights] = useState<MatchData | null>(null);
  const [showLedger, setShowLedger] = useState(false);
  const [showBankroll, setShowBankroll] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showTrackRecord, setShowTrackRecord] = useState(false);
  const [showTeamsModal, setShowTeamsModal] = useState(false);
  const [showBirthdaysModal, setShowBirthdaysModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showForumModal, setShowForumModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showApiRegistryModal, setShowApiRegistryModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showEffectsModal, setShowEffectsModal] = useState(false);
  const [showCloutCardModal, setShowCloutCardModal] = useState(false);
  const [showReverseJinxModal, setShowReverseJinxModal] = useState(false);
  const [showRotatingPoolModal, setShowRotatingPoolModal] = useState(false);

  // Bookmarked Saved Tickets state
  const [savedMatches, setSavedMatches] = useState<MatchData[]>([]);

  // Active Bet Slip state
  const [betSlipItems, setBetSlipItems] = useState<BetItem[]>([]);

  // Followed Matches State
  const [followedMatchIds, setFollowedMatchIds] = useState<string[]>([]);

  // Collapsible Section States
  const [showHeroBanner, setShowHeroBanner] = useState(true);
  const [showMatchCenter, setShowMatchCenter] = useState(true);

  const handleToggleFollow = (match: MatchData) => {
    const exists = followedMatchIds.includes(match.id);
    if (exists) {
      MatchAlertScheduler.unfollowMatch(match.id);
      setFollowedMatchIds((prev) => prev.filter((id) => id !== match.id));
    } else {
      MatchAlertScheduler.followMatch(match);
      setFollowedMatchIds((prev) => [...prev, match.id]);
    }
  };

  const loadMatches = async () => {
    setLoadingMatches(true);
    try {
      const data = await fetchLiveMatches();
      setMatches(data);
      // Run automatic kickoff & live goal alerts check
      MatchAlertScheduler.checkAndTriggerLiveAlerts(data);
    } catch (err) {
      console.warn('Matches fetch error:', err);
    } finally {
      setLoadingMatches(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const handleVoiceSearch = () => {
    startVoiceSearch((transcript) => {
      setSearchQuery(transcript);
    });
  };

  const handleSelectTickerUpdate = (update: TriggerUpdate) => {
    if (matches.length > 0) {
      const match = matches.find((m) => `${m.homeTeam} vs ${m.awayTeam}` === update.matchTitle) || matches[0];
      setSelectedMatchForInsights(match);
    }
  };

  const handleBookmarkToggle = (match: MatchData) => {
    setSavedMatches((prev) => {
      if (prev.some((m) => m.id === match.id)) {
        return prev.filter((m) => m.id !== match.id);
      }
      return [...prev, match];
    });
  };

  const handleAddBetItem = (match: MatchData, selection: string, odds: number) => {
    const newItem: BetItem = {
      matchId: match.id,
      matchTitle: `${match.homeTeam} vs ${match.awayTeam}`,
      selection,
      odds,
    };
    setBetSlipItems((prev) => [...prev.filter((i) => i.matchId !== match.id), newItem]);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([80]);
    }
  };

  const handleRemoveBetItem = (index: number) => {
    setBetSlipItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const filteredMatches = matches.filter((m) => {
    if (m.sport !== selectedSport) return false;

    const queryMatch = m.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       m.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       m.league.toLowerCase().includes(searchQuery.toLowerCase());
    if (!queryMatch) return false;

    if (activeFilter === 'LIVE') return m.status === 'LIVE';
    if (activeFilter === 'UPCOMING') return m.status === 'SCHEDULED';
    if (activeFilter === 'PLAYED') return m.status === 'FINISHED';
    if (activeFilter === 'BANKERS') return m.prediction.topPick.confidenceTier === 'ULTRA-BANKER';
    return true;
  });

  const displayedMatches = filteredMatches.slice(0, visibleCount);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-void flex flex-col pb-24 selection:bg-stadiumGreen selection:text-black font-mono">
        
        {/* ESPN Continuous Live Marquee Broadcast Ticker */}
        <BroadcastTicker matches={matches} onSelectUpdate={handleSelectTickerUpdate} />

        {/* Offline Status Banner */}
        <OfflineBanner />

        {/* Dynamic Real Matches Live Alert */}
        <GenZLiveAlerts
          matches={matches}
          onOpenMatchAudit={() => setShowHistoryModal(true)}
        />

        {/* Stadium Header */}
        <StadiumHeader
          onOpenReceipt={() => matches.length > 0 && setSelectedMatchForReceipt(matches[0])}
          onOpenLedger={() => setShowTrackRecord(true)}
          onOpenBankroll={() => setShowBankroll(true)}
          onOpenProfile={() => setShowProfile(true)}
          onOpenTeams={() => setShowTeamsModal(true)}
          onOpenBirthdays={() => setShowBirthdaysModal(true)}
          onOpenLeaderboard={() => setShowLeaderboardModal(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
          
          {/* Smart Visitor Location, Live Weather & Time-of-Day Greeting Banner */}
          <SmartVisitorBanner />

          {/* Real-Time Data Capturing Telemetry & Stream Status */}
          <RealtimeCaptureStatus />

          {/* Phone Hardware & Background Notification Control Center */}
          <PhoneHardwareBanner />

          {/* Hero Banner with Collapsible Control */}
          <div className="relative glass-panel-premium rounded-3xl p-5 sm:p-7 border border-stadiumGreen/30 overflow-hidden shadow-2xl space-y-4">
            <div className="absolute top-0 right-0 w-96 h-96 bg-stadiumGreen/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyberPurple/10 rounded-full blur-3xl -z-10"></div>

            <div 
              onClick={() => setShowHeroBanner(!showHeroBanner)}
              className="flex items-center justify-between cursor-pointer select-none border-b border-white/5 pb-2"
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-stadiumGreen animate-ping"></span>
                <span className="text-xs font-black text-stadiumGreen font-mono uppercase tracking-wide">
                  STADIUM INTELLIGENCE SUPER-APP • MATCHDAY ACTIVE
                </span>
              </div>

              <div className="flex items-center space-x-1 text-gray-400 text-xs font-bold font-mono">
                <span className="hidden sm:inline">{showHeroBanner ? 'Collapse' : 'Expand'}</span>
                {showHeroBanner ? <ChevronUp className="w-4 h-4 text-stadiumGreen" /> : <ChevronDown className="w-4 h-4 text-gold" />}
              </div>
            </div>

            {showHeroBanner && (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fadeIn">
                <div className="space-y-3 max-w-2xl">

                  <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                    Feel the Stadium. <br className="hidden sm:inline" />
                    <span className="animate-shimmer">
                      {visitorData?.city ? `${visitorData.city} & Worldwide` : 'Live'} Matchday Active.
                    </span>
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                    Real-time live scores, Poisson goal power analytics, and referee-verified match settlements for Premier League, La Liga, Champions League, Serie A, and continental tournaments.
                  </p>

                  {/* Feature Quick Badges with Clear Purpose */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-2">
                    <button
                      onClick={() => setShowReverseJinxModal(true)}
                      className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyberPurple/30 via-crimson/20 to-black hover:from-cyberPurple/50 border border-cyberPurple/50 text-white text-xs font-mono font-black flex items-center space-x-2 transition-all hover:scale-105 shadow-lg"
                    >
                      <ShieldAlert className="w-4 h-4 text-pink-400" />
                      <span>Reverse Jinx 🔮 (Emotional Hedge)</span>
                    </button>

                    <button
                      onClick={() => setShowCloutCardModal(true)}
                      className="px-4 py-2 rounded-2xl bg-gradient-to-r from-stadiumGreen/30 via-panel to-gold/20 hover:from-stadiumGreen/50 border border-stadiumGreen/50 text-white text-xs font-mono font-black flex items-center space-x-2 transition-all hover:scale-105 shadow-lg glow-emerald"
                    >
                      <Share2 className="w-4 h-4 text-stadiumGreen" />
                      <span>Social Flex Slip 📲</span>
                    </button>
                  </div>

                </div>

                {/* Dynamic Live Stadium Pulse Matrix */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full md:w-auto">
                  <div 
                    onClick={() => setShowHistoryModal(true)}
                    className="p-4 rounded-2xl bg-panel/90 border border-stadiumGreen/30 text-center cursor-pointer hover:scale-105 transition-all glow-emerald"
                    title="Click to view Track Record & Daily Successes"
                  >
                    <span className="text-[10px] font-mono text-gray-400 block font-semibold">PITCH INTENSITY</span>
                    <span className="text-3xl font-black text-stadiumGreen font-mono">
                      {matches.filter((m) => m.status === 'LIVE').length > 0 ? '94%' : '88%'}
                    </span>
                    <span className="text-[10px] text-stadiumGreen font-mono block mt-0.5">Live Match Tension ➔</span>
                  </div>

                  <div 
                    onClick={() => setShowBankroll(true)}
                    className="p-4 rounded-2xl bg-panel/90 border border-gold/30 text-center cursor-pointer hover:scale-105 transition-all glow-gold"
                    title="Click to view Smart Stake Optimizer"
                  >
                    <span className="text-[10px] font-mono text-gray-400 block font-semibold">ACCA MULTI-BOOST</span>
                    <span className="text-3xl font-black text-gold font-mono">+{betSlipItems.length >= 3 ? '25%' : '15%'}</span>
                    <span className="text-[10px] text-gold font-mono block mt-0.5">Slip Multiplier ➔</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Date Navigator Bar with Smart Yesterday / Today / Tomorrow Filtering */}
          <GoogleDateNavigator onSelectDate={(filter, label) => {
            setActiveFilter(filter);
            setSearchQuery('');
          }} />

          {/* Global Settings & Currency / Odds Switcher Bar */}
          <GlobalSettingsBar
            selectedSport={selectedSport}
            onSelectSport={setSelectedSport}
            currency={currency}
            onChangeCurrency={setCurrency}
            oddsFormat={oddsFormat}
            onChangeOddsFormat={setOddsFormat}
          />

          {/* High-Trigger Updates Stream Section */}
          <TriggerUpdatesSection matches={matches} onSelectUpdate={handleSelectTickerUpdate} />

          {/* Dynamic Instant Search Bar & 3-State Match Filters (Collapsible Header) */}
          <div className="bg-panel/60 p-3.5 sm:p-4 rounded-3xl border border-white/10 space-y-3 font-mono text-xs shadow-xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
              {/* Dynamic Search Input */}
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search team, fixture, or league..."
                  className="w-full pl-10 pr-10 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-gray-500 focus:border-stadiumGreen focus:outline-none font-mono"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-white/10"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Filter Pills & View Switcher */}
              <div className="flex items-center space-x-2">
                
                <button
                  onClick={loadMatches}
                  className="p-2 rounded-xl bg-panel border border-white/10 text-stadiumGreen hover:bg-stadiumGreen/20 transition-all"
                  title="Refresh Live Matches"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingMatches ? 'animate-spin' : ''}`} />
                </button>

                <div className="flex items-center space-x-1 bg-black/50 p-1 rounded-xl border border-white/10 font-mono text-xs">
                  <button
                    onClick={() => setDisplayMode('LIVESCORE')}
                    className={`px-2.5 py-1 rounded-lg transition-all text-xs font-bold flex items-center space-x-1.5 ${
                      displayMode === 'LIVESCORE' ? 'bg-stadiumGreen text-black font-black' : 'text-gray-400 hover:text-white'
                    }`}
                    title="Match Center 3-Column Stadium View"
                  >
                    <span>🏟️ Match Center</span>
                  </button>
                  <button
                    onClick={() => setDisplayMode('DETAILED')}
                    className={`p-1.5 rounded-lg transition-all ${
                      displayMode === 'DETAILED' ? 'bg-stadiumGreen text-black font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                    title="Detailed Cards View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDisplayMode('COMPACT')}
                    className={`p-1.5 rounded-lg transition-all ${
                      displayMode === 'COMPACT' ? 'bg-stadiumGreen text-black font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                    title="High-Density Table View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-1.5 overflow-x-auto">
                  {(['ALL', 'LIVE', 'UPCOMING', 'PLAYED', 'BANKERS'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
                        activeFilter === filter
                          ? 'bg-stadiumGreen text-black shadow-md shadow-stadiumGreen/20 font-black'
                          : 'bg-panel text-gray-400 border border-white/10 hover:text-white'
                      }`}
                    >
                      {filter === 'LIVE' ? '🔴 LIVE' : filter === 'UPCOMING' ? '🟡 UPCOMING' : filter === 'PLAYED' ? '🟢 PLAYED' : filter === 'BANKERS' ? '👑 BANKERS' : filter}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowMatchCenter(!showMatchCenter)}
                  className="flex items-center space-x-1 text-gray-400 hover:text-white text-xs font-bold px-2 py-1.5 rounded-xl bg-panel border border-white/10"
                >
                  <span className="hidden sm:inline">{showMatchCenter ? 'Collapse' : 'Expand'}</span>
                  {showMatchCenter ? <ChevronUp className="w-4 h-4 text-stadiumGreen" /> : <ChevronDown className="w-4 h-4 text-gold" />}
                </button>

              </div>

            </div>
          </div>

          {/* Real Matches List (Collapsible) */}
          {showMatchCenter && (
            <div className="animate-fadeIn space-y-4">
              {loadingMatches ? (
                <div className="p-6 text-center rounded-3xl glass-panel border border-stadiumGreen/20 flex items-center justify-center space-x-2 font-mono text-xs text-stadiumGreen">
                  <RefreshCw className="w-4 h-4 animate-spin text-stadiumGreen" />
                  <span>Loading games...</span>
                </div>
              ) : filteredMatches.length > 0 ? (
                displayMode === 'LIVESCORE' ? (
                  <LiveScoreStadiumHub
                    matches={filteredMatches}
                    onOpenReceipt={(m) => setSelectedMatchForReceipt(m)}
                    onOpenInsights={(m) => setSelectedMatchForInsights(m)}
                    onSelectOdds={handleAddBetItem}
                    onToggleFollow={handleToggleFollow}
                    followedMatchIds={followedMatchIds}
                  />
                ) : displayMode === 'COMPACT' ? (
                  <MatchesTableView
                    matches={displayedMatches}
                    onOpenReceipt={(m) => setSelectedMatchForReceipt(m)}
                    onOpenInsights={(m) => setSelectedMatchForInsights(m)}
                    onSelectOdds={handleAddBetItem}
                    onBookmarkMatch={handleBookmarkToggle}
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-5">
                    {displayedMatches.map((match) => (
                      <MatchCard
                        key={match.id}
                        match={match}
                        onOpenReceipt={(m) => setSelectedMatchForReceipt(m)}
                        onOpenInsights={(m) => setSelectedMatchForInsights(m)}
                        onSelectOdds={handleAddBetItem}
                        onBookmarkMatch={handleBookmarkToggle}
                      />
                    ))}
                  </div>
                )
              ) : (
                <div className="p-10 text-center rounded-3xl glass-panel border border-white/10 space-y-3">
                  <Radio className="w-8 h-8 text-gold mx-auto" />
                  <h3 className="text-white font-black text-sm">No matches found matching filter "{activeFilter}"</h3>
                  <p className="text-xs text-gray-400">Switch filter to "ALL" or "PLAYED" to see real fixtures and settled overnight games.</p>
                  <button
                    onClick={() => {
                      setActiveFilter('ALL');
                      setSearchQuery('');
                      loadMatches();
                    }}
                    className="px-4 py-2 rounded-xl bg-stadiumGreen text-black font-black text-xs inline-flex items-center space-x-1"
                  >
                    <span>Reset Filters & Reload</span>
                  </button>
                </div>
              )}

              {/* Pagination Controls */}
              {filteredMatches.length > visibleCount && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="px-6 py-3 rounded-2xl bg-stadiumGreen/20 hover:bg-stadiumGreen/30 border border-stadiumGreen/40 text-stadiumGreen font-mono font-black text-xs shadow-lg transition-all hover:scale-105 inline-flex items-center space-x-2"
                  >
                    <span>⚡ Load More Matches ({filteredMatches.length - visibleCount} remaining)</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Official League Standings Table */}
          <LeagueStandingsTable />

          {/* Historical Settlement Ledger Section (Collapsible & Clickable with Calendar) */}
          <SettlementLedgerSection onOpenAuditModal={() => setShowHistoryModal(true)} />

          {/* Global Club Explorer Hub (12+ Leagues & Countries) */}
          <GlobalClubExplorer />

          {/* Live Sky Sports & BBC Sport RSS News Section */}
          <SportsNewsSection />

        </main>

        {/* Interactive Bet Slip Drawer */}
        <BetSlipDrawer
          items={betSlipItems}
          onRemoveItem={handleRemoveBetItem}
          onClearAll={() => setBetSlipItems([])}
        />

        {/* Mobile App Dock */}
        <MobileAppDock
          activeTab={activeDockTab}
          onSelectTab={(tab) => {
            setActiveDockTab(tab);
            if (tab === 'CHAT' && matches.length > 0) setSelectedMatchForInsights(matches[0]);
            if (tab === 'PROFILE') setShowProfile(true);
          }}
          betSlipCount={betSlipItems.length}
          onOpenProfile={() => setShowProfile(true)}
          onOpenLedger={() => setShowTrackRecord(true)}
        />

        {/* Modals */}
        {selectedMatchForReceipt && (
          <ReceiptModal
            match={selectedMatchForReceipt}
            onClose={() => setSelectedMatchForReceipt(null)}
          />
        )}

        {selectedMatchForInsights && (
          <MatchInsightsModal
            match={selectedMatchForInsights}
            onClose={() => setSelectedMatchForInsights(null)}
            onSelectOdds={handleAddBetItem}
          />
        )}

        {showBankroll && (
          <BankrollCalculatorModal onClose={() => setShowBankroll(false)} />
        )}

        {showLedger && (
          <PublicLedgerModal onClose={() => setShowLedger(false)} />
        )}

        {showTrackRecord && (
          <PredictionHistoryModal
            onClose={() => setShowTrackRecord(false)}
            savedBookmarkedMatches={savedMatches}
          />
        )}

        {showProfile && (
          <UserProfileModal onClose={() => setShowProfile(false)} />
        )}

        {showTeamsModal && (
          <TeamExplorerModal onClose={() => setShowTeamsModal(false)} />
        )}

        {showBirthdaysModal && (
          <BirthdayCenterModal onClose={() => setShowBirthdaysModal(false)} />
        )}

        {showLeaderboardModal && (
          <TipsterLeaderboardModal onClose={() => setShowLeaderboardModal(false)} />
        )}

        {showLegalModal && (
          <LegalModal onClose={() => setShowLegalModal(false)} />
        )}

        {showApiRegistryModal && (
          <ApiRegistryModal onClose={() => setShowApiRegistryModal(false)} />
        )}

        {showHistoryModal && (
          <HistoryArchiveModal onClose={() => setShowHistoryModal(false)} />
        )}

        {showEffectsModal && (
          <EffectsModal onClose={() => setShowEffectsModal(false)} />
        )}

        {showReverseJinxModal && (
          <ReverseJinxModal onClose={() => setShowReverseJinxModal(false)} />
        )}

        {showRotatingPoolModal && (
          <RotatingPoolModal onClose={() => setShowRotatingPoolModal(false)} />
        )}

        {showCloutCardModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
              <CloutCardGenerator
                matchTitle={matches[0] ? `${matches[0].homeTeam} vs ${matches[0].awayTeam}` : 'Arsenal vs Coventry City'}
                pickSelection={matches[0] ? matches[0].prediction.topPick.selection : 'Double Chance (1X)'}
                odds={matches[0] ? matches[0].prediction.topPick.odds : 1.16}
                winRate={matches[0] ? matches[0].prediction.topPick.probability : 92.4}
                onClose={() => setShowCloutCardModal(false)}
              />
            </div>
          </div>
        )}

        {/* Enterprise Security & Responsible Gaming Stadium Footer */}
        <footer className="glass-panel border-t border-white/10 py-8 px-4 mt-12 font-mono text-xs text-gray-400">
          <div className="max-w-7xl mx-auto space-y-6">
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-black text-white text-sm">AURASCORE STADIUM 2.0</span>
                  <span className="px-2 py-0.5 rounded bg-stadiumGreen text-black font-black text-[9px]">
                    SECURED EDGE ✓
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-sans">
                  The World-First Stadium Intelligence Super-App • 100% Audited Match Settlements
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <button onClick={() => setShowHistoryModal(true)} className="hover:text-stadiumGreen font-bold transition-all">
                  📜 Historical Settlement Ledger
                </button>
                <span className="text-gray-600">|</span>
                <button onClick={() => setShowLegalModal(true)} className="hover:text-gold font-bold transition-all">
                  ⚖️ Responsible Gaming & 18+ Terms
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-gray-500 font-sans">
              <p>
                © 2026 AuraScore Stadium. Statistical probability & live entertainment engine. Please play responsibly (18+).
              </p>
              <div className="flex items-center space-x-3 font-mono text-stadiumGreen font-bold">
                <span>🛡️ AES-256 SSL Encrypted</span>
                <span>•</span>
                <span>🔒 Zero-Trust Edge Protocol</span>
              </div>
            </div>

          </div>
        </footer>

      </div>
    </ErrorBoundary>
  );
}
