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

export interface HomeAwayStandings {
  home: Standings;
  away: Standings;
}

export function computeHomeAwayStandings(matches: MatchWithSeason[]): HomeAwayStandings {
  return {
    home: computeStandings(matches.filter((m) => m.homeAway === "Thuis")),
    away: computeStandings(matches.filter((m) => m.homeAway === "Uit")),
  };
}

/**
 * Strips a trailing team-number suffix (e.g. "ASW 13" -> "ASW", "Watergras H2" -> "Watergras")
 * so opponents from the same club but a different team number roll up together. Leaves
 * embedded numbers that aren't the trailing token alone (e.g. "Voorschoten '97 2" -> "Voorschoten '97").
 */
export function normalizeClub(opponent: string): string {
  return opponent.replace(/\s+[A-Za-z]?\d+$/, "").trim();
}

export function computeClubHeadToHead(matches: MatchWithSeason[]): HeadToHead[] {
  const remapped = matches.map((m) => ({ ...m, opponent: normalizeClub(m.opponent) }));
  return computeHeadToHead(remapped);
}

export interface RecordStats {
  biggestWin?: MatchWithSeason;
  biggestLoss?: MatchWithSeason;
  longestWinStreak: number;
  longestUnbeatenStreak: number;
  longestLossStreak: number;
  cleanSheets: number;
}

export function computeRecordStats(matches: MatchWithSeason[]): RecordStats {
  let biggestWin: MatchWithSeason | undefined;
  let biggestLoss: MatchWithSeason | undefined;
  let cleanSheets = 0;
  for (const m of matches) {
    const diff = m.scoreFor - m.scoreAgainst;
    if (m.result === "W" && (!biggestWin || diff > biggestWin.scoreFor - biggestWin.scoreAgainst)) {
      biggestWin = m;
    }
    if (m.result === "L" && (!biggestLoss || diff < biggestLoss.scoreFor - biggestLoss.scoreAgainst)) {
      biggestLoss = m;
    }
    if (m.scoreAgainst === 0) cleanSheets += 1;
  }

  const streaks = matches.reduce(
    (acc, m) => {
      const win = m.result === "W" ? acc.win + 1 : 0;
      const loss = m.result === "L" ? acc.loss + 1 : 0;
      const unbeaten = m.result !== "L" ? acc.unbeaten + 1 : 0;
      return {
        win,
        loss,
        unbeaten,
        maxWin: Math.max(acc.maxWin, win),
        maxLoss: Math.max(acc.maxLoss, loss),
        maxUnbeaten: Math.max(acc.maxUnbeaten, unbeaten),
      };
    },
    { win: 0, loss: 0, unbeaten: 0, maxWin: 0, maxLoss: 0, maxUnbeaten: 0 },
  );

  return {
    biggestWin,
    biggestLoss,
    longestWinStreak: streaks.maxWin,
    longestLossStreak: streaks.maxLoss,
    longestUnbeatenStreak: streaks.maxUnbeaten,
    cleanSheets,
  };
}

export interface AttendanceTrendPoint {
  seasonId: string;
  seasonLabel: string;
  attendancePct: number;
}

export function computeAttendanceTrend(seasons: Season[]): AttendanceTrendPoint[] {
  return seasons.map((s) => {
    const aanwezig = s.playerStats.reduce((a, p) => a + p.aanwezig, 0);
    const afwezig = s.playerStats.reduce((a, p) => a + p.afwezig, 0);
    return {
      seasonId: s.id,
      seasonLabel: s.label,
      attendancePct: aanwezig + afwezig > 0 ? (aanwezig / (aanwezig + afwezig)) * 100 : 0,
    };
  });
}

export interface MatchTypeBreakdown {
  type: MatchType;
  standings: Standings;
}

export function computeMatchTypeBreakdown(matches: MatchWithSeason[]): MatchTypeBreakdown[] {
  const types: MatchType[] = ["competitie", "beker", "oefenwedstrijd"];
  return types.map((type) => ({ type, standings: computeStandings(matches.filter((m) => m.type === type)) }));
}
