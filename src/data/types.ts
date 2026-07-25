export type MatchType = "competitie" | "beker" | "oefenwedstrijd";
export type MatchResult = "W" | "D" | "L";
export type HomeAway = "Thuis" | "Uit";

export interface LineupEntry {
  player: string;
  played: boolean;
  goals: number;
}

export interface Match {
  id: string;
  date: string;
  day: string;
  opponent: string;
  homeAway: HomeAway;
  time: string;
  venue: string;
  scoreFor: number;
  scoreAgainst: number;
  result: MatchResult;
  type: MatchType;
  note?: string;
  /**
   * Per-match player lineup (who played, who was absent, individual goals),
   * transcribed from the source sheet's player grid. Only populated for
   * seasons where this per-match detail was transcribed (currently only
   * 2024-2025) — undefined for the rest, which only have season-end totals.
   */
  lineup?: LineupEntry[];
}

export interface PlayerSeasonStat {
  player: string;
  aanwezig: number;
  afwezig: number;
  goals: number;
}

export interface Season {
  id: string;
  label: string;
  matches: Match[];
  playerStats: PlayerSeasonStat[];
}

/** Raw tuple used to author match data concisely:
 * [date, day, opponent, homeAway, time, venue, scoreFor, scoreAgainst, note?]
 */
export type MatchTuple = [
  string,
  string,
  string,
  HomeAway,
  string,
  string,
  number,
  number,
  string?,
];

function detectType(note?: string): MatchType {
  if (!note) return "competitie";
  const n = note.toLowerCase();
  if (n.includes("oefenwedstrijd")) return "oefenwedstrijd";
  if (n.includes("beker")) return "beker";
  return "competitie";
}

/** Per-match lineups keyed by 1-based row index (matching tuple order). */
export type LineupsByRow = Record<number, LineupEntry[]>;

export function buildMatches(seasonId: string, tuples: MatchTuple[], lineups?: LineupsByRow): Match[] {
  return tuples.map((t, i) => {
    const [date, day, opponent, homeAway, time, venue, scoreFor, scoreAgainst, note] = t;
    const result: MatchResult =
      scoreFor > scoreAgainst ? "W" : scoreFor < scoreAgainst ? "L" : "D";
    return {
      id: `${seasonId}-m${i + 1}`,
      date,
      day,
      opponent,
      homeAway,
      time,
      venue,
      scoreFor,
      scoreAgainst,
      result,
      type: detectType(note),
      note,
      lineup: lineups?.[i + 1],
    };
  });
}
