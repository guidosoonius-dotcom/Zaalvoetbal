export type MatchType = "competitie" | "beker" | "oefenwedstrijd";
export type MatchResult = "W" | "D" | "L";
export type HomeAway = "Thuis" | "Uit";

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

export function buildMatches(seasonId: string, tuples: MatchTuple[]): Match[] {
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
    };
  });
}
