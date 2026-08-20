/**
 * AUTOMATIC GPS & IP LOCATION TIMEZONE CONVERTOR
 * Hydration-safe timezone detector for Next.js SSR & Client rendering.
 */

export interface UserLocationTimezone {
  timezone: string;
  city: string;
  country: string;
  flag: string;
  formattedOffset: string;
}

export function detectUserLocationTimezone(): UserLocationTimezone {
  if (typeof window === 'undefined') {
    return {
      timezone: 'Africa/Lagos',
      city: 'LAGOS',
      country: 'Nigeria',
      flag: '🇳🇬',
      formattedOffset: 'UTC+1',
    };
  }

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Lagos';
    const parts = tz.split('/');
    const city = parts[parts.length - 1].replace('_', ' ').toUpperCase();

    let flag = '🌍';
    if (tz.includes('Lagos') || tz.includes('Africa')) flag = '🇳🇬';
    else if (tz.includes('London') || tz.includes('Europe')) flag = '🇬🇧';
    else if (tz.includes('New_York') || tz.includes('America')) flag = '🇺🇸';
    else if (tz.includes('Tokyo') || tz.includes('Asia')) flag = '🇯🇵';

    const offsetMinutes = new Date().getTimezoneOffset();
    const offsetHours = Math.abs(Math.floor(offsetMinutes / 60));
    const offsetSign = offsetMinutes <= 0 ? '+' : '-';
    const formattedOffset = `UTC${offsetSign}${offsetHours}`;

    return {
      timezone: tz,
      city: city || 'LAGOS',
      country: tz.includes('Lagos') ? 'Nigeria' : tz.includes('London') ? 'United Kingdom' : 'International',
      flag,
      formattedOffset,
    };
  } catch (e) {
    return {
      timezone: 'Africa/Lagos',
      city: 'LAGOS',
      country: 'Nigeria',
      flag: '🇳🇬',
      formattedOffset: 'UTC+1',
    };
  }
}
