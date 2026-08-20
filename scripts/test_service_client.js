const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://wpspjtsrvvmlceizdzci.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwc3BqdHNydnZtbGNlaXpkemNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTE5MzY2NSwiZXhwIjoyMDk0NzY5NjY1fQ.cn4v-F_ZOenYrLBol3Iza0KiMCvW1MPisv9QVQvGocg';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function run() {
  console.log('Testing Supabase Admin client with service_role key...');
  
  // Test listing or querying
  const { data, error } = await supabaseAdmin.from('matches').select('*').limit(1);
  console.log('Matches table check:', { data, error: error ? error.message : null });
}

run();
