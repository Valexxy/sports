import { fetchEspnMatchDetails, MULTI_SPORT_FIXTURES } from '../lib/real-sports-stream';
import { getRealLiveAndPlayedMatches } from '../lib/real-sports-stream';

async function testESPNWeek() {
  const path = 'soccer/eng.1';
  // Check if dates parameter can be just YYYYMMDD
  const dates = ['20260918', '20260919', '20260920'];
  let total = 0;
  for (const date of dates) {
    const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/${path}/scoreboard?dates=${date}`);
    if (res.ok) {
        const data = await res.json();
        console.log(`Date ${date}: ${data.events.length} events`);
        total += data.events.length;
    } else {
        console.log(`Date ${date} error:`, res.status);
    }
  }
  console.log('Total:', total);
}

testESPNWeek();
