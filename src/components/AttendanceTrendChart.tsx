"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AttendanceTrendPoint } from "@/lib/stats";
import { shortenSeasonLabel } from "@/lib/utils";

const tickStyle = { fill: "var(--text-muted)", fontSize: 12 };

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-2xl px-3 py-2 text-xs">
      <div className="font-semibold text-text-primary mb-1">{label}</div>
      <div className="text-text-secondary">Aanwezigheid: <span className="font-medium text-text-primary">{payload[0].value.toFixed(0)}%</span></div>
    </div>
  );
}

export function AttendanceTrendChart({ data }: { data: AttendanceTrendPoint[] }) {
  const chartData = data.map((d) => ({ season: d.seasonLabel, Aanwezigheid: Math.round(d.attendancePct * 10) / 10 }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={chartData} margin={{ left: -12, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid stroke="var(--gridline)" vertical={false} />
        <XAxis
          dataKey="season"
          tick={tickStyle}
          axisLine={{ stroke: "var(--baseline)" }}
          tickLine={false}
          interval={0}
          tickFormatter={shortenSeasonLabel}
        />
        <YAxis tick={tickStyle} axisLine={false} tickLine={false} width={40} domain={[0, 100]} unit="%" />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--baseline)", strokeWidth: 1 }} />
        <Line
          type="monotone"
          dataKey="Aanwezigheid"
          stroke="var(--series-3)"
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--series-3)" }}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
