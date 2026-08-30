const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wpspjtsrvvmlceizdzci.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwc3BqdHNydnZtbGNlaXpkemNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTE5MzY2NSwiZXhwIjoyMDk0NzY5NjY1fQ.cn4v-F_ZOenYrLBol3Iza0KiMCvW1MPisv9QVQvGocg';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);

async function initPlatformDatabase() {
  console.log('🚀 INITIALIZING SUPABASE PLATFORM DATA ARCHITECTURE...');

  const tablesToCheck = [
    {
      name: 'live_active_users',
      sample: {
        session_id: 'seed-admin-001',
        user_alias: 'Chief Oracle',
        city: 'Awka',
        state: 'Anambra',
        country: 'Nigeria',
        current_page: '/',
        active_match_id: 'seed-live',
        device_type: 'Desktop Windows',
        last_heartbeat: new Date().toISOString(),
      },
    },
    {
      name: 'match_engagements',
      sample: {
        match_id: 'seed-match-001',
        action_type: 'stadium_mic_toggle',
        user_alias: 'Fan_Awka',
        city: 'Awka',
        metadata: { volume: 0.8 },
      },
    },
    {
      name: 'city_clout_cheers',
      sample: {
        city_id: 'awka',
        city_name: 'Awka',
        country: 'Nigeria',
        cheer_count: 1,
        user_alias: 'Chief Punter',
      },
    },
    {
      name: 'community_news_posts',
      sample: {
        id: 'seed-post-001',
        title: 'Tactical Breakdown: High Press Dominance in European Derbies',
        category: 'Tactical Breakdown 📊',
        author_name: 'OracleTactician',
        lead_hook: 'A masterclass in transitional shape decided yesterday\'s top fixture.',
        body: 'Utilizing inverted fullbacks and half-space overloads, modern systems neutralize low blocks.',
        quote: 'We maintained positional discipline throughout 90 minutes.',
        verdict: 'Title momentum shifts significantly ahead of next weekend\'s clash.',
        full_content: 'Full tactical analysis published on Mivaj Sports.',
        status: 'APPROVED',
      },
    },
    {
      name: 'user_bet_slips',
      sample: {
        slip_id: 'slip-seed-001',
        user_alias: 'VIP_Punter',
        total_odds: 4.85,
        match_count: 3,
        items: [{ matchId: 'm1', selection: '1X', odds: 1.25 }],
        status: 'OPEN',
      },
    },
  ];

  for (const table of tablesToCheck) {
    console.log(`Checking table: ${table.name}...`);
    const { data, error } = await supabaseAdmin.from(table.name).select('*').limit(1);

    if (error) {
      console.log(`Creating initial seed record for ${table.name} (Error: ${error.message})...`);
      const { error: insertErr } = await supabaseAdmin.from(table.name).insert([table.sample]);
      if (insertErr) {
        console.log(`⚠️ Note on ${table.name}: ${insertErr.message}`);
      } else {
        console.log(`✅ Seeded ${table.name} successfully.`);
      }
    } else {
      console.log(`✅ Table ${table.name} is active and reachable.`);
    }
  }

  console.log('🎉 Database architecture validation complete.');
}

initPlatformDatabase();
