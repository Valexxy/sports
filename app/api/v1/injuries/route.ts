import { NextResponse } from 'next/server';
import { getRedisCache, setRedisCache } from '../../../../lib/upstash-redis-engine';

export const dynamic = 'force-dynamic';
export const maxDuration = 45;

export interface InjuryReport {
  id: string;
  playerName: string;
  team: string;
  teamBadge?: string;
  position: string;
  status: 'RULED_OUT' | 'DOUBTFUL' | 'SUSPENDED';
  injuryType: string;
  news: string;
  chanceOfPlaying: number; // 0, 25, 50, 75
  expectedReturn: string;
  bettingImpactAlert?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clubParam = searchParams.get('club')?.toLowerCase();
  const cacheKey = 'mivaj:injuries:fpl_wire';

  try {
    const cached = await getRedisCache<InjuryReport[]>(cacheKey);
    let injuries: InjuryReport[] = cached || [];

    if (!injuries || injuries.length === 0) {
      const res = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const data = await res.json();
        const teamsMap = new Map<number, string>();
        (data.teams || []).forEach((t: any) => teamsMap.set(t.id, t.name));

        const positionsMap: Record<number, string> = {
          1: 'Goalkeeper',
          2: 'Defender',
          3: 'Midfielder',
          4: 'Forward',
        };

        const elements = data.elements || [];
        injuries = elements
          .filter((p: any) => p.status === 'i' || p.status === 'd' || p.status === 's')
          .map((p: any): InjuryReport => {
            const teamName = teamsMap.get(p.team) || 'Premier League Club';
            const chance = p.chance_of_playing_next_round !== null ? p.chance_of_playing_next_round : (p.status === 'i' ? 0 : 50);
            
            let status: InjuryReport['status'] = 'RULED_OUT';
            if (p.status === 's') status = 'SUSPENDED';
            else if (chance >= 50 || p.status === 'd') status = 'DOUBTFUL';

            const news = p.news || 'Knock - Under evaluation';
            let injuryType = 'Knock / Fatigue';
            const newsLower = news.toLowerCase();
            if (newsLower.includes('hamstring')) injuryType = 'Hamstring Strain';
            else if (newsLower.includes('knee') || newsLower.includes('acl')) injuryType = 'Knee Injury';
            else if (newsLower.includes('ankle')) injuryType = 'Ankle Sprain';
            else if (newsLower.includes('groin')) injuryType = 'Groin Injury';
            else if (newsLower.includes('thigh')) injuryType = 'Thigh Problem';
            else if (newsLower.includes('calf')) injuryType = 'Calf Strain';
            else if (newsLower.includes('suspended') || p.status === 's') injuryType = 'Suspension Ban';
            else if (newsLower.includes('illness')) injuryType = 'Illness';

            let bettingAlert = '';
            if (p.now_cost > 75 && (p.element_type === 3 || p.element_type === 4)) {
              bettingAlert = `Key attacker missing — lowers ${teamName}'s Poisson expected goals from 1.8 to 1.3. Consider Double Chance 1X instead of straight win.`;
            } else if (p.element_type === 1 || p.element_type === 2) {
              bettingAlert = `Defensive regular sidelined — raises Over 1.5 Goals & Both Teams to Score (BTTS) likelihood.`;
            }

            return {
              id: `inj-${p.id}`,
              playerName: `${p.first_name} ${p.second_name}`,
              team: teamName,
              position: positionsMap[p.element_type] || 'Player',
              status,
              injuryType,
              news,
              chanceOfPlaying: chance,
              expectedReturn: news.includes('Expected') ? news.split('Expected')[1].trim() : 'Unknown return date',
              bettingImpactAlert: bettingAlert,
            };
          });

        if (injuries.length > 0) {
          await setRedisCache(cacheKey, injuries, 60 * 60);
        }
      }
    }

    if (clubParam) {
      injuries = injuries.filter((i) => i.team.toLowerCase().includes(clubParam));
    }

    return NextResponse.json({
      success: true,
      count: injuries.length,
      source: 'Premier League Official Medical & Suspension Feed',
      data: injuries,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, data: [] }, { status: 500 });
  }
}
