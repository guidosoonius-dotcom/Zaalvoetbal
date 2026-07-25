"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MatchWithSeason } from "@/data";
import { shortenSeasonLabel } from "@/lib/utils";

interface HeroPoint {
  id: string;
  index: number;
  date: string;
  seasonLabel: string;
  cumPoints: number;
  scoreFor: number;
  scoreAgainst: number;
  opponent: string;
  result: "W" | "D" | "L";
}

const RESULT_COLOR: Record<HeroPoint["result"], string> = {
  W: "var(--status-good)",
  D: "var(--status-warning)",
  L: "var(--status-critical)",
};

const RESULT_LABEL: Record<HeroPoint["result"], string> = {
  W: "Winst",
  D: "Gelijk",
  L: "Verlies",
};

const tickStyle = { fill: "var(--text-muted)", fontSize: 11 };

function HeroTooltip({ active, payload }: { active?: boolean; payload?: { payload: HeroPoint }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="glass-strong rounded-2xl px-3 py-2 text-xs">
      <div className="font-display font-semibold text-text-primary">{p.opponent}</div>
      <div className="text-text-secondary">
        {p.scoreFor}-{p.scoreAgainst} · {RESULT_LABEL[p.result]} · {p.date} ({p.seasonLabel})
      </div>
      <div className="text-text-muted mt-0.5">{p.cumPoints} punten totaal</div>
    </div>
  );
}

function ResultDot(props: { cx?: number; cy?: number; payload?: HeroPoint }) {
  const { cx, cy, payload } = props;
  if (cx == null || cy == null || !payload) return <g />;
  return <circle cx={cx} cy={cy} r={2.5} fill={RESULT_COLOR[payload.result]} stroke="none" />;
}

function SeasonTick(props: { x?: number; y?: number; payload?: { value: number }; lastIndex: number; data: HeroPoint[] }) {
  const { x, y, payload, lastIndex, data } = props;
  if (x == null || y == null || !payload) return null;
  const i = payload.value;
  const anchor = i === 0 ? "start" : i === lastIndex ? "end" : "middle";
  return (
    <text x={x} y={y + 12} textAnchor={anchor} fill="var(--text-muted)" fontSize={11}>
      {shortenSeasonLabel(data[i]?.seasonLabel ?? "")}
    </text>
  );
}

export function HeroFormChart({ matches }: { matches: MatchWithSeason[] }) {
  const data: HeroPoint[] = matches.reduce<HeroPoint[]>((acc, m, i) => {
    const prevPoints = i === 0 ? 0 : acc[i - 1].cumPoints;
    acc.push({
      id: m.id,
      index: i,
      date: m.date,
      seasonLabel: m.seasonLabel,
      cumPoints: prevPoints + (m.result === "W" ? 3 : m.result === "D" ? 1 : 0),
      scoreFor: m.scoreFor,
      scoreAgainst: m.scoreAgainst,
      opponent: m.opponent,
      result: m.result,
    });
    return acc;
  }, []);

  if (data.length === 0) {
    return <p className="text-sm text-text-muted py-10 text-center">Geen wedstrijden voor deze selectie.</p>;
  }

  const seasonTicks = data.reduce<number[]>((acc, d, i) => {
    if (i === 0 || d.seasonLabel !== data[i - 1].seasonLabel) acc.push(i);
    return acc;
  }, []);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ left: -12, right: 8, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="formGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--sunset-orange)" stopOpacity={0.5} />
            <stop offset="100%" stopColor="var(--sunset-orange)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--gridline)" vertical={false} />
        <XAxis
          dataKey="index"
          type="number"
          domain={[0, data.length - 1]}
          ticks={seasonTicks}
          tick={<SeasonTick lastIndex={data.length - 1} data={data} />}
          axisLine={{ stroke: "var(--baseline)" }}
          tickLine={false}
        />
        <YAxis tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} width={32} />
        <Tooltip content={<HeroTooltip />} cursor={{ stroke: "var(--baseline)", strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="cumPoints"
          stroke="var(--sunset-orange)"
          strokeWidth={2}
          fill="url(#formGradient)"
          dot={<ResultDot />}
          activeDot={{ r: 4 }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
