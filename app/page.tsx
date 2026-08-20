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
import { StadiumSuitesMenu } from '../components/stadium-suites-menu';
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
  const [showSuitesMenu, setShowSuitesMenu] = useState(false);
  const [showStandingsModal, setShowStandingsModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);
  const [showHardwareModal, setShowHardwareModal] = useState(false);
  const [showVisitorModal, setShowVisitorModal] = useState(false);

  // Bookmarked Saved Tickets state
  const [savedMatches, setSavedMatches] = useState<MatchData[]>([]);

  // Active Bet Slip state
  const [betSlipItems, setBetSlipItems] = useState<BetItem[]>([]);

  // Followed Matches State
  const [followedMatchIds, setFollowedMatchIds] = useState<string[]>([]);

  // Collapsible Section States
  const [showMatchCenter, setShowMatchCenter] = useState(true);
  const [showBetSlipDrawer, setShowBetSlipDrawer] = useState(false);

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

        {/* Stadium Header with Suites Menu Integration */}
        <StadiumHeader
          onOpenReceipt={() => matches.length > 0 && setSelectedMatchForReceipt(matches[0])}
          onOpenLedger={() => setShowTrackRecord(true)}
          onOpenBankroll={() => setShowBankroll(true)}
          onOpenProfile={() => setShowProfile(true)}
          onOpenTeams={() => setShowTeamsModal(true)}
          onOpenBirthdays={() => setShowBirthdaysModal(true)}
          onOpenLeaderboard={() => setShowLeaderboardModal(true)}
          onOpenSuitesMenu={() => setShowSuitesMenu(true)}
        />

        {/* Main Content Area - 100% LASER-FOCUSED ON LIVE MATCH PREDICTIONS */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-5">
          
          {/* Quick Date Navigator Bar (Yesterday | Today | Tomorrow) */}
          <GoogleDateNavigator onSelectDate={(filter, label) => {
            setActiveFilter(filter);
            setSearchQuery('');
          }} />

          {/* Dynamic Instant Search Bar & Match Filters Bar */}
          <div className="bg-panel/70 p-3 sm:p-4 rounded-3xl border border-white/10 space-y-3 font-mono text-xs shadow-xl backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
              
              {/* Dynamic Search Input */}
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search team, fixture, or league..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-black/60 border border-white/10 text-xs text-white placeholder-gray-500 focus:border-stadiumGreen focus:outline-none font-mono"
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

              {/* Action Buttons, Filter Pills & View Switcher */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
                
                {/* 1-Tap All Suites Menu Launcher */}
                <button
                  onClick={() => setShowSuitesMenu(true)}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-stadiumGreen/20 via-panel to-gold/20 hover:from-stadiumGreen/30 border border-stadiumGreen/40 text-stadiumGreen font-black text-xs flex items-center space-x-1.5 whitespace-nowrap shadow-md hover:scale-105 transition-all"
                  title="Open All Tools & Suites Menu"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
                  <span>Suites Menu ⚡</span>
                </button>

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

                <div className="flex items-center space-x-1.5">
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

              </div>

            </div>
          </div>

          {/* Primary Match Center Feed & Tactical 2D Radar */}
          <div className="animate-fadeIn space-y-4">
            {loadingMatches ? (
              <div className="p-10 text-center rounded-3xl glass-panel border border-stadiumGreen/20 flex items-center justify-center space-x-2 font-mono text-xs text-stadiumGreen">
                <RefreshCw className="w-5 h-5 animate-spin text-stadiumGreen" />
                <span className="font-bold text-sm">Syncing Live Global Match Center...</span>
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

          {/* Collapsible Auxiliary Sections at Bottom of Page */}
          <div className="pt-6 space-y-4 border-t border-white/5">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-black text-gray-400 font-mono uppercase tracking-wider">
                AUXILIARY AUDIT SUITES & LIVE WIRE
              </span>
              <button
                onClick={() => setShowSuitesMenu(true)}
                className="text-[10px] text-stadiumGreen font-bold hover:underline"
              >
                Open Full Suites Menu ➔
              </button>
            </div>

            {/* Official League Standings Table */}
            <LeagueStandingsTable />

            {/* Historical Settlement Ledger Section */}
            <SettlementLedgerSection onOpenAuditModal={() => setShowHistoryModal(true)} />

            {/* Global Club Explorer Hub */}
            <GlobalClubExplorer />

            {/* Live Sports RSS News Section */}
            <SportsNewsSection />
          </div>

        </main>

        {/* Interactive Bet Slip Drawer */}
        <BetSlipDrawer
          items={betSlipItems}
          onRemoveItem={handleRemoveBetItem}
          onClearAll={() => setBetSlipItems([])}
          isOpenControlled={showBetSlipDrawer}
          onToggleControlled={() => setShowBetSlipDrawer(!showBetSlipDrawer)}
        />

        {/* Mobile App Dock */}
        <MobileAppDock
          activeTab={activeDockTab}
          onSelectTab={(tab) => {
            setActiveDockTab(tab);
            if (tab === 'SLIP') setShowBetSlipDrawer(true);
            if (tab === 'SUITES') setShowSuitesMenu(true);
            if (tab === 'PROFILE') setShowProfile(true);
          }}
          betSlipCount={betSlipItems.length}
          onOpenProfile={() => setShowProfile(true)}
          onOpenLedger={() => setShowTrackRecord(true)}
          onOpenSuitesMenu={() => setShowSuitesMenu(true)}
        />

        {/* Organized Stadium Suites & Tools Hub Menu Modal */}
        <StadiumSuitesMenu
          isOpen={showSuitesMenu}
          onClose={() => setShowSuitesMenu(false)}
          onOpenBirthdays={() => setShowBirthdaysModal(true)}
          onOpenLeaderboard={() => setShowLeaderboardModal(true)}
          onOpenLedger={() => setShowHistoryModal(true)}
          onOpenBankroll={() => setShowBankroll(true)}
          onOpenReverseJinx={() => setShowReverseJinxModal(true)}
          onOpenFlexSlip={() => setShowCloutCardModal(true)}
          onOpenTelemetry={() => setShowTelemetryModal(true)}
          onOpenHardware={() => setShowHardwareModal(true)}
          onOpenStandings={() => setShowStandingsModal(true)}
          onOpenClubs={() => setShowTeamsModal(true)}
          onOpenNews={() => setShowNewsModal(true)}
          onOpenRotatingPool={() => setShowRotatingPoolModal(true)}
          onOpenVisitor={() => setShowVisitorModal(true)}
        />

        {/* Auxiliary Modals Opened from Menu */}
        {showStandingsModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel-premium rounded-3xl p-4 sm:p-6 border border-stadiumGreen/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono font-black text-white text-sm">📊 OFFICIAL LEAGUE STANDINGS</span>
                <button onClick={() => setShowStandingsModal(false)} className="px-3 py-1 rounded-xl bg-panel border border-white/10 text-xs text-white">Close ✕</button>
              </div>
              <LeagueStandingsTable />
            </div>
          </div>
        )}

        {showNewsModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel-premium rounded-3xl p-4 sm:p-6 border border-gold/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono font-black text-white text-sm">📰 LIVE FOOTBALL NEWS WIRE</span>
                <button onClick={() => setShowNewsModal(false)} className="px-3 py-1 rounded-xl bg-panel border border-white/10 text-xs text-white">Close ✕</button>
              </div>
              <SportsNewsSection />
            </div>
          </div>
        )}

        {showTelemetryModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel-premium rounded-3xl p-4 sm:p-6 border border-cyan-400/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono font-black text-white text-sm">📶 REAL-TIME STREAM & SENSOR TELEMETRY</span>
                <button onClick={() => setShowTelemetryModal(false)} className="px-3 py-1 rounded-xl bg-panel border border-white/10 text-xs text-white">Close ✕</button>
              </div>
              <RealtimeCaptureStatus />
            </div>
          </div>
        )}

        {showHardwareModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel-premium rounded-3xl p-4 sm:p-6 border border-stadiumGreen/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono font-black text-white text-sm">📳 PHONE HARDWARE & NOTIFICATION CONTROLS</span>
                <button onClick={() => setShowHardwareModal(false)} className="px-3 py-1 rounded-xl bg-panel border border-white/10 text-xs text-white">Close ✕</button>
              </div>
              <PhoneHardwareBanner />
            </div>
          </div>
        )}

        {showVisitorModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel-premium rounded-3xl p-4 sm:p-6 border border-pink-400/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono font-black text-white text-sm">📍 SMART VISITOR & WEATHER GREETING</span>
                <button onClick={() => setShowVisitorModal(false)} className="px-3 py-1 rounded-xl bg-panel border border-white/10 text-xs text-white">Close ✕</button>
              </div>
              <SmartVisitorBanner />
            </div>
          </div>
        )}

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
