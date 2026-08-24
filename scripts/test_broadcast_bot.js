const { AutomatedBroadcastBot } = require('../lib/automated-broadcast-bot');

const bot = new AutomatedBroadcastBot();

console.log('================================================================');
console.log('🤖 MIVAJ SPORTS AUTOMATED BROADCAST BOT LOCAL SIMULATION');
console.log('================================================================\n');

console.log('1️⃣ MORNING 8:00 AM BANKER ACCUMULATOR BROADCAST:');
const morning = bot.generateMorningBankerSlip();
console.log(morning.whatsappFormattedText);

console.log('\n----------------------------------------------------------------\n');

console.log('2️⃣ EVENING 10:30 PM SETTLEMENT AUDIT REPORT:');
const evening = bot.generateEveningSettlementReport(5, 5);
console.log(evening.whatsappFormattedText);

console.log('\n================================================================');
console.log('✅ Local bot simulation executed with 100% success!');
console.log('================================================================');
