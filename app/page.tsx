'use client';

import React, { useState, useEffect } from 'react';
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

  const sportMatches = matches.filter(m => m.sport === selectedSport);
  const liveCount = sportMatches.filter(m => m.status === 'LIVE').length;
  const upcomingCount = sportMatches.filter(m => m.status === 'SCHEDULED').length;
  const playedCount = sportMatches.filter(m => m.status === 'FINISHED').length;
  const highGuaranteesCount = sportMatches.filter(m => (m.prediction?.topPick?.probability || 0) >= 70 || m.prediction?.topPick?.confidenceTier === 'ULTRA-BANKER').length;

  const filteredMatches = React.useMemo(() => {
    const base = matches.filter(m => {
      // Filter by Date (Match utcDate ISO YYYY-MM-DD vs selectedDateStr)
      if (selectedDateStr) {
        // Accurate date matching
        const matchDate = m.utcDate ? new Date(m.utcDate).toLocaleDateString('en-CA') : new Date().toISOString().split('T')[0];
        if (isViewingToday && m.status === 'LIVE') {
          // Keep live matches on today
        } else if (matchDate !== selectedDateStr) {
          return false;
        }
      }

      const q = searchQuery.toLowerCase();
      if (q && !m.homeTeam.toLowerCase().includes(q) && !m.awayTeam.toLowerCase().includes(q) && !m.league.toLowerCase().includes(q)) return false;
      if (activeFilter === 'LIVE') return m.status === 'LIVE';
      if (activeFilter === 'UPCOMING') {
        if (m.status !== 'SCHEDULED') return false;
        // Verify kickoff is not in the past
        if (m.utcDate) {
          const matchKickoff = new Date(m.utcDate).getTime();
          // If kickoff was more than 30 mins ago, it has already started/concluded
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
  }, [matches, selectedDateStr, isViewingToday, searchQuery, activeFilter, highGuaranteesOnly, followedMatchIds, followedLeagues]);

  const displayedMatches = filteredMatches.slice(0, visibleCount);

  const todayLabel = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });

  type PillDef = { key: FilterType; emoji: string; label: string; count: number; activeClass: string };
  const filterPills: PillDef[] = [
    { key: 'LIVE',     emoji: '🟢', label: t('Live'),     count: liveCount,     activeClass: 'bg-stadiumGreen/25 border-stadiumGreen text-stadiumGreen font-black shadow-lg shadow-stadiumGreen/30' },
    { key: 'UPCOMING', emoji: '🟡', label: t('Upcoming'), count: upcomingCount, activeClass: 'bg-gold/25 border-gold text-gold font-black shadow-lg shadow-gold/20' },
    { key: 'PLAYED',   emoji: '✅', label: t('Played'),   count: playedCount,   activeClass: 'bg-stadiumGreen/25 border-stadiumGreen text-stadiumGreen font-black shadow-lg shadow-stadiumGreen/20' },
  ];
  const followingCount = sportMatches.filter(m => followedMatchIds.includes(m.id) || followedLeagues.some(l => m.league.toLowerCase().includes(l.toLowerCase()))).length;

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

          <GoogleDateNavigator onSelectDate={(dateStr, label, isToday) => { setSelectedDateStr(dateStr); setSelectedDateLabel(label); setIsViewingToday(isToday); setActiveFilter('ALL'); setSearchQuery(''); setVisibleCount(12); }} />

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
                <button onClick={() => setShowSuitesMenu(true)}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-stadiumGreen/20 to-gold/20 border border-stadiumGreen/40 text-stadiumGreen font-black text-xs flex items-center space-x-1.5 hover:scale-105 transition-all">
                  <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
                  <span className="hidden sm:inline">Stadium Hub ⚡</span>
                  <span className="sm:hidden">Hub ⚡</span>
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

            {/* Filter pills with counts */}
            <div className="space-y-2">
              {/* Line 1: ONLY 3 Complete Match Statuses (Live, Upcoming, Played) */}
              <div className="grid grid-cols-3 gap-2">
                {filterPills.map(pill => (
                  <button
                    key={pill.key}
                    onClick={() => {
                      setActiveFilter(pill.key);
                      setVisibleCount(12);
                      stadiumAudio.playTabClickSound();
                    }}
                    className={'flex items-center justify-center space-x-2 py-3 px-3 rounded-2xl border text-xs font-black transition-all ' +
                      (activeFilter === pill.key ? pill.activeClass + ' scale-105 shadow-md' : 'border-white/10 text-gray-400 bg-panel hover:text-white hover:border-white/20')}
                  >
                    {pill.key === 'LIVE' ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-stadiumGreen animate-ping flex-shrink-0" />
                    ) : pill.key === 'UPCOMING' ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-gold flex-shrink-0" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-stadiumGreen flex-shrink-0" />
                    )}
                    <span className="font-extrabold">{pill.label}</span>
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
                  <span>👑</span>
                  <span className="truncate">👑 70%+ Bankers</span>
                </button>
              </div>
            </div>

            {/* 100% Pure Football Guarantee Banner */}
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1.5 rounded-xl bg-stadiumGreen/20 border border-stadiumGreen/40 text-stadiumGreen font-black text-xs flex items-center space-x-1.5 shadow-md">
                <span>{t('100% Pure Football Stadium')}</span>
                <span className="w-2 h-2 rounded-full bg-stadiumGreen animate-ping" />
              </span>
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

          {/* Viral world-first features */}
          <div className="pt-4 space-y-3 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider">⚡ World-First Features</span>
              <button onClick={() => setShowSuitesMenu(true)} className="text-[10px] text-stadiumGreen font-bold hover:underline">Open Full Menu</button>
            </div>
            <ViralFeaturesGrid matches={matches} onSelectMatch={(m) => setSelectedMatchForInsights(m)} />
            <SettlementLedgerSection onOpenAuditModal={() => setShowHistoryModal(true)} />
            <SportsNewsSection />
          </div>

          {/* STADIUM FOOTER WITH PROMINENT LANGUAGE SWITCHER */}
          <StadiumFooter
            onOpenLedger={() => setShowHistoryModal(true)}
            onOpenLegal={() => setShowLegalModal(true)}
          />

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