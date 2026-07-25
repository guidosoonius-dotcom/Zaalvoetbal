"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Season } from "@/data";
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

export function PlayerDetail({ player, seasons }: { player: string; seasons: Season[] }) {
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
    </div>
  );
}
