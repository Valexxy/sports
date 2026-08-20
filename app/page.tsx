'use client';

import React, { useState, useEffect } from 'react';
import { StadiumHeader } from '../components/stadium-header';
import { DailyMatchCard } from '../components/daily-match-card';
import { LeagueStandingsTable } from '../components/league-standings-table';
import { ReceiptModal } from '../components/receipt-modal';
import { BankrollCalculatorModal } from '../components/bankroll-calculator';
import { PublicLedgerModal } from '../components/public-ledger';
import { MatchInsightsModal } from '../components/match-insights-modal';
import { UserProfileModal } from '../components/user-profile-modal';
import { PredictionHistoryModal } from '../components/prediction-history-modal';
import { TeamExplorerModal } from '../components/team-explorer-modal';
import { BirthdayCenterModal } from '../components/birthday-center-modal';
import { TipsterLeaderboardModal } from '../components/tipster-leaderboard-modal';
import { LegalModal } from '../components/legal-modal';
import { HistoryArchiveModal } from '../components/history-archive-modal';
import { RotatingPoolModal } from '../components/rotating-pool-modal';
import { GenZLiveAlerts } from '../components/genz-live-alerts';
import { GoogleDateNavigator } from '../components/google-date-navigator';
import { CloutCardGenerator } from '../components/clout-card-generator';
import { ReverseJinxModal } from '../components/reverse-jinx-modal';
import { OfflineBanner } from '../components/offline-banner';
import { ErrorBoundary } from '../components/error-boundary';
import { BroadcastTicker, TriggerUpdate } from '../components/broadcast-ticker';
import { SportsNewsSection } from '../components/sports-news-section';
import { BetSlipDrawer, BetItem } from '../components/bet-slip-drawer';
import { MobileAppDock } from '../components/mobile-app-dock';
import { StadiumSuitesMenu } from '../components/stadium-suites-menu';
import { fetchLiveMatches, MatchData } from '../lib/sports-api';
import { PhoneHardwareBanner } from '../components/phone-install-banner';
import { SettlementLedgerSection } from '../components/settlement-ledger-section';
import { RealtimeCaptureStatus } from '../components/realtime-capture-status';
import { MatchAlertScheduler } from '../lib/match-alert-scheduler';
import { sortMatchesByClosestKickoff } from '../lib/match-sorter';
import { Sparkles, Search, ChevronDown, RefreshCw, Radio, Calendar, Clock, Zap } from 'lucide-react';

type FilterType = 'ALL' | 'LIVE' | 'UPCOMING' | 'PLAYED' | 'BANKERS';

export default function Home() {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [selectedSport, setSelectedSport] = useState<'SOCCER' | 'BASKETBALL' | 'TENNIS'>('SOCCER');
  const [visibleCount, setVisibleCount] = useState(12);
  const [activeDockTab, setActiveDockTab] = useState('MATCHES');
  const [showBetSlipDrawer, setShowBetSlipDrawer] = useState(false);
  const [followedMatchIds, setFollowedMatchIds] = useState<string[]>([]);
  const [savedMatches, setSavedMatches] = useState<MatchData[]>([]);
  const [betSlipItems, setBetSlipItems] = useState<BetItem[]>([]);
  const [selectedMatchForReceipt, setSelectedMatchForReceipt] = useState<MatchData | null>(null);
  const [selectedMatchForInsights, setSelectedMatchForInsights] = useState<MatchData | null>(null);
  const [showLedger, setShowLedger] = useState(false);
  const [showBankroll, setShowBankroll] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showTrackRecord, setShowTrackRecord] = useState(false);
  const [showTeamsModal, setShowTeamsModal] = useState(false);
  const [showBirthdaysModal, setShowBirthdaysModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showCloutCardModal, setShowCloutCardModal] = useState(false);
  const [showReverseJinxModal, setShowReverseJinxModal] = useState(false);
  const [showRotatingPoolModal, setShowRotatingPoolModal] = useState(false);
  const [showSuitesMenu, setShowSuitesMenu] = useState(false);
  const [showStandingsModal, setShowStandingsModal] = useState(false);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);
  const [showHardwareModal, setShowHardwareModal] = useState(false);
  const [showVisitorModal, setShowVisitorModal] = useState(false);

  const loadMatches = async () => {
    setLoadingMatches(true);
    try {
      const data = await fetchLiveMatches();
      setMatches(data);
      setLastSynced(new Date());
      MatchAlertScheduler.checkAndTriggerLiveAlerts(data);
    } catch (err) {
      console.warn('Matches fetch error:', err);
    } finally {
      setLoadingMatches(false);
    }
  };

  useEffect(() => { loadMatches(); }, []);

  // Auto-refresh every 3 minutes
  useEffect(() => {
    const interval = setInterval(() => { loadMatches(); }, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleFollow = (match: MatchData) => {
    const exists = followedMatchIds.includes(match.id);
    if (exists) {
      MatchAlertScheduler.unfollowMatch(match.id);
      setFollowedMatchIds(prev => prev.filter(id => id !== match.id));
    } else {
      MatchAlertScheduler.followMatch(match);
      setFollowedMatchIds(prev => [...prev, match.id]);
    }
  };

  const handleBookmarkToggle = (match: MatchData) => {
    setSavedMatches(prev => {
      if (prev.some(m => m.id === match.id)) return prev.filter(m => m.id !== match.id);
      return [...prev, match];
    });
  };

  const handleAddBetItem = (match: MatchData, selection: string, odds: number) => {
    const newItem: BetItem = {
      matchId: match.id,
      matchTitle: match.homeTeam + ' vs ' + match.awayTeam,
      selection,
      odds,
    };
    setBetSlipItems(prev => [...prev.filter(i => i.matchId !== match.id), newItem]);
    if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate([80]);
  };

  const handleRemoveBetItem = (index: number) => {
    setBetSlipItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSelectTickerUpdate = (update: TriggerUpdate) => {
    const match = matches.find(m => (m.homeTeam + ' vs ' + m.awayTeam) === update.matchTitle) || matches[0];
    if (match) setSelectedMatchForInsights(match);
  };

  const sportMatches = matches.filter(m => m.sport === selectedSport);
  const liveCount = sportMatches.filter(m => m.status === 'LIVE').length;
  const upcomingCount = sportMatches.filter(m => m.status === 'SCHEDULED').length;
  const playedCount = sportMatches.filter(m => m.status === 'FINISHED').length;
  const bankersCount = sportMatches.filter(m => m.prediction.topPick.confidenceTier === 'ULTRA-BANKER').length;

  const filteredMatches = React.useMemo(() => {
    const base = matches.filter(m => {
      if (m.sport !== selectedSport) return false;
      const q = searchQuery.toLowerCase();
      if (q && !m.homeTeam.toLowerCase().includes(q) && !m.awayTeam.toLowerCase().includes(q) && !m.league.toLowerCase().includes(q)) return false;
      if (activeFilter === 'LIVE') return m.status === 'LIVE';
      if (activeFilter === 'UPCOMING') return m.status === 'SCHEDULED';
      if (activeFilter === 'PLAYED') return m.status === 'FINISHED';
      if (activeFilter === 'BANKERS') return m.prediction.topPick.confidenceTier === 'ULTRA-BANKER';
      return true;
    });
    return sortMatchesByClosestKickoff(base, activeFilter);
  }, [matches, selectedSport, searchQuery, activeFilter]);

  const displayedMatches = filteredMatches.slice(0, visibleCount);

  const todayLabel = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });

  type PillDef = { key: FilterType; emoji: string; label: string; count: number; activeClass: string };
  const filterPills: PillDef[] = [
    { key: 'ALL', emoji: '⚽', label: 'All Matches', count: sportMatches.length, activeClass: 'bg-white/10 border-white/30 text-white' },
    { key: 'LIVE', emoji: '🔴', label: 'Live', count: liveCount, activeClass: 'bg-crimson/20 border-crimson/50 text-crimson' },
    { key: 'UPCOMING', emoji: '🟡', label: 'Upcoming', count: upcomingCount, activeClass: 'bg-gold/20 border-gold/50 text-gold' },
    { key: 'PLAYED', emoji: '✅', label: 'Played', count: playedCount, activeClass: 'bg-stadiumGreen/20 border-stadiumGreen/50 text-stadiumGreen' },
    { key: 'BANKERS', emoji: '👑', label: 'Bankers', count: bankersCount, activeClass: 'bg-cyberPurple/20 border-cyberPurple/50 text-cyberPurple' },
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-void flex flex-col pb-24 selection:bg-stadiumGreen selection:text-black font-mono">

        <BroadcastTicker matches={matches} onSelectUpdate={handleSelectTickerUpdate} />
        <OfflineBanner />
        <GenZLiveAlerts matches={matches} onOpenMatchAudit={() => setShowHistoryModal(true)} />

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

        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4 space-y-4">

          <GoogleDateNavigator onSelectDate={(filter) => { setActiveFilter(filter as FilterType); setSearchQuery(''); }} />

          {/* DAILY MATCHES SECTION */}
          <div className="space-y-3">

            {/* Section header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-8 rounded-full bg-stadiumGreen flex-shrink-0" />
                <div>
                  <h2 className="text-base font-black text-white flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-stadiumGreen" />
                    <span>Today's Matches</span>
                    {liveCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-crimson text-white text-[10px] font-black animate-pulse">
                        {liveCount} LIVE
                      </span>
                    )}
                  </h2>
                  <p className="text-[11px] text-gray-400">{todayLabel} &bull; {filteredMatches.length} fixtures</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {lastSynced && (
                  <span className="text-[10px] text-gray-500 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Synced {lastSynced.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </span>
                )}
                <button onClick={loadMatches} disabled={loadingMatches}
                  className="p-2 rounded-xl bg-panel border border-white/10 text-stadiumGreen hover:bg-stadiumGreen/20 transition-all disabled:opacity-50">
                  <RefreshCw className={loadingMatches ? 'w-3.5 h-3.5 animate-spin' : 'w-3.5 h-3.5'} />
                </button>
                <button onClick={() => setShowSuitesMenu(true)}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-stadiumGreen/20 to-gold/20 border border-stadiumGreen/40 text-stadiumGreen font-black text-xs flex items-center space-x-1.5 hover:scale-105 transition-all">
                  <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
                  <span className="hidden sm:inline">Suites</span>
                  <span className="sm:hidden">Menu</span>
                </button>
              </div>
            </div>

            {/* Search bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search team, league or fixture..."
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-black/60 border border-white/10 text-sm text-white placeholder-gray-500 focus:border-stadiumGreen focus:outline-none font-mono" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-white/10">
                  x
                </button>
              )}
            </div>

            {/* Filter pills with counts */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {filterPills.map(pill => (
                <button key={pill.key} onClick={() => { setActiveFilter(pill.key); setVisibleCount(12); }}
                  className={'flex-shrink-0 flex items-center space-x-1.5 px-3 py-2 rounded-2xl border text-xs font-black transition-all ' +
                    (activeFilter === pill.key ? pill.activeClass + ' scale-105 shadow-md' : 'border-white/10 text-gray-400 bg-panel hover:text-white hover:border-white/20')}
                >
                  <span className="text-sm">{pill.emoji}</span>
                  <span>{pill.label}</span>
                  {pill.count > 0 && (
                    <span className={'px-1.5 py-0.5 rounded-full text-[10px] font-black ' + (activeFilter === pill.key ? 'bg-black/30' : 'bg-white/10 text-white')}>
                      {pill.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Sport selector */}
            <div className="flex items-center gap-2">
              {(['SOCCER', 'BASKETBALL', 'TENNIS'] as const).map(sport => (
                <button key={sport} onClick={() => setSelectedSport(sport)}
                  className={'px-3 py-1.5 rounded-xl text-[11px] font-black border transition-all ' +
                    (selectedSport === sport ? 'bg-stadiumGreen text-black border-stadiumGreen' : 'bg-panel text-gray-400 border-white/10 hover:text-white')}
                >
                  {sport === 'SOCCER' ? '⚽ Football' : sport === 'BASKETBALL' ? '🏀 Basketball' : '🎾 Tennis'}
                </button>
              ))}
            </div>

            {/* Match grid */}
            {loadingMatches ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} className="h-72 rounded-3xl bg-panel/60 border border-white/5 animate-pulse" />
                ))}
              </div>
            ) : filteredMatches.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {displayedMatches.map(match => (
                    <DailyMatchCard
                      key={match.id}
                      match={match}
                      onOpenInsights={m => setSelectedMatchForInsights(m)}
                      onSelectOdds={handleAddBetItem}
                      onBookmarkMatch={handleBookmarkToggle}
                      followedMatchIds={followedMatchIds}
                      onToggleFollow={handleToggleFollow}
                    />
                  ))}
                </div>
                {filteredMatches.length > visibleCount && (
                  <div className="text-center pt-2">
                    <button onClick={() => setVisibleCount(prev => prev + 9)}
                      className="px-6 py-3 rounded-2xl bg-stadiumGreen/20 hover:bg-stadiumGreen/30 border border-stadiumGreen/40 text-stadiumGreen font-black text-sm inline-flex items-center space-x-2 transition-all hover:scale-105">
                      <Zap className="w-4 h-4" />
                      <span>Show {filteredMatches.length - visibleCount} More Matches</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="p-10 text-center rounded-3xl glass-panel border border-white/10 space-y-3">
                <Radio className="w-8 h-8 text-gold mx-auto" />
                <h3 className="text-white font-black text-sm">No matches found</h3>
                <p className="text-xs text-gray-400">Try switching to All Matches or Upcoming to see today fixtures.</p>
                <button onClick={() => { setActiveFilter('ALL'); setSearchQuery(''); loadMatches(); }}
                  className="px-4 py-2 rounded-xl bg-stadiumGreen text-black font-black text-xs">
                  Reset and Reload
                </button>
              </div>
            )}
          </div>

          {/* Auxiliary sections */}
          <div className="pt-4 space-y-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider">More Tools</span>
              <button onClick={() => setShowSuitesMenu(true)} className="text-[10px] text-stadiumGreen font-bold hover:underline">Open Full Menu</button>
            </div>
            <SettlementLedgerSection onOpenAuditModal={() => setShowHistoryModal(true)} />
            <SportsNewsSection />
          </div>

        </main>

        <BetSlipDrawer items={betSlipItems} onRemoveItem={handleRemoveBetItem} onClearAll={() => setBetSlipItems([])}
          isOpenControlled={showBetSlipDrawer} onToggleControlled={() => setShowBetSlipDrawer(!showBetSlipDrawer)} />

        <MobileAppDock activeTab={activeDockTab}
          onSelectTab={tab => { setActiveDockTab(tab); if (tab === 'SLIP') setShowBetSlipDrawer(true); if (tab === 'SUITES') setShowSuitesMenu(true); if (tab === 'PROFILE') setShowProfile(true); }}
          betSlipCount={betSlipItems.length}
          onOpenProfile={() => setShowProfile(true)}
          onOpenLedger={() => setShowTrackRecord(true)}
          onOpenSuitesMenu={() => setShowSuitesMenu(true)} />

        <StadiumSuitesMenu isOpen={showSuitesMenu} onClose={() => setShowSuitesMenu(false)}
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

        {showStandingsModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-5">
            <div className="w-full sm:max-w-4xl max-h-[92vh] overflow-y-auto glass-panel-premium rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 border border-stadiumGreen/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono font-black text-white text-sm">League Standings</span>
                <button onClick={() => setShowStandingsModal(false)} className="px-3 py-1 rounded-xl bg-panel border border-white/10 text-xs text-white">Close</button>
              </div>
              <LeagueStandingsTable />
            </div>
          </div>
        )}

        {showNewsModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-5">
            <div className="w-full sm:max-w-4xl max-h-[92vh] overflow-y-auto glass-panel-premium rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 border border-gold/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono font-black text-white text-sm">Football News</span>
                <button onClick={() => setShowNewsModal(false)} className="px-3 py-1 rounded-xl bg-panel border border-white/10 text-xs text-white">Close</button>
              </div>
              <SportsNewsSection />
            </div>
          </div>
        )}

        {showTelemetryModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-5">
            <div className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto glass-panel-premium rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 border border-cyan-400/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono font-black text-white text-sm">Telemetry</span>
                <button onClick={() => setShowTelemetryModal(false)} className="px-3 py-1 rounded-xl bg-panel border border-white/10 text-xs text-white">Close</button>
              </div>
              <RealtimeCaptureStatus />
            </div>
          </div>
        )}

        {showHardwareModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-5">
            <div className="w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto glass-panel-premium rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 border border-stadiumGreen/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono font-black text-white text-sm">Phone Hardware</span>
                <button onClick={() => setShowHardwareModal(false)} className="px-3 py-1 rounded-xl bg-panel border border-white/10 text-xs text-white">Close</button>
              </div>
              <PhoneHardwareBanner />
            </div>
          </div>
        )}

        {selectedMatchForInsights && (
          <MatchInsightsModal match={selectedMatchForInsights} onClose={() => setSelectedMatchForInsights(null)} onSelectOdds={handleAddBetItem} />
        )}
        {selectedMatchForReceipt && (
          <ReceiptModal match={selectedMatchForReceipt} onClose={() => setSelectedMatchForReceipt(null)} />
        )}
        {showBankroll && <BankrollCalculatorModal onClose={() => setShowBankroll(false)} />}
        {showLedger && <PublicLedgerModal onClose={() => setShowLedger(false)} />}
        {showTrackRecord && <PredictionHistoryModal onClose={() => setShowTrackRecord(false)} savedBookmarkedMatches={savedMatches} />}
        {showProfile && <UserProfileModal onClose={() => setShowProfile(false)} />}
        {showTeamsModal && <TeamExplorerModal onClose={() => setShowTeamsModal(false)} />}
        {showBirthdaysModal && <BirthdayCenterModal onClose={() => setShowBirthdaysModal(false)} />}
        {showLeaderboardModal && <TipsterLeaderboardModal onClose={() => setShowLeaderboardModal(false)} />}
        {showLegalModal && <LegalModal onClose={() => setShowLegalModal(false)} />}
        {showHistoryModal && <HistoryArchiveModal onClose={() => setShowHistoryModal(false)} />}
        {showReverseJinxModal && <ReverseJinxModal onClose={() => setShowReverseJinxModal(false)} />}
        {showRotatingPoolModal && <RotatingPoolModal onClose={() => setShowRotatingPoolModal(false)} />}
        {showCloutCardModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden">
              <CloutCardGenerator
                matchTitle={matches[0] ? matches[0].homeTeam + ' vs ' + matches[0].awayTeam : 'Arsenal vs Chelsea'}
                pickSelection={matches[0] ? matches[0].prediction.topPick.selection : 'Home Win'}
                odds={matches[0] ? matches[0].prediction.topPick.odds : 1.45}
                winRate={matches[0] ? matches[0].prediction.topPick.probability : 82}
                onClose={() => setShowCloutCardModal(false)}
              />
            </div>
          </div>
        )}

        <footer className="glass-panel border-t border-white/10 py-6 px-4 mt-8 font-mono text-xs text-gray-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <p className="font-black text-white text-sm">AURASCORE STADIUM 2.0</p>
              <p className="text-[10px] text-gray-500">Statistical intelligence engine. 18+ Please play responsibly.</p>
            </div>
            <div className="flex items-center gap-3 text-stadiumGreen font-bold text-[11px]">
              <span>AES-256 Encrypted</span>
              <span className="text-gray-600">|</span>
              <button onClick={() => setShowLegalModal(true)} className="hover:text-gold transition-all">Legal & 18+ Terms</button>
              <span className="text-gray-600">|</span>
              <button onClick={() => setShowHistoryModal(true)} className="hover:text-gold transition-all">Settlement Ledger</button>
            </div>
          </div>
        </footer>

      </div>
    </ErrorBoundary>
  );
}