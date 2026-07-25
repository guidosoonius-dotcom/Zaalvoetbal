"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MatchWithSeason } from "@/data";
import { ResultBadge } from "./ResultBadge";
import { MATCH_TYPE_LABELS } from "@/lib/stats";
import { cn } from "@/lib/utils";

type SortKey = "date" | "opponent" | "goalDiff";
type SortDir = "asc" | "desc";

const DEFAULT_DIR: Record<SortKey, SortDir> = {
  date: "desc",
  opponent: "asc",
  goalDiff: "desc",
};

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "date", label: "Datum" },
  { key: "opponent", label: "Tegenstander" },
  { key: "goalDiff", label: "Doelsaldo" },
];

export function MatchTable({ matches }: { matches: MatchWithSeason[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(DEFAULT_DIR[key]);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q ? matches.filter((m) => m.opponent.toLowerCase().includes(q)) : matches;
    const indexed = base.map((m, i) => ({ m, i }));
    indexed.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "date") cmp = a.i - b.i;
      else if (sortKey === "opponent") cmp = a.m.opponent.localeCompare(b.m.opponent);
      else cmp = a.m.scoreFor - a.m.scoreAgainst - (b.m.scoreFor - b.m.scoreAgainst);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return indexed.map((x) => x.m);
  }, [matches, query, sortKey, sortDir]);

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Zoek op tegenstander..."
        className="w-full sm:w-64 rounded-full bg-white/40 dark:bg-white/10 border border-border px-4 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-[var(--sunset-purple)]"
      />
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-sm border-collapse min-w-[640px]">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-text-muted border-b border-gridline">
              <th className="py-2 px-1 font-medium">Seizoen</th>
              {COLUMNS.map((col) => (
                <th key={col.key} className={cn("py-2 px-1 font-medium", col.key === "opponent" && "")}>
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className={cn(
                      "flex items-center gap-0.5 hover:text-text-primary transition-colors",
                      sortKey === col.key && "text-text-primary",
                    )}
                  >
                    {col.label}
                    {sortKey === col.key &&
                      (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </button>
                </th>
              ))}
              <th className="py-2 px-1 font-medium">T/U</th>
              <th className="py-2 px-1 font-medium">Type</th>
              <th className="py-2 px-1 font-medium hidden md:table-cell">Notitie</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b border-gridline/60 hover:bg-black/[0.02] dark:hover:bg-white/[0.03]">
                <td className="py-2 px-1 text-text-muted whitespace-nowrap">{m.seasonLabel}</td>
                <td className="py-2 px-1 whitespace-nowrap text-text-secondary">
                  {m.date} <span className="text-text-muted">({m.day.slice(0, 2)})</span>
                </td>
                <td className="py-2 px-1 font-medium text-text-primary">{m.opponent}</td>
                <td className="py-2 px-1">
                  <div className="flex items-center gap-2">
                    <span className="tabular-nums font-semibold">
                      {m.scoreFor}-{m.scoreAgainst}
                    </span>
                    <ResultBadge result={m.result} compact />
                  </div>
                </td>
                <td className="py-2 px-1 text-text-muted">{m.homeAway === "Thuis" ? "T" : "U"}</td>
                <td className="py-2 px-1 text-text-muted whitespace-nowrap">{MATCH_TYPE_LABELS[m.type]}</td>
                <td className="py-2 px-1 text-text-muted hidden md:table-cell max-w-[240px] truncate" title={m.note}>
                  {m.note ?? ""}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-text-muted">
                  Geen wedstrijden gevonden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
