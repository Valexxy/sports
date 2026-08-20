// Audit all available Sports APIs and Free Open-Source Endpoints
async function audit() {
  console.log('========================================================');
  console.log('🎯 SPORTS DATA PROVIDER AUDIT & CONSISTENCY BENCHMARK');
  console.log('========================================================\n');

  // 1. Football-Data.org
  console.log('--- [1/6] Football-Data.org API ---');
  const fdToken = 'a981804ab6084434ba7ba719625ec403';
  try {
    const res = await fetch('https://api.football-data.org/v4/competitions', { headers: { 'X-Auth-Token': fdToken } });
    const data = await res.json();
    console.log('✅ Football-Data Competitions Count:', data.count);
    const freeCompetitions = (data.competitions || []).map(c => `${c.code} (${c.name})`).slice(0, 10).join(', ');
    console.log('Tier 1 Leagues:', freeCompetitions);

    // Test matches in 7-day window
    const now = new Date();
    const from = new Date(now.getTime() - 2 * 24 * 3600 * 1000).toISOString().split('T')[0];
    const to = new Date(now.getTime() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0];
    const matchesRes = await fetch(`https://api.football-data.org/v4/matches?dateFrom=${from}&dateTo=${to}`, { headers: { 'X-Auth-Token': fdToken } });
    const matchesData = await matchesRes.json();
    console.log(`✅ Matches found (${from} to ${to}):`, matchesData.matches ? matchesData.matches.length : 0);
  } catch (e) {
    console.log('❌ Football-Data error:', e.message);
  }

  // 2. API-Football / RapidAPI Football
  console.log('\n--- [2/6] API-Football (v3.football.api-sports.io) ---');
  const afKey = '07863f00be86e38e6acd612429b97507';
  try {
    const res = await fetch('https://v3.football.api-sports.io/status', { headers: { 'x-apisports-key': afKey } });
    const data = await res.json();
    console.log('Status Response:', JSON.stringify(data.response || data));
  } catch (e) {
    console.log('❌ API-Football error:', e.message);
  }

  // 3. The-Odds-API
  console.log('\n--- [3/6] The-Odds-API Live Bookmaker Odds ---');
  const oddsKey = '3e00f52c770db241cf948012953cebf2';
  try {
    const res = await fetch(`https://api.the-odds-api.com/v4/sports/?apiKey=${oddsKey}`);
    const data = await res.json();
    console.log('✅ The-Odds-API Active Sports Count:', Array.isArray(data) ? data.length : 'Error');
    if (Array.isArray(data)) {
      const soccerKeys = data.filter(s => s.group === 'Soccer').map(s => s.key);
      console.log('Active Soccer Leagues in Odds API:', soccerKeys.slice(0, 8).join(', '));
    }
  } catch (e) {
    console.log('❌ The-Odds-API error:', e.message);
  }

  // 4. ESPN Global Soccer Scoreboards (Free, Keyless, 0 Rate Limit, 100% Real-Time)
  console.log('\n--- [4/6] ESPN Hidden Public Scoreboards (Free, 0 Rate Limit) ---');
  const espnLeagues = [
    { code: 'eng.1', name: 'Premier League' },
    { code: 'esp.1', name: 'La Liga' },
    { code: 'ger.1', name: 'Bundesliga' },
    { code: 'ita.1', name: 'Serie A' },
    { code: 'fra.1', name: 'Ligue 1' },
    { code: 'uefa.champions', name: 'UEFA Champions League' },
    { code: 'uefa.europa', name: 'UEFA Europa League' },
    { code: 'conmebol.libertadores', name: 'Copa Libertadores' },
    { code: 'usa.1', name: 'MLS' },
    { code: 'mex.1', name: 'Liga MX' },
    { code: 'bra.1', name: 'Brasileirao' },
    { code: 'sau.1', name: 'Saudi Pro League' }
  ];

  let totalEspnMatches = 0;
  for (const l of espnLeagues) {
    try {
      const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/soccer/${l.code}/scoreboard`);
      const d = await res.json();
      const count = d.events ? d.events.length : 0;
      totalEspnMatches += count;
      console.log(`  • ${l.name} (${l.code}): ${count} fixtures returned`);
      if (count > 0) {
        const ev = d.events[0];
        const h = ev.competitions[0].competitors.find(c => c.homeAway === 'home');
        const a = ev.competitions[0].competitors.find(c => c.homeAway === 'away');
        console.log(`    Sample: ${h?.team?.shortDisplayName || 'H'} vs ${a?.team?.shortDisplayName || 'A'} | Status: ${ev.status?.type?.detail} | Score: ${h?.score || 0}-${a?.score || 0}`);
      }
    } catch (e) {
      console.log(`  • ${l.name}: Error ${e.message}`);
    }
  }
  console.log(`✅ Total ESPN Soccer Fixtures Available right now: ${totalEspnMatches}`);

  // 5. ESPN Multi-Sport Scoreboards (Basketball, Baseball, Tennis, Football)
  console.log('\n--- [5/6] ESPN Multi-Sport Scoreboards ---');
  const multiSports = [
    { path: 'basketball/nba', name: 'NBA Basketball' },
    { path: 'basketball/wnba', name: 'WNBA Basketball' },
    { path: 'baseball/mlb', name: 'MLB Baseball' },
    { path: 'tennis/atp', name: 'ATP Tennis' },
    { path: 'tennis/wta', name: 'WTA Tennis' }
  ];

  for (const s of multiSports) {
    try {
      const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${s.path}/scoreboard`);
      const d = await res.json();
      const count = d.events ? d.events.length : 0;
      console.log(`  • ${s.name}: ${count} live/upcoming fixtures`);
      if (count > 0) {
        const ev = d.events[0];
        console.log(`    Sample: ${ev.name} | ${ev.status?.type?.detail}`);
      }
    } catch (e) {
      console.log(`  • ${s.name}: Error ${e.message}`);
    }
  }

  // 6. TheSportsDB Free Open Tier (Key '3')
  console.log('\n--- [6/6] TheSportsDB Open API (Key: 3) ---');
  try {
    const res = await fetch('https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=4328'); // EPL
    const d = await res.json();
    console.log('✅ TheSportsDB EPL Upcoming Events:', d.events ? d.events.length : 0);
    if (d.events && d.events.length > 0) {
      console.log(`  Sample: ${d.events[0].strEvent} on ${d.events[0].dateEvent}`);
    }
  } catch (e) {
    console.log('❌ TheSportsDB error:', e.message);
  }
}

audit();
