/**
 * Production Environment Validator for AuraScore (mivaj.com)
 * Ensures required keys exist and alerts for missing configurations
 */

export interface ValidatedEnv {
  siteUrl: string;
  isProduction: boolean;
  hasSupabase: boolean;
  hasPaystack: boolean;
}

export function validateEnvironment(): ValidatedEnv {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mivaj.com';
  const isProduction = process.env.NODE_ENV === 'production';
  const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasPaystack = !!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

  if (isProduction && !process.env.SESSION_SECRET) {
    console.warn('⚠️ Warning: SESSION_SECRET is not set in production. Using fallback secret.');
  }

  return {
    siteUrl,
    isProduction,
    hasSupabase,
    hasPaystack,
  };
}
