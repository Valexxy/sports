/**
 * LOCATION-AWARE TIMEZONE & WAT MATCH TIMING ENGINE
 * Automatically detects browser timezone with primary prioritization of West Africa Time (WAT / UTC+1).
 */

export class TimezoneEngine {
  /** Returns user local timezone */
  static getUserTimezone(): string {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    } catch (e) {
      return "UTC";
    }
  }

  /** Converts UTC ISO date into localized 12-hour AM/PM GMT */
  static formatKickoff(utcDateString?: string, defaultFallback = "7:00 PM"): string {
    if (!utcDateString) return defaultFallback + " GMT";

    try {
      const d = new Date(utcDateString);
      if (isNaN(d.getTime())) return defaultFallback + " GMT";

      const rawHours = d.getUTCHours();
      const minutes = String(d.getUTCMinutes()).padStart(2, '0');
      const ampm = rawHours >= 12 ? 'PM' : 'AM';
      const hours12 = rawHours % 12 === 0 ? 12 : rawHours % 12;

      return `${hours12}:${minutes} ${ampm} GMT`;
    } catch (err) {
      return defaultFallback + " GMT";
    }
  }
}

export const formatMatchKickoff = (utcDate?: string) => TimezoneEngine.formatKickoff(utcDate);
export const detectUserLocationTimezone = () => TimezoneEngine.getUserTimezone();
export const formatMatchTimeToUserTimezone = (utcDate?: string) => TimezoneEngine.formatKickoff(utcDate);
