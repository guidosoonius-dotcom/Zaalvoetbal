import { buildMatches, LineupsByRow, MatchTuple, PlayerSeasonStat, Season } from "./types";

const tuples: MatchTuple[] = [
  ["19 aug", "Maandag", "ZVV Den Haag 32", "Thuis", "20:30", "Sporthoeve, Bodegraven", 8, 3, "Oefenwedstrijd team Rob"],
  ["28 aug", "Woensdag", "Watergras H2", "Thuis", "20:30", "Limeshal, Alphen a/d Rijn", 10, 3, "Oefenwedstrijd team Aljosha"],
  ["2 sep", "Maandag", "Watergras 11", "Uit", "20:00", "Mammoet, Gouda", 9, 4, "Beker"],
  ["11 sep", "Woensdag", "SJZ 4", "Thuis", "20:00", "Sporthoeve, Bodegraven", 1, 0],
  ["16 sep", "Maandag", "Roodenburg 9", "Uit", "22:00", "Zijl, Leiden", 1, 2],
  ["2 okt", "Woensdag", "ARC 2", "Uit", "21:15", "Arena, Alphen a/d Rijn", 0, 6],
  ["9 okt", "Woensdag", "Watergras 13", "Thuis", "22:00", "Mammoet, Gouda", 10, 3],
  ["18 okt", "Vrijdag", "SJZ 6", "Thuis", "20:00", "Klaverhal, Zoeterwoude", 1, 11],
  ["23 okt", "Woensdag", "VV Woubrugge 3", "Thuis", "20:00", "Sporthoeve, Bodegraven", 5, 5, "Sander scheids"],
  ["8 nov", "Vrijdag", "ESTO 3", "Thuis", "20:00", "Meerkoet, Reeuwijk", 2, 3, "Reinout extra"],
  ["13 nov", "Woensdag", "VV Woubrugge 2", "Uit", "20:30", "Oudendijk, Woubrugge", 4, 3],
  ["20 nov", "Woensdag", "Voorschoten '97 2", "Thuis", "22:00", "Sporthoeve, Bodegraven", 7, 2],
  ["25 nov", "Maandag", "Sporting Leiden 2", "Uit", "21:00", "Zijl, Leiden", 5, 2],
  ["8 jan", "Woensdag", "LFC 1", "Thuis", "20:00", "Sporthoeve, Bodegraven", 6, 5],
  ["13 jan", "Maandag", "SJZ 4", "Uit", "19:00", "Klaverhal, Zoeterwoude", 3, 4],
  ["24 jan", "Vrijdag", "Roodenburg 9", "Thuis", "21:00", "Meerkoet, Reeuwijk", 3, 6, "Jasper/Marius scheids, Stanley extra"],
  ["29 jan", "Woensdag", "VV Woubrugge 3", "Uit", "20:30", "Oudendijk, Woubrugge", 4, 8],
  ["5 feb", "Woensdag", "ARC 2", "Thuis", "21:00", "Sporthoeve, Bodegraven", 11, 0],
  ["14 feb", "Woensdag", "Watergras 13", "Uit", "22:00", "Mammoet, Gouda", 2, 7, "Luke (1) en Stanley (1) extra"],
  ["17 feb", "Maandag", "ZVV Den Haag 32", "Uit", "20:00", "Schilp, Rijswijk", 5, 4, "Oefenwedstrijd team Rob, Marinus extra"],
  ["7 mrt", "Vrijdag", "SJZ 6", "Thuis", "20:00", "Meerkoet, Reeuwijk", 6, 2],
  ["12 mrt", "Woensdag", "ESTO 3", "Thuis", "21:00", "Sporthoeve, Bodegraven", 1, 1],
  ["19 mrt", "Woensdag", "VV Woubrugge 2", "Thuis", "22:00", "Sporthoeve, Bodegraven", 7, 0, "Tegenstander niet op komen dagen"],
  ["26 mrt", "Woensdag", "Voorschoten '97 2", "Uit", "20:00", "Vliethorst, Voorschoten", 4, 3],
  ["2 apr", "Woensdag", "Sporting Leiden 2", "Thuis", "21:00", "Sporthoeve, Bodegraven", 3, 4],
  ["7 apr", "Maandag", "LFC 1", "Uit", "20:00", "Zijl, Leiden", 3, 3],
];

const playerStats: PlayerSeasonStat[] = [
  { player: "Alex", aanwezig: 24, afwezig: 1, goals: 13 },
  { player: "Ernst", aanwezig: 24, afwezig: 1, goals: 6 },
  { player: "Guido", aanwezig: 17, afwezig: 8, goals: 16 },
  { player: "Jasper", aanwezig: 15, afwezig: 10, goals: 6 },
  { player: "Jonathan", aanwezig: 21, afwezig: 4, goals: 24 },
  { player: "Marius", aanwezig: 16, afwezig: 9, goals: 8 },
  { player: "Rachid", aanwezig: 20, afwezig: 5, goals: 22 },
  { player: "Sander", aanwezig: 24, afwezig: 1, goals: 23 },
  { player: "Steven", aanwezig: 24, afwezig: 1, goals: 10 },
];

/**
 * Per-match lineup, transcribed from the source sheet's player grid (green
 * cell = played, optionally with a goal count; red cell = absent). Row 23
 * (the walkover, "Tegenstander niet op komen dagen") has no lineup — the
 * sheet itself left every player cell blank for that match. Every player's
 * played/absent/goals tally here was cross-checked against both the sheet's
 * own per-row goal sum ("Som" column) and its season-end per-player totals
 * (the `playerStats` above) and matches exactly.
 */
const ABSENT_ROWS: Record<string, number[]> = {
  Alex: [6],
  Ernst: [8],
  Guido: [2, 3, 10, 13, 14, 16, 17, 20],
  Jasper: [1, 5, 11, 15, 19, 20, 21, 22, 24, 25],
  Jonathan: [10, 14, 15, 16],
  Marius: [2, 7, 12, 17, 18, 19, 20, 21, 22],
  Rachid: [4, 15, 19, 20, 26],
  Sander: [9],
  Steven: [19],
};

const GOALS_BY_ROW: Record<string, Record<number, number>> = {
  Alex: { 2: 1, 3: 1, 8: 1, 10: 2, 11: 1, 16: 2, 17: 2, 18: 2, 20: 1 },
  Ernst: { 7: 1, 14: 1, 18: 1, 24: 1, 25: 1, 26: 1 },
  Guido: { 1: 3, 7: 1, 8: 1, 11: 1, 12: 3, 18: 2, 19: 3, 21: 2 },
  Jasper: { 3: 1, 7: 1, 9: 1, 14: 1, 18: 2 },
  Jonathan: { 1: 2, 2: 2, 3: 1, 6: 1, 7: 1, 8: 1, 9: 2, 11: 1, 12: 2, 17: 2, 18: 1, 19: 1, 20: 2, 21: 2, 22: 1, 24: 1, 26: 1 },
  Marius: { 4: 1, 5: 1, 8: 1, 14: 3, 15: 1, 24: 1 },
  Rachid: { 1: 2, 2: 3, 5: 1, 6: 2, 7: 2, 8: 2, 9: 2, 12: 1, 13: 1, 16: 1, 17: 3, 18: 1, 21: 1 },
  Sander: { 1: 1, 2: 3, 3: 1, 6: 2, 7: 3, 8: 4, 13: 1, 15: 1, 17: 1, 18: 1, 19: 1, 20: 1, 21: 1, 25: 1, 26: 1 },
  Steven: { 2: 1, 6: 1, 7: 1, 8: 1, 12: 1, 14: 1, 15: 2, 18: 1, 25: 1 },
};

const WALKOVER_ROW = 23;

function buildLineups(): LineupsByRow {
  const result: LineupsByRow = {};
  for (let row = 1; row <= tuples.length; row++) {
    if (row === WALKOVER_ROW) continue;
    result[row] = playerStats.map(({ player }) => {
      const played = !(ABSENT_ROWS[player] ?? []).includes(row);
      const goals = played ? (GOALS_BY_ROW[player]?.[row] ?? 0) : 0;
      return { player, played, goals };
    });
  }
  return result;
}

export const season3: Season = {
  id: "seizoen-2024-2025",
  label: "2024-2025",
  matches: buildMatches("s3", tuples, buildLineups()),
  playerStats,
};
