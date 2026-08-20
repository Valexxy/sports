import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wpspjtsrvvmlceizdzci.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwc3BqdHNydnZtbGNlaXpkemNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxOTM2NjUsImV4cCI6MjA5NDc2OTY2NX0.rJg42mJsY2rYfDldhR_O1J3T0fcpNQNrujywJIBziXA';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwc3BqdHNydnZtbGNlaXpkemNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTE5MzY2NSwiZXhwIjoyMDk0NzY5NjY1fQ.cn4v-F_ZOenYrLBol3Iza0KiMCvW1MPisv9QVQvGocg';

// Public client for frontend queries
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for backend API routes (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
