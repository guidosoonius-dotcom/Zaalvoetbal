import { buildMatches, MatchTuple, PlayerSeasonStat, Season } from "./types";

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

export const season3: Season = {
  id: "seizoen-2024-2025",
  label: "2024-2025",
  matches: buildMatches("s3", tuples),
  playerStats,
};
