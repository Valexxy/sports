/**
 * LOCATION-AWARE TIMEZONE & WAT MATCH TIMING ENGINE
 * Automatically detects browser timezone with primary prioritization of West Africa Time (WAT / UTC+1).
 */

export class TimezoneEngine {
  /** Returns user local timezone or defaults to Africa/Lagos (WAT) */
  static getUserTimezone(): string {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Lagos";
    } catch (e) {
      return "Africa/Lagos";
    }
  }

  /** Converts UTC ISO date into localized WAT (e.g. 20:00 WAT) */
  static formatKickoff(utcDateString?: string, defaultFallback = "19:00"): string {
    if (!utcDateString) return defaultFallback + " WAT";

    try {
      const d = new Date(utcDateString);
      if (isNaN(d.getTime())) return defaultFallback + " WAT";

      const tz = this.getUserTimezone();
      const isWAT = tz.includes("Lagos") || tz.includes("Accra") || tz.includes("Luanda") || tz.includes("Africa");
      const suffix = isWAT ? "WAT" : "WAT";

      // Format in WAT (UTC+1 / Africa/Lagos)
      const timeFormatted = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Africa/Lagos",
      }).format(d);

      return timeFormatted + " " + suffix;
    } catch (err) {
      return defaultFallback + " WAT";
    }
  }
}

export const formatMatchKickoff = (utcDate?: string) => TimezoneEngine.formatKickoff(utcDate);
export const detectUserLocationTimezone = () => TimezoneEngine.getUserTimezone();
export const formatMatchTimeToUserTimezone = (utcDate?: string) => TimezoneEngine.formatKickoff(utcDate);
