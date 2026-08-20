const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://wpspjtsrvvmlceizdzci.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwc3BqdHNydnZtbGNlaXpkemNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTE5MzY2NSwiZXhwIjoyMDk0NzY5NjY1fQ.cn4v-F_ZOenYrLBol3Iza0KiMCvW1MPisv9QVQvGocg';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);

async function verifyAllTables() {
  console.log('--- SUPABASE AUDIT PASS ---');
  
  const tables = ['settlement_ledger', 'tipster_leaderboard', 'star_birthdays', 'matches', 'fan_comments', 'user_profiles'];
  
  for (const table of tables) {
    const { data, count, error } = await supabaseAdmin.from(table).select('*', { count: 'exact' });
    if (error) {
      console.log(`❌ Table ${table}: Error - ${error.message}`);
    } else {
      console.log(`✅ Table ${table}: READY (${data.length} records)`);
    }
  }
}

verifyAllTables();
