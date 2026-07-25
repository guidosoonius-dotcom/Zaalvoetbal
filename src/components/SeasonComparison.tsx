"use client";

import { useMemo, useState } from "react";
import { MatchWithSeason, Season } from "@/data";
import { computePlayerStats, computeStandings, filterMatches } from "@/lib/stats";
import { cn } from "@/lib/utils";

function SeasonColumn({ season, seasons, allMatches }: { season: Season; seasons: Season[]; allMatches: MatchWithSeason[] }) {
  const standings = useMemo(
    () => computeStandings(filterMatches(allMatches, { seasonId: season.id, matchType: "all" })),
    [allMatches, season.id],
  );
  const players = useMemo(() => computePlayerStats(seasons, season.id), [seasons, season.id]);
  const topscorers = useMemo(() => [...players].sort((a, b) => b.goals - a.goals).slice(0, 3), [players]);
  const attendanceLeader = useMemo(() => [...players].sort((a, b) => b.aanwezig - a.aanwezig)[0], [players]);

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-3 rounded-2xl bg-white/40 dark:bg-white/10 p-4">
      <span className="font-display text-lg font-semibold text-text-primary">{season.label}</span>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-text-muted text-xs block">Gespeeld</span>
          <span className="tabular-nums font-medium">{standings.played}</span>
        </div>
        <div>
          <span className="text-text-muted text-xs block">W-G-V</span>
          <span className="tabular-nums font-medium">
            {standings.won}-{standings.drawn}-{standings.lost}
          </span>
        </div>
        <div>
          <span className="text-text-muted text-xs block">Doelsaldo</span>
          <span
            className={cn(
              "tabular-nums font-medium",
              standings.goalDiff > 0 && "text-status-good",
              standings.goalDiff < 0 && "text-status-critical",
            )}
          >
            {standings.goalDiff > 0 ? `+${standings.goalDiff}` : standings.goalDiff}
          </span>
        </div>
        <div>
          <span className="text-text-muted text-xs block">Winstpercentage</span>
          <span className="tabular-nums font-medium">{standings.winPct.toFixed(0)}%</span>
        </div>
      </div>
      <div>
        <span className="text-text-muted text-xs uppercase tracking-wide">Topscorers</span>
        <ul className="mt-1 flex flex-col gap-0.5 text-sm">
          {topscorers.map((p) => (
            <li key={p.player} className="flex justify-between text-text-secondary">
              <span>{p.player}</span>
              <span className="font-medium tabular-nums text-text-primary">{p.goals}</span>
            </li>
          ))}
        </ul>
      </div>
      {attendanceLeader && (
        <div className="text-sm">
          <span className="text-text-muted text-xs uppercase tracking-wide block">Meest aanwezig</span>
          <span className="text-text-secondary">
            {attendanceLeader.player} <span className="text-text-muted">({attendanceLeader.aanwezig}x)</span>
          </span>
        </div>
      )}
    </div>
  );
}

export function SeasonComparison({ seasons, allMatches }: { seasons: Season[]; allMatches: MatchWithSeason[] }) {
  const [seasonAId, setSeasonAId] = useState(seasons[Math.max(0, seasons.length - 2)].id);
  const [seasonBId, setSeasonBId] = useState(seasons[seasons.length - 1].id);

  const seasonA = seasons.find((s) => s.id === seasonAId);
  const seasonB = seasons.find((s) => s.id === seasonBId);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={seasonAId}
          onChange={(e) => setSeasonAId(e.target.value)}
          className="glass rounded-full px-4 py-1.5 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-[var(--sunset-purple)]"
        >
          {seasons.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <span className="text-text-muted text-sm">vs.</span>
        <select
          value={seasonBId}
          onChange={(e) => setSeasonBId(e.target.value)}
          className="glass rounded-full px-4 py-1.5 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-[var(--sunset-purple)]"
        >
          {seasons.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        {seasonA && <SeasonColumn season={seasonA} seasons={seasons} allMatches={allMatches} />}
        {seasonB && <SeasonColumn season={seasonB} seasons={seasons} allMatches={allMatches} />}
      </div>
    </div>
  );
}
