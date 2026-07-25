import { season1 } from "./season1";
import { season2 } from "./season2";
import { season3 } from "./season3";
import { season4 } from "./season4";
import { Match, Season } from "./types";

export * from "./types";

export const seasons: Season[] = [season1, season2, season3, season4];

export function getSeasons(): Season[] {
  return seasons;
}

export function getSeason(id: string): Season | undefined {
  return seasons.find((s) => s.id === id);
}

export interface MatchWithSeason extends Match {
  seasonId: string;
  seasonLabel: string;
}

export function getAllMatches(): MatchWithSeason[] {
  return seasons.flatMap((s) =>
    s.matches.map((m) => ({ ...m, seasonId: s.id, seasonLabel: s.label })),
  );
}
