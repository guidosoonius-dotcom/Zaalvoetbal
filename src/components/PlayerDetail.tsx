"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MatchWithSeason, Season } from "@/data";
import { computePlayerImpact } from "@/lib/stats";
import { shortenSeasonLabel } from "@/lib/utils";
import { StatTile } from "./StatTile";

const tickStyle = { fill: "var(--text-muted)", fontSize: 12 };

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-2xl px-3 py-2 text-xs">
      <div className="font-semibold text-text-primary mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-1.5 text-text-secondary">
          <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-medium text-text-primary">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function FormTooltip({ active, payload }: { active?: boolean; payload?: { payload: { label: string; goals: number; opponent: string; result: string } }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="glass-strong rounded-2xl px-3 py-2 text-xs">
      <div className="font-display font-semibold text-text-primary">{p.opponent}</div>
      <div className="text-text-secondary">{p.label} · {p.goals} doelpunt{p.goals === 1 ? "" : "en"}</div>
    </div>
  );
}

const RESULT_COLOR: Record<string, string> = {
  W: "var(--status-good)",
  D: "var(--status-warning)",
  L: "var(--status-critical)",
};

export function PlayerDetail({ player, seasons, allMatches }: { player: string; seasons: Season[]; allMatches: MatchWithSeason[] }) {
  const perSeason = seasons
    .map((s) => {
      const stat = s.playerStats.find((p) => p.player === player);
      return {
        season: s.label,
        Goals: stat?.goals ?? 0,
        Aanwezig: stat?.aanwezig ?? 0,
        Afwezig: stat?.afwezig ?? 0,
      };
    })
    .filter((s) => s.Aanwezig + s.Afwezig > 0);

  const totalGoals = perSeason.reduce((a, s) => a + s.Goals, 0);
  const totalAanwezig = perSeason.reduce((a, s) => a + s.Aanwezig, 0);
  const totalAfwezig = perSeason.reduce((a, s) => a + s.Afwezig, 0);
  const attendancePct = totalAanwezig + totalAfwezig > 0 ? (totalAanwezig / (totalAanwezig + totalAfwezig)) * 100 : 0;
  const goalsPerMatch = totalAanwezig > 0 ? totalGoals / totalAanwezig : 0;

  const impact = computePlayerImpact(allMatches, player);
  const formMatches = allMatches.filter((m) => m.lineup?.find((l) => l.player === player)?.played);
  const formData = formMatches.map((m) => ({
    label: `${m.date} (${m.seasonLabel})`,
    opponent: m.opponent,
    goals: m.lineup!.find((l) => l.player === player)!.goals,
    result: m.result,
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile label="Totaal doelpunten" value={totalGoals} />
        <StatTile label="Doelp. per wedstrijd" value={goalsPerMatch.toFixed(2)} />
        <StatTile label="Wedstrijden gespeeld" value={totalAanwezig} />
        <StatTile label="Aanwezigheid" value={`${attendancePct.toFixed(0)}%`} />
      </div>

      <div>
        <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Doelpunten per seizoen</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={perSeason} barCategoryGap="30%">
            <CartesianGrid stroke="var(--gridline)" vertical={false} />
            <XAxis
              dataKey="season"
              tick={tickStyle}
              axisLine={{ stroke: "var(--baseline)" }}
              tickLine={false}
              interval={0}
              tickFormatter={shortenSeasonLabel}
            />
            <YAxis tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--gridline)", opacity: 0.4 }} />
            <Bar dataKey="Goals" name="Doelpunten" fill="var(--series-1)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {impact && (impact.withPlayer.played > 0 || impact.withoutPlayer.played > 0) && (
        <div>
          <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">
            Teamresultaat met/zonder {player} (2024-2025, enige seizoen met wedstrijd-lineup)
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col gap-1 rounded-2xl bg-white/40 dark:bg-white/10 p-4 flex-1 min-w-0">
              <span className="text-xs font-medium uppercase tracking-wide text-text-muted">Met {player}</span>
              <span className="font-display text-2xl font-bold text-text-primary tabular-nums">
                {impact.withPlayer.winPct.toFixed(0)}%
              </span>
              <span className="text-xs text-text-muted">
                winst · {impact.withPlayer.won}-{impact.withPlayer.drawn}-{impact.withPlayer.lost} in {impact.withPlayer.played} wedstrijden
              </span>
            </div>
            <div className="flex flex-col gap-1 rounded-2xl bg-white/40 dark:bg-white/10 p-4 flex-1 min-w-0">
              <span className="text-xs font-medium uppercase tracking-wide text-text-muted">Zonder {player}</span>
              <span className="font-display text-2xl font-bold text-text-primary tabular-nums">
                {impact.withoutPlayer.winPct.toFixed(0)}%
              </span>
              <span className="text-xs text-text-muted">
                winst · {impact.withoutPlayer.won}-{impact.withoutPlayer.drawn}-{impact.withoutPlayer.lost} in {impact.withoutPlayer.played} wedstrijden
              </span>
            </div>
          </div>
        </div>
      )}

      {formData.length > 0 && (
        <div>
          <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">
            Vorm 2024-2025 (doelpunten per gespeelde wedstrijd)
          </p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={formData} barCategoryGap="20%">
              <CartesianGrid stroke="var(--gridline)" vertical={false} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} width={24} />
              <Tooltip content={<FormTooltip />} cursor={{ fill: "var(--gridline)", opacity: 0.4 }} />
              <Bar dataKey="goals" radius={[3, 3, 0, 0]} isAnimationActive={false}>
                {formData.map((d, i) => (
                  <Cell key={i} fill={RESULT_COLOR[d.result]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
