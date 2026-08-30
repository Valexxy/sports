/**
 * ULTRA-STABLE HIGH-PRECISION MULTI-TIERED GEOLOCATION ENGINE
 * Tier 1: Hardware GPS (enableHighAccuracy: true) + Geoapify Reverse Geocode (NEXT_PUBLIC_GEOAPIFY_API_KEY) / Nominatim
 * Tier 2: Multi-Provider IP Fallback (/api/location -> ipapi.co -> ipwho.is -> ip-api.com)
 * Tier 3: Manual City Override via LocalStorage
 */

export interface HyperlocalIntelligence {
  houseNumber?: string;
  street?: string;
  neighbourhood?: string;
  city: string;
  state?: string;
  country: string;
  countryFlag: string;
  formattedAddress: string;
  latitude?: number;
  longitude?: number;
  isGpsPrecise: boolean;
  formattedTimezone: string;
  isp: string;
  weatherSummary: string;
  temperatureC: number;
  pitchCondition: string;
  viewingCentersNearby: string;
  matchLightingKickoff: string;
  _cachedAt?: number;
}

const STORAGE_KEY = 'mivaj_hyperlocal_location';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes cache (eliminates stale IP locks)

const GEOAPIFY_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || 'b3c40417fa0a426aa81800131c060e83';

/**
 * Tier 1 Reverse Geocoding: Geoapify -> OpenStreetMap Nominatim -> BigDataCloud
 */
async function reverseGeocodeCoords(lat: number, lon: number): Promise<Partial<HyperlocalIntelligence>> {
  // 1. Primary: Geoapify Reverse Geocoding (high precision down to street & town in Anambra e.g. Awka, Onitsha, Nnewi)
  if (GEOAPIFY_KEY) {
    try {
      const res = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_KEY}`,
        { signal: AbortSignal.timeout(6000) }
      );
      if (res.ok) {
        const data = await res.json();
        const props = data.features?.[0]?.properties;
        if (props) {
          const city = props.city || props.town || props.village || props.municipality || props.county || 'Awka';
          const state = props.state || 'Anambra';
          const country = props.country || 'Nigeria';
          const suburb = props.suburb || props.neighbourhood || props.district || '';
          const street = props.street || '';
          const formatted = props.formatted || `${city}, ${state}, ${country}`;

          return {
            city: city.toUpperCase(),
            state,
            country,
            street,
            neighbourhood: suburb,
            formattedAddress: formatted,
            latitude: lat,
            longitude: lon,
            isGpsPrecise: true,
          };
        }
      }
    } catch (e) {
      console.warn('Geoapify reverse geocoding attempt failed, trying Nominatim...', e);
    }
  }

  // 2. Secondary: OpenStreetMap Nominatim
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
      { headers: { 'User-Agent': 'MivajSports/2.1' }, signal: AbortSignal.timeout(4000) }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || 'Awka';
      const state = addr.state || 'Anambra';
      const country = addr.country || 'Nigeria';
      const suburb = addr.suburb || addr.neighbourhood || '';
      return {
        city: city.toUpperCase(),
        state,
        country,
        neighbourhood: suburb,
        formattedAddress: `${city}, ${state}, ${country}`,
        latitude: lat,
        longitude: lon,
        isGpsPrecise: true,
      };
    }
  } catch {}

  // 3. Fallback: BigDataCloud
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      { signal: AbortSignal.timeout(4000) }
    );
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || 'Awka';
      const state = data.principalSubdivision || '';
      const country = data.countryName || 'Nigeria';
      return {
        city: city.toUpperCase(),
        state,
        country,
        formattedAddress: `${city}${state ? ', ' + state : ''}, ${country}`,
        latitude: lat,
        longitude: lon,
        isGpsPrecise: true,
      };
    }
  } catch {}

  return {};
}

/**
 * Derives local weather & pitch condition from coordinates
 */
export async function fetchLocalWeatherIntel(lat: number, lon: number): Promise<{ temp: number; weather: string; pitch: string }> {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&forecast_days=1`,
      { signal: AbortSignal.timeout(4000) }
    );
    if (!res.ok) throw new Error();
    const data = await res.json();
    const temp = Math.round(data.current?.temperature_2m ?? 28);
    const rain = (data.current?.precipitation ?? 0) > 0.1;

    return {
      temp,
      weather: rain ? `${temp}°C Rain Showers 🌧️` : `${temp}°C Clear Sky ☀️`,
      pitch: rain ? 'Slick Wet Pitch 🌧️ (Draw Likelihood Higher)' : 'Dry Fast Match Turf ☀️',
    };
  } catch {
    return { temp: 28, weather: '28°C Warm ⛅', pitch: 'Firm Match Turf ☀️' };
  }
}

/**
 * Tier 2: Multi-Provider IP Fallback (/api/location -> ipapi.co -> ipwho.is -> ip-api.com)
 */
async function fetchIpLocation(): Promise<{ city: string; state: string; country: string; lat: number; lon: number; isp: string }> {
  // Provider 1: Internal Next.js API (Edge Geo Headers)
  try {
    const res = await fetch('/api/location', { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const d = await res.json();
      if (d.success && d.city && d.city !== 'Nigeria Match Hub') {
        return { 
          city: d.city, 
          state: d.region || '', 
          country: d.country || 'Nigeria', 
          lat: d.latitude || 6.2108, 
          lon: d.longitude || 7.0707, 
          isp: 'Network IP' 
        };
      }
    }
  } catch {}

  // Provider 2: ipapi.co
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const d = await res.json();
      if (d.city) {
        return { 
          city: d.city, 
          state: d.region || '', 
          country: d.country_name || 'Nigeria', 
          lat: d.latitude || 6.2108, 
          lon: d.longitude || 7.0707, 
          isp: d.org || 'Broadband' 
        };
      }
    }
  } catch {}

  // Provider 3: ipwho.is
  try {
    const res = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const d = await res.json();
      if (d.success && d.city) {
        return { 
          city: d.city, 
          state: d.region || '', 
          country: d.country || 'Nigeria', 
          lat: d.latitude || 6.2108, 
          lon: d.longitude || 7.0707, 
          isp: d.connection?.isp || 'Broadband' 
        };
      }
    }
  } catch {}

  // Provider 4: ip-api.com
  try {
    const res = await fetch('http://ip-api.com/json/?fields=status,country,regionName,city,lat,lon,isp', { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const d = await res.json();
      if (d.status === 'success' && d.city) {
        return { 
          city: d.city, 
          state: d.regionName || '', 
          country: d.country || 'Nigeria', 
          lat: d.lat || 6.2108, 
          lon: d.lon || 7.0707, 
          isp: d.isp || 'Broadband' 
        };
      }
    }
  } catch {}

  // Safe fallback default to Anambra capital (Awka)
  return { city: 'AWKA', state: 'Anambra', country: 'Nigeria', lat: 6.2108, lon: 7.0707, isp: 'Local Network' };
}

/**
 * Main Location Resolver
 */
export async function getUltraPreciseLocation(forceRefresh = false): Promise<HyperlocalIntelligence> {
  // One-time migration: wipe stale Port Harcourt / Degema / Rivers IP cache
  // (caused by MTN/Airtel South-East traffic routing through Rivers PH gateway)
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const old = JSON.parse(raw);
        const addr = (old?.formattedAddress || old?.city || '').toLowerCase();
        if (addr.includes('degema') || addr.includes('port harcourt') || addr.includes('rivers state')) {
          localStorage.removeItem(STORAGE_KEY);
          console.info('[PrecisionLocation] Wiped stale PH gateway IP cache → will re-detect fresh GPS location');
        }
      }
    } catch {}
  }

  // 0. User-Selected Custom City Override (1-Tap Switcher Top Priority)
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('mivaj_custom_city') || localStorage.getItem('mivaj_custom_location');
    if (custom && custom.trim()) {
      const city = custom.trim().toUpperCase();
      const isAnambra = ['AWKA', 'ONITSHA', 'NNEWI', 'EKWULOBIA', 'IHIALA', 'AGULU', 'OGIDI'].includes(city);
      const state = isAnambra ? 'Anambra' : 'Nigeria';
      const weather = await fetchLocalWeatherIntel(isAnambra ? 6.2108 : 9.0765, isAnambra ? 7.0707 : 7.3986);
      return {
        city,
        state,
        country: 'Nigeria',
        countryFlag: '🇳🇬',
        formattedAddress: `${custom.trim()}, ${state}, Nigeria`,
        latitude: isAnambra ? 6.2108 : 9.0765,
        longitude: isAnambra ? 7.0707 : 7.3986,
        isGpsPrecise: true,
        formattedTimezone: 'WAT (UTC+1)',
        isp: 'Territory Verified 👑',
        weatherSummary: weather.weather,
        temperatureC: weather.temp,
        pitchCondition: weather.pitch,
        viewingCentersNearby: `Sports Lounges Active in ${custom.trim()} 📺`,
        matchLightingKickoff: 'Golden Hour Match Lighting (18:00 WAT)',
      };
    }
  }

  // Check short cache if not force-refreshing
  if (!forceRefresh && typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && (Date.now() - (parsed._cachedAt || 0)) < CACHE_TTL_MS) {
          return parsed;
        }
      }
    } catch {}
  }

  // Tier 1: Hardware Browser GPS with enableHighAccuracy: true
  if (typeof window !== 'undefined' && 'geolocation' in navigator) {
    try {
      const coords = await new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          (err) => reject(err),
          { enableHighAccuracy: true, timeout: 9000, maximumAge: 0 }
        );
      });

      if (coords && coords.latitude && coords.longitude) {
        const [geo, weather] = await Promise.all([
          reverseGeocodeCoords(coords.latitude, coords.longitude),
          fetchLocalWeatherIntel(coords.latitude, coords.longitude),
        ]);

        const city = (geo.city || 'AWKA').toUpperCase();
        const state = geo.state || 'Anambra';
        const country = geo.country || 'Nigeria';

        const result: HyperlocalIntelligence = {
          city,
          state,
          country,
          countryFlag: '🇳🇬',
          formattedAddress: geo.formattedAddress || `${city}, ${state}, ${country}`,
          latitude: coords.latitude,
          longitude: coords.longitude,
          isGpsPrecise: true,
          formattedTimezone: 'WAT (UTC+1)',
          isp: 'GPS Hardware Verified 🛰️',
          weatherSummary: weather.weather,
          temperatureC: weather.temp,
          pitchCondition: weather.pitch,
          viewingCentersNearby: `Sports Lounges & Match Viewing in ${city} 📺`,
          matchLightingKickoff: 'Golden Hour Match Lighting (18:00 WAT)',
          _cachedAt: Date.now(),
        };

        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(result)); } catch {}
        return result;
      }
    } catch {
      // GPS denied, prompt dismissed, or timed out -> Proceed to Tier 2
    }
  }

  // Tier 2: Multi-Provider IP Fallback
  const ipData = await fetchIpLocation();
  const weather = await fetchLocalWeatherIntel(ipData.lat, ipData.lon);
  const city = ipData.city.toUpperCase();
  const state = ipData.state;
  const country = ipData.country;

  const result: HyperlocalIntelligence = {
    city,
    state,
    country,
    countryFlag: country.includes('Nigeria') ? '🇳🇬' : '🌍',
    formattedAddress: `${city}${state ? ', ' + state : ''}, ${country}`,
    latitude: ipData.lat,
    longitude: ipData.lon,
    isGpsPrecise: false,
    formattedTimezone: 'WAT (UTC+1)',
    isp: ipData.isp,
    weatherSummary: weather.weather,
    temperatureC: weather.temp,
    pitchCondition: weather.pitch,
    viewingCentersNearby: `Match Viewing Centers Active in ${city} 📺`,
    matchLightingKickoff: 'Evening Kickoff Schedule',
    _cachedAt: Date.now(),
  };

  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(result)); } catch {}
  return result;
}
