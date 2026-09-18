import { getRealLiveAndPlayedMatches } from '../lib/real-sports-stream';

// Bypass throttling to test raw output
async function main() {
  const { fetchFootballDataMatches, fetchSingleEspnLeague, ESPN_LEAGUES } = require('../lib/real-sports-stream');
  
  // They are not exported! We can't access them.
  console.log('Testing...');
}
main();
