/**
 * Mivaj / AuraScore Stadium 2.0 - ESPN & Multi-Source Ingestion Pipeline
 * High-performance, decoupled background workers for deep entity telemetry.
 */

import { Redis } from '@upstash/redis';
import { supabase } from '../../supabase-client';

export interface ExternalPlayerPayload {
  externalId: string;
  name: string;
  shortName?: string;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  detailedPosition?: string;
  jerseyNumber?: number;
  heightCm?: number;
  weightKg?: number;
  nationality: string;
  photoUrl?: string;
  marketValueEur?: number;
  rating?: number;
  status?: 'Active' | 'Injured' | 'Suspended' | 'Doubtful' | 'On Loan';
}

export interface ExternalMatchLogPayload {
  externalPlayerId: string;
  matchId: string;
  matchDate: string;
  minutesPlayed: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  xg: number;
  xa: number;
  passesCompleted: number;
  passesAttempted: number;
  tackles: number;
  rating: number;
  resultOutcome: 'W' | 'D' | 'L';
}

export interface ExternalVenuePayload {
  externalId: string;
  clubId?: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  pitchDimensions: string;
  altitudeMeters: number;
  latitude: number;
  longitude: number;
  surfaceType: string;
  openedYear: number;
  imageUrl?: string;
}

export class ESPNAdapter {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || 'https://trusted-malamute-122804.upstash.io',
      token: process.env.UPSTASH_REDIS_REST_TOKEN || 'mock-token'
    });
  }

  /**
   * Translates external provider IDs into Mivaj Sovereign UUIDs
   */
  public async getOrMapPlayerUUID(externalId: string): Promise<string | null> {
    const cacheKey = `mivaj:idmap:player:${externalId}`;
    try {
      const cachedUUID = await this.redis.get<string>(cacheKey);
      if (cachedUUID) return cachedUUID;

      const { data } = await supabase
        .from('players')
        .select('player_id')
        .eq('external_provider_id', externalId)
        .maybeSingle();

      if (data?.player_id) {
        await this.redis.set(cacheKey, data.player_id, { ex: 86400 * 7 });
        return data.player_id;
      }
    } catch (err) {
      console.warn(`[ESPNAdapter] ID Mapping error for ${externalId}:`, err);
    }
    return null;
  }

  /**
   * Job 1: SyncRostersJob (Weekly Cron)
   * Fetches & upserts squad rosters for all clubs
   */
  public async syncRostersJob(clubId: string, players: ExternalPlayerPayload[]): Promise<{ ingested: number; errors: number }> {
    console.log(`[ESPNAdapter:SyncRostersJob] Syncing ${players.length} players for club ${clubId}...`);
    let ingested = 0;
    let errors = 0;

    for (const p of players) {
      try {
        const { data, error } = await supabase
          .from('players')
          .upsert(
            {
              club_id: clubId,
              external_provider_id: p.externalId,
              name: p.name,
              short_name: p.shortName || p.name.split(' ').pop(),
              position: p.position,
              detailed_position: p.detailedPosition,
              jersey_number: p.jerseyNumber,
              height_cm: p.heightCm,
              weight_kg: p.weightKg,
              nationality: p.nationality,
              photo_url: p.photoUrl,
              market_value_eur: p.marketValueEur,
              rating: p.rating || 7.2,
              status: p.status || 'Active'
            },
            { onConflict: 'external_provider_id' }
          )
          .select('player_id')
          .single();

        if (error) {
          errors++;
        } else if (data?.player_id) {
          ingested++;
          await this.redis.set(`mivaj:idmap:player:${p.externalId}`, data.player_id, { ex: 86400 * 7 });
        }
      } catch (e) {
        errors++;
      }
    }

    return { ingested, errors };
  }

  /**
   * Job 2: SyncPlayerFormJob (High-Frequency Post-Match Worker)
   * Ingests post-match player statistics and recomputes rolling form
   */
  public async syncPlayerFormJob(matchLogs: ExternalMatchLogPayload[]): Promise<{ logged: number; unmapped: number }> {
    console.log(`[ESPNAdapter:SyncPlayerFormJob] Ingesting ${matchLogs.length} player performance logs...`);
    let logged = 0;
    let unmapped = 0;

    for (const log of matchLogs) {
      const playerUUID = await this.getOrMapPlayerUUID(log.externalPlayerId);
      if (!playerUUID) {
        unmapped++;
        continue;
      }

      try {
        const { error } = await supabase.from('player_match_logs').insert({
          player_id: playerUUID,
          match_id: log.matchId,
          match_date: log.matchDate,
          minutes_played: log.minutesPlayed,
          goals: log.goals,
          assists: log.assists,
          yellow_cards: log.yellowCards,
          red_cards: log.redCards,
          xg: log.xg,
          xa: log.xa,
          passes_completed: log.passesCompleted,
          passes_attempted: log.passesAttempted,
          tackles: log.tackles,
          rating: log.rating,
          result_outcome: log.resultOutcome
        });

        if (!error) {
          logged++;
          await this.redis.del(`mivaj:player:form:${playerUUID}`);
        }
      } catch (err) {
        console.error('[ESPNAdapter] Failed to log match stat:', err);
      }
    }

    return { logged, unmapped };
  }

  /**
   * Job 3: SyncVenueConditionsJob (Pre-Match 2h Worker)
   * Ingests stadium atmospheric telemetry & weather conditions
   */
  public async syncVenueConditionsJob(venue: ExternalVenuePayload): Promise<{ success: boolean; stadiumId?: string }> {
    console.log(`[ESPNAdapter:SyncVenueConditionsJob] Updating venue telemetry for ${venue.name}...`);
    try {
      const { data, error } = await supabase
        .from('stadiums')
        .upsert(
          {
            club_id: venue.clubId,
            external_provider_id: venue.externalId,
            name: venue.name,
            city: venue.city,
            country: venue.country,
            capacity: venue.capacity,
            pitch_dimensions: venue.pitchDimensions,
            altitude_meters: venue.altitudeMeters,
            latitude: venue.latitude,
            longitude: venue.longitude,
            surface_type: venue.surfaceType,
            opened_year: venue.openedYear,
            image_url: venue.imageUrl
          },
          { onConflict: 'external_provider_id' }
        )
        .select('stadium_id')
        .single();

      if (error) throw error;
      return { success: true, stadiumId: data?.stadium_id };
    } catch (e) {
      console.error('[ESPNAdapter] Failed to sync stadium venue:', e);
      return { success: false };
    }
  }
}

export const espnAdapter = new ESPNAdapter();
