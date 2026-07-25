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
          className="rounded-lg border border-border bg-surface-raised px-3 py-1.5 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-[var(--series-1)]"
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
        <div className="inline-flex rounded-lg border border-border bg-surface-raised p-0.5">
          {MATCH_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onMatchTypeChange(t)}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-semibold transition-colors",
                matchType === t
                  ? "bg-[var(--series-1)] text-white"
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
