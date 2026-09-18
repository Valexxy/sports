import { getRealLiveAndPlayedMatches, getSportsFeed } from '../lib/real-sports-stream';

async function main() {
  console.log('Testing getRealLiveAndPlayedMatches...');
  try {
    const liveAndPlayed = await getRealLiveAndPlayedMatches();
    console.log(`Live/Played Matches Count: ${liveAndPlayed?.length}`);
    if (liveAndPlayed?.length > 0) {
        console.log(liveAndPlayed[0].homeTeam, 'vs', liveAndPlayed[0].awayTeam);
    }
  } catch (e) {
    console.error('Error fetching live and played:', e);
  }

  console.log('Testing getSportsFeed...');
  try {
    const feed = await getSportsFeed();
    console.log(`Sports Feed Count: ${feed?.length}`);
  } catch (e) {
    console.error('Error fetching sports feed:', e);
  }
}

main().catch(console.error);
