"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SeasonTrendPoint } from "@/lib/stats";

const tickStyle = { fill: "var(--text-muted)", fontSize: 12 };

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface-raised px-3 py-2 shadow-md text-xs">
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

export function ResultTrendChart({ data }: { data: SeasonTrendPoint[] }) {
  const chartData = data.map((d) => ({
    season: d.seasonLabel,
    Winst: d.standings.won,
    Gelijk: d.standings.drawn,
    Verlies: d.standings.lost,
  }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} barCategoryGap="24%">
        <CartesianGrid stroke="var(--gridline)" vertical={false} />
        <XAxis dataKey="season" tick={tickStyle} axisLine={{ stroke: "var(--baseline)" }} tickLine={false} />
        <YAxis tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--gridline)", opacity: 0.4 }} />
        <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }} />
        <Bar dataKey="Winst" stackId="r" fill="var(--status-good)" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Gelijk" stackId="r" fill="var(--status-warning)" />
        <Bar dataKey="Verlies" stackId="r" fill="var(--status-critical)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function GoalsTrendChart({ data }: { data: SeasonTrendPoint[] }) {
  const chartData = data.map((d) => ({
    season: d.seasonLabel,
    "Voor": d.standings.goalsFor,
    "Tegen": d.standings.goalsAgainst,
  }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} barCategoryGap="24%" barGap={4}>
        <CartesianGrid stroke="var(--gridline)" vertical={false} />
        <XAxis dataKey="season" tick={tickStyle} axisLine={{ stroke: "var(--baseline)" }} tickLine={false} />
        <YAxis tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--gridline)", opacity: 0.4 }} />
        <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }} />
        <Bar dataKey="Voor" fill="var(--series-1)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Tegen" fill="var(--series-8)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
