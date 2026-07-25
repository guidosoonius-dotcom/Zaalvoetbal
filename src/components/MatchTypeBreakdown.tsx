import { MatchTypeBreakdown as MatchTypeBreakdownData, MATCH_TYPE_LABELS } from "@/lib/stats";
import { cn } from "@/lib/utils";

export function MatchTypeBreakdown({ data }: { data: MatchTypeBreakdownData[] }) {
  const shown = data.filter((d) => d.standings.played > 0);
  if (shown.length === 0) {
    return <p className="text-sm text-text-muted py-6 text-center">Geen data voor deze selectie.</p>;
  }
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {shown.map((d) => {
        const diff = d.standings.goalDiff;
        return (
          <div key={d.type} className="flex flex-col gap-2 rounded-2xl bg-white/40 dark:bg-white/10 p-4 flex-1 min-w-0">
            <span className="text-xs font-medium uppercase tracking-wide text-text-muted">{MATCH_TYPE_LABELS[d.type]}</span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-text-primary tabular-nums">
                {d.standings.winPct.toFixed(0)}%
              </span>
              <span className="text-xs text-text-muted">winst · {d.standings.played} gespeeld</span>
            </div>
            <div className="text-xs text-text-secondary tabular-nums">
              {d.standings.won}-{d.standings.drawn}-{d.standings.lost} · {d.standings.goalsFor}-{d.standings.goalsAgainst}{" "}
              <span className={cn("font-semibold", diff > 0 && "text-status-good", diff < 0 && "text-status-critical")}>
                ({diff > 0 ? `+${diff}` : diff})
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
