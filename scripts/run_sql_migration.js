const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://wpspjtsrvvmlceizdzci.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwc3BqdHNydnZtbGNlaXpkemNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxOTM2NjUsImV4cCI6MjA5NDc2OTY2NX0.rJg42mJsY2rYfDldhR_O1J3T0fcpNQNrujywJIBziXA';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
  console.log('Testing Supabase connection to:', SUPABASE_URL);
  
  // Test querying public schema
  const { data, error } = await supabase.from('settlement_ledger').select('*').limit(1);
  if (error) {
    console.log('Table query status:', error.message);
  } else {
    console.log('Successfully queried settlement_ledger:', data);
  }
}

testConnection();
