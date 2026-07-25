"use client";

import { useMemo, useState } from "react";
import { MatchWithSeason } from "@/data";
import { ResultBadge } from "./ResultBadge";
import { MATCH_TYPE_LABELS } from "@/lib/stats";

export function MatchTable({ matches }: { matches: MatchWithSeason[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? matches.filter((m) => m.opponent.toLowerCase().includes(q)) : matches;
    return [...list].reverse();
  }, [matches, query]);

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Zoek op tegenstander..."
        className="w-full sm:w-64 rounded-lg border border-border bg-surface-raised px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-[var(--series-1)]"
      />
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-sm border-collapse min-w-[640px]">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-text-muted border-b border-gridline">
              <th className="py-2 px-1 font-medium">Seizoen</th>
              <th className="py-2 px-1 font-medium">Datum</th>
              <th className="py-2 px-1 font-medium">Tegenstander</th>
              <th className="py-2 px-1 font-medium">T/U</th>
              <th className="py-2 px-1 font-medium">Uitslag</th>
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
                <td className="py-2 px-1 text-text-muted">{m.homeAway === "Thuis" ? "T" : "U"}</td>
                <td className="py-2 px-1">
                  <div className="flex items-center gap-2">
                    <span className="tabular-nums font-semibold">
                      {m.scoreFor}-{m.scoreAgainst}
                    </span>
                    <ResultBadge result={m.result} compact />
                  </div>
                </td>
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
