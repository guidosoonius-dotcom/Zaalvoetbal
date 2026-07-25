"use client";

import { useMemo, useState } from "react";
import { HeadToHead } from "@/lib/stats";
import { cn } from "@/lib/utils";

type SortKey = "played" | "won" | "goalDiff";

export function HeadToHeadTable({ data }: { data: HeadToHead[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("played");

  const sorted = useMemo(() => {
    return [...data].sort((a, b) => {
      if (sortKey === "goalDiff") {
        return b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst);
      }
      return b[sortKey] - a[sortKey];
    });
  }, [data, sortKey]);

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "played", label: "Meest gespeeld" },
    { key: "won", label: "Meeste winst" },
    { key: "goalDiff", label: "Doelsaldo" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1.5 flex-wrap">
        {sortOptions.map((o) => (
          <button
            key={o.key}
            onClick={() => setSortKey(o.key)}
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-semibold border border-border transition-colors",
              sortKey === o.key
                ? "bg-[var(--series-1)] text-white border-transparent"
                : "text-text-secondary hover:text-text-primary bg-surface-raised",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto -mx-1 max-h-80 overflow-y-auto">
        <table className="w-full text-sm border-collapse min-w-[420px]">
          <thead className="sticky top-0 bg-surface-raised">
            <tr className="text-left text-xs uppercase tracking-wide text-text-muted border-b border-gridline">
              <th className="py-2 px-1 font-medium">Tegenstander</th>
              <th className="py-2 px-1 font-medium text-right">Gesp.</th>
              <th className="py-2 px-1 font-medium text-right">W-G-V</th>
              <th className="py-2 px-1 font-medium text-right">Doelpunten</th>
              <th className="py-2 px-1 font-medium text-right">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((h) => {
              const diff = h.goalsFor - h.goalsAgainst;
              return (
                <tr key={h.opponent} className="border-b border-gridline/60 hover:bg-black/[0.02] dark:hover:bg-white/[0.03]">
                  <td className="py-2 px-1 font-medium text-text-primary">{h.opponent}</td>
                  <td className="py-2 px-1 text-right tabular-nums text-text-secondary">{h.played}</td>
                  <td className="py-2 px-1 text-right tabular-nums text-text-secondary">
                    {h.won}-{h.drawn}-{h.lost}
                  </td>
                  <td className="py-2 px-1 text-right tabular-nums text-text-secondary">
                    {h.goalsFor}-{h.goalsAgainst}
                  </td>
                  <td
                    className={cn(
                      "py-2 px-1 text-right tabular-nums font-semibold",
                      diff > 0 && "text-status-good",
                      diff < 0 && "text-status-critical",
                      diff === 0 && "text-text-muted",
                    )}
                  >
                    {diff > 0 ? `+${diff}` : diff}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
