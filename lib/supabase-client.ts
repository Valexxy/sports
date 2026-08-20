import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wpspjtsrvvmlceizdzci.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indwc3BqdHNydnZtbGNlaXpkemNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxOTM2NjUsImV4cCI6MjA5NDc2OTY2NX0.rJg42mJsY2rYfDldhR_O1J3T0fcpNQNrujywJIBziXA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
