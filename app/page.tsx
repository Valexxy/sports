'use client';
import { ScreenPinnedMatchWidget } from '../components/screen-pinned-match-widget';
import { SecurityHealthBadge } from '../components/security-health-badge';
import { StadiumSmartPreloader } from '../components/stadium-smart-preloader';
import { ViralArcadeHubModal } from '../components/viral-arcade-hub-modal';
import { backgroundGoalChimes } from '../lib/background-goal-chimes';
import React, { useState, useEffect, useMemo } from 'react';
import { StadiumFooter } from '../components/stadium-footer';
import { PersistentStorage } from '../lib/persistent-storage-engine';
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
import { NaijaBanterLoungeModal } from '../components/naija-banter-lounge-modal';
import { GrassrootsScoutingModal } from '../components/grassroots-scouting-modal';
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
import { CollapsibleStadiumHub } from '../components/collapsible-stadium-hub';
import { EffectsModal } from '../components/effects-modal';
import { VcFundingModal } from '../components/vc-funding-modal';
import { fetchLiveMatches, MatchData } from '../lib/sports-api';
import { PhoneHardwareBanner } from '../components/phone-install-banner';
import { LeagueStandingsModal } from '../components/league-standings-modal';
import { GlobalLeagueBrowser } from '../components/global-league-browser';
import { AuthDashboardModal } from '../components/auth-dashboard-modal';
import { PlayerRadarModal } from '../components/player-radar-modal';
import { ClubProfileHubModal } from '../components/club-profile-hub-modal';
import { stadiumAudio } from '../lib/sound-synthesizer';
import { speakNaija, allowSpeechOnUserGesture } from '../lib/naija-voice-engine';
import { playerFollowEngine } from '../lib/player-follow-engine';
import { SettlementLedgerSection } from '../components/settlement-ledger-section';
import { RealtimeCaptureStatus } from '../components/realtime-capture-status';
import { MatchAlertScheduler } from '../lib/match-alert-scheduler';
import { sortMatchesByClosestKickoff } from '../lib/match-sorter';
import { Sparkles, Search, ChevronDown, RefreshCw, Radio, Calendar, Clock, Zap } from 'lucide-react';
import { GlobalLanguageSwitcher } from '../components/global-language-switcher';
import { DailyBankerAccumulatorCard } from '../components/daily-banker-accumulator-card';
import { AccumulatorSlipDrawer, SelectedSlipPick } from '../components/accumulator-slip-drawer';
import { ViralFeaturesGrid } from '../components/viral-features-grid';
import { StadiumUserWeatherPanel } from '../components/stadium-user-weather-panel';
import { registerPushClient, pushClientId } from '../lib/push-client';
import { cacheOffline } from '../lib/offline-manager';

import { useTranslation } from '../lib/translation-engine';

type FilterType = 'LIVE' | 'UPCOMING' | 'PLAYED' | 'FOLLOWING' | 'ALL';

export default function Home() {
  const { t } = useTranslation();
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [hasAutoSwitchedTab, setHasAutoSwitchedTab] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('LIVE');
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedDateLabel, setSelectedDateLabel] = useState<string>('Today');
  const [isViewingToday, setIsViewingToday] = useState<boolean>(true);
  const [selectedSport, setSelectedSport] = useState<'SOCCER' | 'BASKETBALL' | 'TENNIS'>('SOCCER');
  const [visibleCount, setVisibleCount] = useState(12);
  const [activeDockTab, setActiveDockTab] = useState('MATCHES');
  const handleSelectDockTab = (tab: string) => {
    setActiveDockTab(tab);
    if (tab === 'FOLLOWING') {
      setActiveFilter('FOLLOWING');
    } else if (tab === 'MATCHES') {
      setActiveFilter('LIVE');
    }
  };
  const [showBetSlipDrawer, setShowBetSlipDrawer] = useState(false);
  const [followedMatchIds, setFollowedMatchIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') return PersistentStorage.getFollowedMatches();
    return [];
  });
  const [followedLeagues, setFollowedLeagues] = useState<string[]>([]);
  const [showLeagueBrowser, setShowLeagueBrowser] = useState(false);
  const [showPlayersModal, setShowPlayersModal] = useState(false);
  const [followedPlayers, setFollowedPlayers] = useState<string[]>([]);
  // Dark Mode Permanently Locked
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [savedMatches, setSavedMatches] = useState<MatchData[]>([]);
  const [betSlipItems, setBetSlipItems] = useState<BetItem[]>([]);
  const [accumulatorPicks, setAccumulatorPicks] = useState<SelectedSlipPick[]>([]);

  const handleAddMultiPicks = (picks: SelectedSlipPick[]) => {
    setAccumulatorPicks(prev => {
      const existingIds = new Set(prev.map(p => p.match.id));
      const newPicks = picks.filter(p => !existingIds.has(p.match.id));
      return [...prev, ...newPicks];
    });
  };

  const handleRemoveAccumulatorPick = (matchId: string) => {
    setAccumulatorPicks(prev => prev.filter(p => p.match.id !== matchId));
  };
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
  const [showViralArcade, setShowViralArcade] = useState(false);
  const [showBanterModal, setShowBanterModal] = useState(false);
  const [showGrassrootsModal, setShowGrassrootsModal] = useState(false);
  const [showStandingsModal, setShowStandingsModal] = useState(false);
  const [selectedLeagueForTable, setSelectedLeagueForTable] = useState<string | null>(null);
  const [selectedClubForProfile, setSelectedClubForProfile] = useState<string | null>(null);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);
  const [showHardwareModal, setShowHardwareModal] = useState(false);
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [showEffectsModal, setShowEffectsModal] = useState(false);
  const [showVcFundingModal, setShowVcFundingModal] = useState(false);

  const loadMatches = async () => {
    setLoadingMatches(true);
    try {
      const data = await fetchLiveMatches();
      setMatches(data);
      if (!hasAutoSwitchedTab && data.length > 0) {
        const liveGames = data.filter((m: any) => m.status === 'LIVE');
        if (liveGames.length === 0) {
          setActiveFilter('UPCOMING');
        }
        setHasAutoSwitchedTab(true);
      }
      setLastSynced(new Date());
      MatchAlertScheduler.checkAndTriggerLiveAlerts(data);
    } catch (err) {
      console.warn('Matches fetch error:', err);
    } finally {
      setLoadingMatches(false);
    }
  };

  useEffect(() => { loadMatches(); }, []);

  // Robust Browser Back Button & Refresh State Restoration
  useEffect(() => {
    if (typeof window === 'undefined') return;

        const restoreFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const matchId = params.get('match');
      const tab = params.get('tab');
      const modal = params.get('modal');

      if (matchId && matches.length > 0) {
        const found = matches.find(m => m.id === matchId);
        if (found) setSelectedMatchForInsights(found);
      } else if (!matchId) {
        setSelectedMatchForInsights(null);
      }

      if (tab && ['LIVE', 'UPCOMING', 'PLAYED', 'FOLLOWING', 'ALL'].includes(tab.toUpperCase())) {
        setActiveFilter(tab.toUpperCase() as FilterType);
      }

      // Restore Modals on Refresh
      if (modal === 'bankroll') setShowBankroll(true);
      if (modal === 'ledger') setShowTrackRecord(true);
      if (modal === 'leaderboard') setShowLeaderboardModal(true);
      if (modal === 'viral') setShowViralArcade(true);
      if (modal === 'banter') setShowBanterModal(true);
      if (modal === 'birthdays') setShowBirthdaysModal(true);
      if (modal === 'grassroots') setShowGrassrootsModal(true);
      if (modal === 'profile') setShowProfile(true);
      if (modal === 'leagues') setShowLeagueBrowser(true);
    };

    restoreFromUrl();
    window.addEventListener('popstate', restoreFromUrl);
    return () => window.removeEventListener('popstate', restoreFromUrl);
  }, [matches]);

  // Auto-refresh every 3 minutes
  useEffect(() => {
    const interval = setInterval(() => { loadMatches(); }, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Boot: analytics tracking + push subscription + offline caching
  useEffect(() => {
    const sessionId = pushClientId || `s-${Date.now().toString(36)}`;
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'pageview', sessionId }),
    }).catch(() => {});

    // Register for server-initiated Web Push (silent, only if user grants).
    registerPushClient().catch(() => {});

    // Cache matches offline so the app remains usable with no network.
    if (!matches.length) return;
    cacheOffline('aurascore_matches', matches).catch(() => {});
  }, [matches.length]);

  
  
  // Permanent Cyber Obsidian Dark Mode

  const handleToggleFollowLeague = (leagueId: string) => {
    setFollowedLeagues((prev) => {
      const updated = prev.includes(leagueId) ? prev.filter((id) => id !== leagueId) : [...prev, leagueId];
      try {
        localStorage.setItem('aurascore_followed_leagues', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleToggleFollow = (match: MatchData) => {
    const exists = followedMatchIds.includes(match.id);
    if (exists) {
      MatchAlertScheduler.unfollowMatch(match.id);
      setFollowedMatchIds(prev => prev.filter(id => id !== match.id));
      // Remove from server-side follow store.
      fetch(`/api/follow?clientId=${encodeURIComponent(pushClientId)}&matchId=${encodeURIComponent(match.id)}`, { method: 'DELETE' }).catch(() => {});
    } else {
      MatchAlertScheduler.followMatch(match);
      setFollowedMatchIds(prev => [...prev, match.id]);
      // Persist to server so server-initiated push works.
      fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: pushClientId,
          matchId: match.id,
          matchTitle: `${match.homeTeam} vs ${match.awayTeam}`,
          lastHomeScore: match.homeScore,
          lastAwayScore: match.awayScore,
        }),
      }).catch(() => {});
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

  const [highGuaranteesOnly, setHighGuaranteesOnly] = useState(false);

  // Helper to extract clean YYYY-MM-DD in user's local timezone
  const getMatchLocalDate = (utcDate?: string): string => {
    if (!utcDate) return new Date().toLocaleDateString('en-CA');
    try {
      const d = new Date(utcDate);
      if (isNaN(d.getTime())) return new Date().toLocaleDateString('en-CA');
      return d.toLocaleDateString('en-CA');
    } catch {
      return new Date().toLocaleDateString('en-CA');
    }
  };

  // Strictly segment matches by the selected calendar day
  const dayMatches = React.useMemo(() => {
    return matches.filter((m) => {
      const matchDate = getMatchLocalDate(m.utcDate);
      return matchDate === selectedDateStr;
    });
  }, [matches, selectedDateStr]);

  const liveCount = dayMatches.filter(m => m.status === 'LIVE').length;
  const upcomingCount = dayMatches.filter(m => m.status === 'SCHEDULED').length;
  const playedCount = dayMatches.filter(m => m.status === 'FINISHED').length;
  const highGuaranteesCount = dayMatches.filter(m => (m.prediction?.topPick?.probability || 0) >= 70 || m.prediction?.topPick?.confidenceTier === 'ULTRA-BANKER').length;

  const filteredMatches = React.useMemo(() => {
    const base = dayMatches.filter(m => {
      const q = searchQuery.toLowerCase();
      if (q && !m.homeTeam.toLowerCase().includes(q) && !m.awayTeam.toLowerCase().includes(q) && !m.league.toLowerCase().includes(q)) return false;
      if (activeFilter === 'LIVE') return m.status === 'LIVE';
      if (activeFilter === 'UPCOMING') {
        if (m.status !== 'SCHEDULED') return false;
        // Verify kickoff is not in the past
        if (m.utcDate) {
          const matchKickoff = new Date(m.utcDate).getTime();
          if (!isNaN(matchKickoff) && matchKickoff < Date.now() - 30 * 60 * 1000) {
            return false;
          }
        }
        return true;
      }
      if (activeFilter === 'PLAYED') return m.status === 'FINISHED';
      if (activeFilter === 'FOLLOWING') return followedMatchIds.includes(m.id) || followedLeagues.some(l => m.league.toLowerCase().includes(l.toLowerCase()));
      if (highGuaranteesOnly && (m.prediction?.topPick?.probability || 0) < 70 && m.prediction?.topPick?.confidenceTier !== 'ULTRA-BANKER') return false;
      return true;
    });
    return sortMatchesByClosestKickoff(base, activeFilter);
  }, [dayMatches, searchQuery, activeFilter, highGuaranteesOnly, followedMatchIds, followedLeagues]);


  // Sync URL search params with Matches for Browser Back Button and Page Refresh Continuity
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const matchId = params.get('match');
      if (matchId && matches.length > 0) {
        const found = matches.find((m) => m.id === matchId);
        setSelectedMatchForInsights(found || null);
      } else if (!matchId) {
        setSelectedMatchForInsights(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [matches]);

  // Initial load check for ?match=id
  useEffect(() => {
    if (typeof window === 'undefined' || matches.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const matchId = params.get('match');
    if (matchId) {
      const found = matches.find((m) => m.id === matchId);
      if (found) setSelectedMatchForInsights(found);
    }
  }, [matches]);

  const displayedMatches = filteredMatches.slice(0, visibleCount);

  const todayLabel = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });

  type PillDef = { key: FilterType; emoji: string; label: string; count: number; activeClass: string };
  const filterPills: PillDef[] = [
    { key: 'LIVE',     emoji: '', label: t('Live'),     count: liveCount,     activeClass: 'bg-stadiumGreen/20 border-stadiumGreen text-stadiumGreen font-black shadow-lg shadow-stadiumGreen/30' },
    { key: 'UPCOMING', emoji: '', label: t('Upcoming'), count: upcomingCount, activeClass: 'bg-amber-500/20 border-amber-500 text-amber-400 font-black shadow-lg shadow-amber-500/30' },
    { key: 'PLAYED',   emoji: '', label: t('Played'),   count: playedCount,   activeClass: 'bg-cyan-500/20 border-cyan-500 text-cyan-400 font-black shadow-lg shadow-cyan-500/30' },
  ];
  const followingCount = (dayMatches || []).filter(m => (followedMatchIds || []).includes(m.id) || (followedLeagues || []).some(l => (m.league || '').toLowerCase().includes((l || '').toLowerCase()))).length;

  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-void flex flex-col pb-24 selection:bg-stadiumGreen selection:text-black font-sans `}>

        <BroadcastTicker matches={matches} onSelectUpdate={handleSelectTickerUpdate} />
        <OfflineBanner />
        <PhoneHardwareBanner />
        <GenZLiveAlerts matches={matches} onOpenMatch={(match) => setSelectedMatchForInsights(match)} />



        <StadiumHeader
          
          onOpenPlayers={() => setShowPlayersModal(true)}
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

          <GoogleDateNavigator onSelectDate={(dateStr, label, isToday, isPast) => { setSelectedDateStr(dateStr); setSelectedDateLabel(label); setIsViewingToday(isToday); if (isPast) { setActiveFilter('PLAYED'); } else if (isToday) { setActiveFilter('LIVE'); } else { setActiveFilter('UPCOMING'); } setSearchQuery(''); setVisibleCount(12); }} />

          {/* COLLAPSIBLE STADIUM HUB & NJA LIVE SUITES */}
          <CollapsibleStadiumHub
            onOpenGrassroots={() => setShowGrassrootsModal(true)}
            onOpenBanter={() => setShowBanterModal(true)}
            onOpenBirthdays={() => setShowBirthdaysModal(true)}
            onOpenLeaderboard={() => setShowLeaderboardModal(true)}
            onOpenLedger={() => setShowTrackRecord(true)}
            onOpenBankroll={() => setShowBankroll(true)}
            onOpenReceipt={() => matches.length > 0 && setSelectedMatchForReceipt(matches[0])}
          />

          {/* DLY MATCHES SECTION */}
          <div className="space-y-3">

            {/* Section header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-8 rounded-full bg-stadiumGreen flex-shrink-0" />
                <div>
                  <h2 className="text-base font-black text-white flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-stadiumGreen" />
                    <span>{isViewingToday ? t("Today's Matches") : `${selectedDateLabel} Matches`}</span>
                    {liveCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-crimson text-white text-[10px] font-black animate-pulse">
                        {liveCount} LIVE
                      </span>
                    )}
                  </h2>
                  <p className="text-[11px] text-gray-400">{isViewingToday ? todayLabel : selectedDateStr} &bull; {filteredMatches.length} fixtures</p>
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
                <button onClick={() => setShowViralArcade(true)}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-stadiumGreen/25 via-panel to-gold/25 border-2 border-gold/60 text-gold font-black text-xs flex items-center space-x-1.5 hover:scale-105 transition-all shadow-lg glow-emerald">
                  <Sparkles className="w-3.5 h-3.5 text-gold animate-spin" />
                  <span>Viral Hub ⚡</span>
                </button>
              </div>
            </div>

            {/* Search bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('Search team, league or fixture...')}
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-black/60 border border-white/10 text-sm text-white placeholder-gray-500 focus:border-stadiumGreen focus:outline-none font-mono" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-white/10">
                  x
                </button>
              )}
            </div>

            {/* Filter pills with counts (Immediately below Search Bar) */}
            <div className="space-y-2">

            {/* Line 1: ONLY 3 Complete Match Statuses (Distinct Colors, Single Clean Icon) */}
              <div className="grid grid-cols-3 gap-2">
                {filterPills.map(pill => (
                  <button
                    key={pill.key}
                    onClick={() => {
                      setActiveFilter(pill.key);
                      setVisibleCount(12);
                      try { stadiumAudio.playTabClickSound(); } catch (e) {}
                      if (typeof window !== 'undefined') {
                        const url = new URL(window.location.href);
                        url.searchParams.set('tab', pill.key.toLowerCase());
                        window.history.pushState({ tab: pill.key }, '', url.toString());
                      }
                    }}
                    className={'flex items-center justify-center space-x-2 py-3 px-3 rounded-2xl border text-xs font-black transition-all ' +
                      (activeFilter === pill.key ? pill.activeClass + ' scale-105 shadow-md' : 'border-white/10 text-gray-400 bg-panel hover:text-white hover:border-white/20')}
                  >
                    {pill.key === 'LIVE' ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-stadiumGreen animate-ping flex-shrink-0" />
                    ) : pill.key === 'UPCOMING' ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 flex-shrink-0" />
                    )}
                    <span className="font-extrabold">
                      {pill.key === 'LIVE' ? t('Live') : pill.key === 'UPCOMING' ? t('Upcoming') : t('Played')}
                    </span>
                    {pill.count > 0 && (
                      <span className={'px-2 py-0.5 rounded-full text-[10px] font-mono font-black ' + (activeFilter === pill.key ? 'bg-black/50 text-white' : 'bg-white/10 text-gray-300')}>
                        {pill.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Line 2: Following (Pinned), 35+ Leagues & High Guarantees (Clean 3-Button Balanced Grid) */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setActiveFilter('FOLLOWING');
                    setVisibleCount(12);
                    stadiumAudio.playTabClickSound();
                  }}
                  className={'py-2.5 px-2 rounded-2xl border text-xs font-black transition-all flex items-center justify-center space-x-1.5 shadow-md hover:scale-[1.02] ' +
                    (activeFilter === 'FOLLOWING'
                      ? 'bg-gold text-black border-gold font-black shadow-gold/30'
                      : 'border-white/10 text-gray-400 bg-panel hover:text-gold hover:border-gold/30')}
                >
                  <span className="text-sm">⭐</span>
                  <span className="truncate">{t('Following')}</span>
                  {followingCount > 0 && (
                    <span className={'px-1.5 py-0.2 rounded-full text-[9px] font-black ' + (activeFilter === 'FOLLOWING' ? 'bg-black/40 text-white' : 'bg-white/10 text-gold')}>
                      {followingCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setShowLeagueBrowser(true);
                    stadiumAudio.playTabClickSound();
                  }}
                  className="py-2.5 px-2 rounded-2xl border border-stadiumGreen/40 bg-stadiumGreen/15 hover:bg-stadiumGreen/25 text-stadiumGreen text-xs font-black transition-all flex items-center justify-center space-x-1.5 shadow-md hover:scale-[1.02]"
                >
                  <span>🌍</span>
                  <span className="truncate">{t('All Leagues')}</span>
                </button>

                <button
                  onClick={() => {
                    setHighGuaranteesOnly(!highGuaranteesOnly);
                    stadiumAudio.playTabClickSound();
                  }}
                  className={'py-2.5 px-2 rounded-2xl border text-xs font-black transition-all flex items-center justify-center space-x-1.5 shadow-md hover:scale-[1.02] ' +
                    (highGuaranteesOnly
                      ? 'bg-stadiumGreen/25 border-stadiumGreen text-stadiumGreen shadow-stadiumGreen/20'
                      : 'border-white/10 text-gray-400 bg-panel hover:text-white hover:border-white/20')}
                >
                  <span className="text-sm">👑</span>
                  <span className="truncate">{t('Bankers')}</span>
                </button>
              </div>
            </div>



            {/* Match grid */}
            {loadingMatches ? (
              <StadiumSmartPreloader />
            ) : filteredMatches.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {displayedMatches.map(match => (
                    <DailyMatchCard
                      key={match.id}
                      match={match}
                      onOpenInsights={setSelectedMatchForInsights}
                      onSelectOdds={handleAddBetItem}
                      onBookmarkMatch={handleBookmarkToggle}
                      followedMatchIds={followedMatchIds}
                      onToggleFollow={handleToggleFollow}
                      onOpenStandings={(league) => {
                        setSelectedLeagueForTable(league);
                        setShowStandingsModal(true);
                      }}
                      onOpenTeam={(teamName) => setSelectedClubForProfile(teamName)}
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

          {/* Daily 3-Game Safe Accumulator & Ledger Summary */}
          <div className="pt-4 space-y-4 border-t border-white/10">
            <DailyBankerAccumulatorCard
              matches={matches}
              onAddMultiPick={handleAddMultiPicks}
              onOpenMatch={setSelectedMatchForInsights}
            />
            <SettlementLedgerSection onOpenAuditModal={() => setShowHistoryModal(true)} />
            <SportsNewsSection />
          </div>

          {/* STADIUM FOOTER WITH PROMINENT LANGUAGE SWITCHER */}
          <StadiumFooter
            onOpenLedger={() => setShowHistoryModal(true)}
            onOpenLegal={() => setShowLegalModal(true)}
          />

          <ScreenPinnedMatchWidget />
    </main>

        <BetSlipDrawer items={betSlipItems} onRemoveItem={handleRemoveBetItem} onClearAll={() => setBetSlipItems([])}
          isOpenControlled={showBetSlipDrawer} onToggleControlled={() => setShowBetSlipDrawer(!showBetSlipDrawer)} />

        <MobileAppDock activeTab={activeDockTab}
          onSelectTab={tab => { setActiveDockTab(tab); if (tab === 'SLIP') setShowBetSlipDrawer(true); if (tab === 'SUITES') setShowSuitesMenu(true); if (tab === 'PROFILE') setShowProfile(true); }}
          betSlipCount={betSlipItems.length}
          onOpenProfile={() => setShowProfile(true)}
          onOpenLedger={() => setShowTrackRecord(true)}
          onOpenSuitesMenu={() => setShowSuitesMenu(true)} />

        <StadiumSuitesMenu
          isOpen={showSuitesMenu}
          onClose={() => setShowSuitesMenu(false)}
          onOpenBirthdays={() => setShowBirthdaysModal(true)}
          onOpenLeaderboard={() => setShowLeaderboardModal(true)}
          onOpenLedger={() => setShowHistoryModal(true)}
          onOpenStandings={() => setShowStandingsModal(true)}
          onOpenClubs={() => setShowTeamsModal(true)}
          onOpenNews={() => setShowNewsModal(true)}
          onOpenBanter={() => setShowBanterModal(true)}
          onOpenGrassroots={() => setShowGrassrootsModal(true)}
        />

        {selectedClubForProfile && (
          <ClubProfileHubModal
            isOpen={!!selectedClubForProfile}
            teamName={selectedClubForProfile}
            onClose={() => setSelectedClubForProfile(null)}
          />
        )}
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
        {showProfile && (
          <AuthDashboardModal
            isOpen={showProfile}
            onClose={() => setShowProfile(false)}
            followedMatchIds={followedMatchIds}
            followedLeagues={followedLeagues}
          />
        )}
        {showTeamsModal && <TeamExplorerModal onClose={() => setShowTeamsModal(false)} />}
        {showBirthdaysModal && <BirthdayCenterModal onClose={() => setShowBirthdaysModal(false)} />}
        {showBanterModal && <NaijaBanterLoungeModal onClose={() => setShowBanterModal(false)} />}
        {showGrassrootsModal && <GrassrootsScoutingModal onClose={() => setShowGrassrootsModal(false)} />}
        {showLeaderboardModal && <TipsterLeaderboardModal onClose={() => setShowLeaderboardModal(false)} />}
        {showLegalModal && <LegalModal onClose={() => setShowLegalModal(false)} />}
        {showStandingsModal && (
          <LeagueStandingsModal
            isOpen={showStandingsModal}
            initialLeague={selectedLeagueForTable || 'PREMIER_LEAGUE'}
            onClose={() => setShowStandingsModal(false)}
            onSelectTeam={() => setShowTeamsModal(true)}
          />
        )}
        {showPlayersModal && (
          <PlayerRadarModal
            isOpen={showPlayersModal}
            onClose={() => {
              setShowPlayersModal(false);
              setFollowedPlayers(playerFollowEngine.getFollowedPlayers());
            }}
          />
        )}
        {showLeagueBrowser && (
          <GlobalLeagueBrowser
            isOpen={showLeagueBrowser}
            onClose={() => setShowLeagueBrowser(false)}
            onSelectLeague={(leagueName) => {
              setSearchQuery(leagueName);
              setActiveFilter('ALL');
            }}
            followedLeagues={followedLeagues}
            onToggleFollowLeague={handleToggleFollowLeague}
          />
        )}
        {showHistoryModal && <HistoryArchiveModal onClose={() => setShowHistoryModal(false)} />}
        {showReverseJinxModal && <ReverseJinxModal onClose={() => setShowReverseJinxModal(false)} />}
        {showRotatingPoolModal && <RotatingPoolModal onClose={() => setShowRotatingPoolModal(false)} />}
        {showEffectsModal && <EffectsModal onClose={() => setShowEffectsModal(false)} />}
        {showVcFundingModal && <VcFundingModal onClose={() => setShowVcFundingModal(false)} />}
        {showCloutCardModal && matches[0] && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden">
              <CloutCardGenerator
                matchTitle={matches[0].homeTeam + ' vs ' + matches[0].awayTeam}
                pickSelection={matches[0].prediction.topPick.selection}
                odds={matches[0].prediction.topPick.odds}
                winRate={matches[0].prediction.topPick.probability}
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