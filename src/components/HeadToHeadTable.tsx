"use client";

import { useMemo, useState } from "react";
import { HeadToHead } from "@/lib/stats";
import { cn } from "@/lib/utils";

type SortKey = "played" | "won" | "goalDiff";
type GroupMode = "team" | "club";

export function HeadToHeadTable({ data, clubData }: { data: HeadToHead[]; clubData: HeadToHead[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("played");
  const [groupMode, setGroupMode] = useState<GroupMode>("team");

  const activeData = groupMode === "team" ? data : clubData;

  const sorted = useMemo(() => {
    return [...activeData].sort((a, b) => {
      if (sortKey === "goalDiff") {
        return b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst);
      }
      return b[sortKey] - a[sortKey];
    });
  }, [activeData, sortKey]);

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "played", label: "Meest gespeeld" },
    { key: "won", label: "Meeste winst" },
    { key: "goalDiff", label: "Doelsaldo" },
  ];

  const groupOptions: { key: GroupMode; label: string }[] = [
    { key: "team", label: "Per team" },
    { key: "club", label: "Per club" },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {sortOptions.map((o) => (
            <button
              key={o.key}
              onClick={() => setSortKey(o.key)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold border border-border transition-colors",
                sortKey === o.key
                  ? "bg-gradient-to-r from-[var(--sunset-purple)] to-[var(--sunset-pink)] text-white border-transparent"
                  : "text-text-secondary hover:text-text-primary bg-white/40 dark:bg-white/10",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
        <div className="glass inline-flex rounded-full p-1">
          {groupOptions.map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => setGroupMode(o.key)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold transition-colors",
                groupMode === o.key
                  ? "bg-gradient-to-r from-[var(--sunset-pink)] to-[var(--sunset-orange)] text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto -mx-1 max-h-80 overflow-y-auto">
        <table className="w-full text-sm border-collapse min-w-[420px]">
          <thead className="sticky top-0 backdrop-blur-md bg-[var(--glass-bg-strong)]">
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
