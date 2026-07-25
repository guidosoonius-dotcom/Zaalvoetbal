import { HomeAwayStandings } from "@/lib/stats";
import { cn } from "@/lib/utils";

function Row({ label, standings }: { label: string; standings: HomeAwayStandings["home"] }) {
  const diff = standings.goalDiff;
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-white/40 dark:bg-white/10 p-4 flex-1 min-w-0">
      <span className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-2xl font-bold text-text-primary tabular-nums">
          {standings.winPct.toFixed(0)}%
        </span>
        <span className="text-xs text-text-muted">winst</span>
      </div>
      <div className="text-xs text-text-secondary tabular-nums">
        {standings.won}-{standings.drawn}-{standings.lost} · {standings.goalsFor}-{standings.goalsAgainst}{" "}
        <span
          className={cn(
            "font-semibold",
            diff > 0 && "text-status-good",
            diff < 0 && "text-status-critical",
          )}
        >
          ({diff > 0 ? `+${diff}` : diff})
        </span>
      </div>
    </div>
  );
}

export function HomeAwaySplit({ data }: { data: HomeAwayStandings }) {
  if (data.home.played === 0 && data.away.played === 0) {
    return <p className="text-sm text-text-muted py-6 text-center">Geen data voor deze selectie.</p>;
  }
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Row label="Thuis" standings={data.home} />
      <Row label="Uit" standings={data.away} />
    </div>
  );
}
