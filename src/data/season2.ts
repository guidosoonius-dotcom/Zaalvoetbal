import { buildMatches, MatchTuple, PlayerSeasonStat, Season } from "./types";

const tuples: MatchTuple[] = [
  ["7 sep", "Woensdag", "Watergras H2", "Uit", "21:00", "", 4, 4],
  ["16 sep", "Vrijdag", "RVC '33 2", "Uit", "21:00", "", 2, 3],
  ["21 sep", "Woensdag", "Watergras 8", "Thuis", "22:00", "", 2, 7],
  ["28 sep", "Woensdag", "ASW 9", "Uit", "21:00", "", 3, 3],
  ["5 okt", "Woensdag", "SVO Buytenpark 2", "Thuis", "21:00", "", 2, 2],
  ["12 okt", "Woensdag", "FC Noord/Dubbele Schaar 2", "Thuis", "20:00", "", 2, 10],
  ["2 nov", "Woensdag", "ASW 13", "Uit", "22:00", "", 2, 24],
  ["9 nov", "Woensdag", "Watergras 10", "Thuis", "21:00", "", 3, 3],
  ["18 nov", "Vrijdag", "Mazzel Stars 5", "Uit", "20:00", "", 5, 1],
  ["23 nov", "Woensdag", "VNI 2", "Thuis", "22:00", "", 4, 6],
  ["2 dec", "Vrijdag", "Mazzel Stars 6", "Uit", "20:00", "", 4, 8],
  ["14 dec", "Woensdag", "ASW 8", "Thuis", "21:00", "", 6, 2],
  ["18 jan", "Woensdag", "RVC '33 2", "Thuis", "22:00", "", 3, 10],
  ["27 jan", "Vrijdag", "Watergras 8", "Uit", "20:00", "", 10, 3],
  ["1 feb", "Woensdag", "ASW 9", "Thuis", "21:00", "", 5, 6],
  ["6 feb", "Maandag", "SVO Buytenpark 2", "Uit", "21:00", "", 4, 3],
  ["17 feb", "Vrijdag", "FC Noord/Dubbele Schaar 2", "Uit", "20:30", "", 7, 4],
  ["8 mrt", "Woensdag", "ASW 13", "Thuis", "21:00", "", 4, 4],
  ["17 mrt", "Vrijdag", "Watergras 10", "Uit", "19:00", "", 5, 4],
  ["22 mrt", "Woensdag", "Mazzel Stars 5", "Thuis", "21:00", "", 4, 1],
  ["31 mrt", "Vrijdag", "VNI 2", "Uit", "22:00", "", 3, 3],
  ["12 apr", "Woensdag", "Mazzel Stars 6", "Thuis", "20:00", "", 3, 3],
  ["19 apr", "Woensdag", "ASW 8", "Uit", "21:00", "", 3, 3],
];

const playerStats: PlayerSeasonStat[] = [
  { player: "Alex", aanwezig: 21, afwezig: 2, goals: 13 },
  { player: "Ernst", aanwezig: 22, afwezig: 1, goals: 5 },
  { player: "Guido", aanwezig: 19, afwezig: 4, goals: 12 },
  { player: "Jasper", aanwezig: 6, afwezig: 17, goals: 2 },
  { player: "Marinus", aanwezig: 13, afwezig: 10, goals: 7 },
  { player: "Marius", aanwezig: 8, afwezig: 15, goals: 4 },
  { player: "Sander", aanwezig: 19, afwezig: 4, goals: 6 },
  { player: "Stephan", aanwezig: 7, afwezig: 16, goals: 2 },
  { player: "Steven", aanwezig: 21, afwezig: 2, goals: 14 },
  { player: "Jonathan", aanwezig: 8, afwezig: 15, goals: 7 },
  { player: "Rachid", aanwezig: 7, afwezig: 16, goals: 4 },
  { player: "Joris", aanwezig: 2, afwezig: 21, goals: 0 },
  { player: "Marijn", aanwezig: 2, afwezig: 21, goals: 2 },
  { player: "Ronald", aanwezig: 1, afwezig: 22, goals: 0 },
  { player: "Aksel", aanwezig: 1, afwezig: 22, goals: 1 },
  { player: "Luke", aanwezig: 1, afwezig: 22, goals: 0 },
];

export const season2: Season = {
  id: "seizoen-2022-2023",
  label: "2022-2023",
  matches: buildMatches("s2", tuples),
  playerStats,
};
