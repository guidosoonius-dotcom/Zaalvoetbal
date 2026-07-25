"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts";
import { MatchWithSeason } from "@/data";

interface HeroPoint {
  id: string;
  label: string;
  goalDiff: number;
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

function HeroTooltip({ active, payload }: { active?: boolean; payload?: { payload: HeroPoint }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="glass-strong rounded-2xl px-3 py-2 text-xs">
      <div className="font-display font-semibold text-text-primary">{p.opponent}</div>
      <div className="text-text-secondary">
        {p.scoreFor}-{p.scoreAgainst} · {RESULT_LABEL[p.result]} · {p.label}
      </div>
    </div>
  );
}

export function HeroFormChart({ matches }: { matches: MatchWithSeason[] }) {
  const data: HeroPoint[] = matches.map((m) => ({
    id: m.id,
    label: `${m.date} · ${m.seasonLabel}`,
    goalDiff: m.scoreFor - m.scoreAgainst,
    scoreFor: m.scoreFor,
    scoreAgainst: m.scoreAgainst,
    opponent: m.opponent,
    result: m.result,
  }));

  if (data.length === 0) {
    return <p className="text-sm text-text-muted py-10 text-center">Geen wedstrijden voor deze selectie.</p>;
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} barCategoryGap="18%">
          <ReferenceLine y={0} stroke="var(--baseline)" />
          <Tooltip content={<HeroTooltip />} cursor={{ fill: "var(--baseline)", opacity: 0.15 }} />
          <Bar dataKey="goalDiff" radius={[3, 3, 3, 3]} isAnimationActive={false}>
            {data.map((d) => (
              <Cell key={d.id} fill={RESULT_COLOR[d.result]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-between text-xs text-text-muted mt-1 px-1 gap-2">
        <span className="hidden sm:inline shrink-0">{data[0].label}</span>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: "var(--status-good)" }} />
            Winst
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: "var(--status-warning)" }} />
            Gelijk
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: "var(--status-critical)" }} />
            Verlies
          </span>
        </div>
        <span className="hidden sm:inline shrink-0">{data[data.length - 1].label}</span>
      </div>
    </div>
  );
}
