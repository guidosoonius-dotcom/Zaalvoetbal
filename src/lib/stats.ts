import { MatchWithSeason, MatchType, Season } from "@/data";

export interface Filters {
  seasonId: string | "all";
  matchType: MatchType | "all";
}

export const ALL_FILTERS: Filters = { seasonId: "all", matchType: "all" };

export function filterMatches(matches: MatchWithSeason[], filters: Filters): MatchWithSeason[] {
  return matches.filter((m) => {
    if (filters.seasonId !== "all" && m.seasonId !== filters.seasonId) return false;
    if (filters.matchType !== "all" && m.type !== filters.matchType) return false;
    return true;
  });
}

export interface Standings {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  winPct: number;
}

export function computeStandings(matches: MatchWithSeason[]): Standings {
  const played = matches.length;
  const won = matches.filter((m) => m.result === "W").length;
  const drawn = matches.filter((m) => m.result === "D").length;
  const lost = matches.filter((m) => m.result === "L").length;
  const goalsFor = matches.reduce((a, m) => a + m.scoreFor, 0);
  const goalsAgainst = matches.reduce((a, m) => a + m.scoreAgainst, 0);
  return {
    played,
    won,
    drawn,
    lost,
    goalsFor,
    goalsAgainst,
    goalDiff: goalsFor - goalsAgainst,
    winPct: played > 0 ? (won / played) * 100 : 0,
  };
}

export interface PlayerAggStat {
  player: string;
  aanwezig: number;
  afwezig: number;
  goals: number;
  seasons: number;
  goalsPerMatch: number;
  attendancePct: number;
}

/**
 * Player leaderboard stats are aggregated from the season-end summary rows,
 * which cover ALL matches that season (competitie + beker + oefenwedstrijd
 * combined) — the source sheets don't break attendance/goals down by match
 * type, so this aggregation is not affected by the matchType filter.
 */
export function computePlayerStats(seasons: Season[], seasonId: string | "all"): PlayerAggStat[] {
  const selected = seasonId === "all" ? seasons : seasons.filter((s) => s.id === seasonId);
  const map = new Map<string, PlayerAggStat>();
  for (const season of selected) {
    for (const stat of season.playerStats) {
      const existing = map.get(stat.player);
      if (existing) {
        existing.aanwezig += stat.aanwezig;
        existing.afwezig += stat.afwezig;
        existing.goals += stat.goals;
        existing.seasons += 1;
      } else {
        map.set(stat.player, {
          player: stat.player,
          aanwezig: stat.aanwezig,
          afwezig: stat.afwezig,
          goals: stat.goals,
          seasons: 1,
          goalsPerMatch: 0,
          attendancePct: 0,
        });
      }
    }
  }
  return Array.from(map.values()).map((p) => ({
    ...p,
    goalsPerMatch: p.aanwezig > 0 ? p.goals / p.aanwezig : 0,
    attendancePct: p.aanwezig + p.afwezig > 0 ? (p.aanwezig / (p.aanwezig + p.afwezig)) * 100 : 0,
  }));
}

export interface HeadToHead {
  opponent: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
}

export function computeHeadToHead(matches: MatchWithSeason[]): HeadToHead[] {
  const map = new Map<string, HeadToHead>();
  for (const m of matches) {
    const existing = map.get(m.opponent) ?? {
      opponent: m.opponent,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
    };
    existing.played += 1;
    if (m.result === "W") existing.won += 1;
    else if (m.result === "D") existing.drawn += 1;
    else existing.lost += 1;
    existing.goalsFor += m.scoreFor;
    existing.goalsAgainst += m.scoreAgainst;
    map.set(m.opponent, existing);
  }
  return Array.from(map.values()).sort((a, b) => b.played - a.played);
}

export interface SeasonTrendPoint {
  seasonId: string;
  seasonLabel: string;
  standings: Standings;
}

export function computeSeasonTrend(seasons: Season[], matchType: MatchType | "all"): SeasonTrendPoint[] {
  return seasons.map((s) => {
    const matches = s.matches
      .filter((m) => matchType === "all" || m.type === matchType)
      .map((m) => ({ ...m, seasonId: s.id, seasonLabel: s.label }));
    return { seasonId: s.id, seasonLabel: s.label, standings: computeStandings(matches) };
  });
}

export const MATCH_TYPE_LABELS: Record<MatchType, string> = {
  competitie: "Competitie",
  beker: "Beker",
  oefenwedstrijd: "Oefenwedstrijd",
};
