"use client";

import { Season, MatchType } from "@/data";
import { MATCH_TYPE_LABELS } from "@/lib/stats";
import { cn } from "@/lib/utils";

const MATCH_TYPES: (MatchType | "all")[] = ["all", "competitie", "beker", "oefenwedstrijd"];

export function Filters({
  seasons,
  seasonId,
  matchType,
  onSeasonChange,
  onMatchTypeChange,
}: {
  seasons: Season[];
  seasonId: string | "all";
  matchType: MatchType | "all";
  onSeasonChange: (id: string | "all") => void;
  onMatchTypeChange: (type: MatchType | "all") => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <div className="flex items-center gap-2">
        <label htmlFor="season-select" className="text-xs font-medium text-text-muted uppercase tracking-wide">
          Seizoen
        </label>
        <select
          id="season-select"
          value={seasonId}
          onChange={(e) => onSeasonChange(e.target.value)}
          className="glass rounded-full px-4 py-1.5 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-[var(--sunset-purple)]"
        >
          <option value="all">Alle seizoenen</option>
          {seasons.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wide">Wedstrijdtype</span>
        <div className="glass inline-flex rounded-full p-1">
          {MATCH_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onMatchTypeChange(t)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors",
                matchType === t
                  ? "bg-gradient-to-r from-[var(--sunset-pink)] to-[var(--sunset-orange)] text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              {t === "all" ? "Alles" : MATCH_TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
