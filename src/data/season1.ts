import { buildMatches, MatchTuple, PlayerSeasonStat, Season } from "./types";

const tuples: MatchTuple[] = [
  ["27 aug", "Woensdag", "Watergras H2", "Thuis", "20:00", "Sporthoeve, Bodegraven", 7, 5, "Oefenwedstrijd team Aljosha"],
  ["3 sep", "Woensdag", "ASW 8", "Thuis", "22:00", "Sporthoeve, Bodegraven", 2, 4, "Beker"],
  ["17 sep", "Woensdag", "ASW 9", "Thuis", "21:00", "Sporthoeve, Bodegraven", 3, 5],
  ["1 okt", "Woensdag", "Mazzel Stars 4", "Thuis", "21:00", "Sporthoeve, Bodegraven", 2, 5],
  ["10 okt", "Vrijdag", "Mazzel Stars 3", "Uit", "21:00", "Veur, Zoetermeer", 7, 2, "Guido en Rachid scheids"],
  ["13 okt", "Maandag", "RKDEO 6", "Uit", "21:30", "RKDEO, Nootdorp", 3, 5],
  ["17 okt", "Vrijdag", "VNI 3", "Uit", "20:00", "Veur, Zoetermeer", 5, 8],
  ["5 nov", "Woensdag", "RKDEO 7", "Thuis", "22:00", "Sporthoeve, Bodegraven", 5, 1],
  ["12 nov", "Woensdag", "ASW 11", "Uit", "21:00", "Gouwehal, Waddinxveen", 6, 2],
  ["19 nov", "Woensdag", "ASW 10", "Thuis", "20:00", "Sporthoeve, Bodegraven", 3, 1, "Jasper scheids"],
  ["3 dec", "Woensdag", "Watergras 10", "Thuis", "22:00", "Sporthoeve, Bodegraven", 0, 4, "Guido scheids"],
  ["10 dec", "Woensdag", "Stompwijk '92 6", "Thuis", "20:00", "Sporthoeve, Bodegraven", 7, 3],
  ["15 dec", "Maandag", "Watergras 9", "Uit", "19:00", "Mammoet, Gouda", 7, 4],
  ["21 jan", "Woensdag", "ASW 9", "Uit", "21:00", "Gouwehal, Waddinxveen", 2, 3],
  ["28 jan", "Woensdag", "Watergras 9", "Thuis", "20:00", "Sporthoeve, Bodegraven", 6, 3],
  ["11 feb", "Woensdag", "Mazzelstars 3", "Thuis", "21:00", "Sporthoeve, Bodegraven", 6, 1],
  ["16 feb", "Maandag", "Mazzelstars 4", "Uit", "20:00", "Veur, Zoetermeer", 3, 5],
  ["23 feb", "Woensdag", "Stompwijk '92 6", "Uit", "21:00", "Meerhorst, Stompwijk", 5, 1, "Rob extra"],
  ["12 mrt", "Donderdag", "RKDEO 7", "Uit", "21:30", "RKDEO, Nootdorp", 13, 6, "Stanley extra, Marius keeper"],
  ["23 mrt", "Maandag", "ASW 10", "Uit", "21:00", "Gouwehal, Waddinxveen", 2, 5, "Aksel extra"],
  ["1 apr", "Woensdag", "RKDEO 6", "Thuis", "20:00", "Sporthoeve, Bodegraven", 3, 5, "Marinus extra"],
  ["22 apr", "Woensdag", "ASW 11", "Thuis", "21:00", "Sporthoeve, Bodegraven", 9, 0, "Alex scheids"],
  ["6 mei", "Woensdag", "VNI 3", "Thuis", "21:00", "Sporthoeve, Bodegraven", 4, 3],
  ["8 mei", "Vrijdag", "Watergras 10", "Uit", "19:00", "Mammoet, Gouda", 4, 5, "Rob extra, Alex scheids"],
  ["27 mei", "Woensdag", "Team Rob", "Thuis", "21:00", "De Hil, Benthuizen", 7, 4, "Mees extra"],
];

const playerStats: PlayerSeasonStat[] = [
  { player: "Alex", aanwezig: 16, afwezig: 9, goals: 5 },
  { player: "Ernst", aanwezig: 24, afwezig: 1, goals: 8 },
  { player: "Guido", aanwezig: 19, afwezig: 6, goals: 8 },
  { player: "Jasper", aanwezig: 12, afwezig: 13, goals: 4 },
  { player: "Jonathan", aanwezig: 23, afwezig: 2, goals: 25 },
  { player: "Marius", aanwezig: 20, afwezig: 5, goals: 16 },
  { player: "Rachid", aanwezig: 23, afwezig: 2, goals: 24 },
  { player: "Sander", aanwezig: 23, afwezig: 2, goals: 15 },
  { player: "Steven", aanwezig: 24, afwezig: 1, goals: 8 },
];

export const season1: Season = {
  id: "seizoen-2025-2026",
  label: "2025-2026",
  matches: buildMatches("s1", tuples),
  playerStats,
};
