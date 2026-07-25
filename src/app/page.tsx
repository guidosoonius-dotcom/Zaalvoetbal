"use client";

import { useMemo, useState } from "react";
import { Trophy, Users, TrendingUp, Goal, Swords, ListChecks, Activity } from "lucide-react";
import { getAllMatches, getSeasons, MatchType } from "@/data";
import {
  computeHeadToHead,
  computePlayerStats,
  computeSeasonTrend,
  computeStandings,
  filterMatches,
} from "@/lib/stats";
import { Filters } from "@/components/Filters";
import { StatTile } from "@/components/StatTile";
import { Card } from "@/components/Card";
import { BarList } from "@/components/BarList";
import { GoalsTrendChart, ResultTrendChart } from "@/components/SeasonTrendChart";
import { HeroFormChart } from "@/components/HeroFormChart";
import { HeadToHeadTable } from "@/components/HeadToHeadTable";
import { MatchTable } from "@/components/MatchTable";
import { PlayerDetail } from "@/components/PlayerDetail";

const seasons = getSeasons();
const allMatches = getAllMatches();

export default function Home() {
  const [seasonId, setSeasonId] = useState<string | "all">("all");
  const [matchType, setMatchType] = useState<MatchType | "all">("all");
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const filteredMatches = useMemo(
    () => filterMatches(allMatches, { seasonId, matchType }),
    [seasonId, matchType],
  );
  const standings = useMemo(() => computeStandings(filteredMatches), [filteredMatches]);
  const playerStats = useMemo(() => computePlayerStats(seasons, seasonId), [seasonId]);
  const headToHead = useMemo(() => computeHeadToHead(filteredMatches), [filteredMatches]);
  const seasonTrend = useMemo(() => computeSeasonTrend(seasons, matchType), [matchType]);

  const topscorers = useMemo(
    () =>
      [...playerStats]
        .filter((p) => p.goals > 0)
        .sort((a, b) => b.goals - a.goals)
        .slice(0, 10)
        .map((p) => ({
          key: p.player,
          label: p.player,
          value: p.goals,
          sublabel: `${p.goalsPerMatch.toFixed(2)} per wedstrijd · ${p.aanwezig} gespeeld`,
        })),
    [playerStats],
  );

  const attendanceLeaders = useMemo(
    () =>
      [...playerStats]
        .filter((p) => p.aanwezig + p.afwezig > 0)
        .sort((a, b) => b.aanwezig - a.aanwezig)
        .slice(0, 10)
        .map((p) => ({
          key: p.player,
          label: p.player,
          value: p.aanwezig,
          valueLabel: `${p.attendancePct.toFixed(0)}%`,
          sublabel: `${p.aanwezig} aanwezig · ${p.afwezig} afwezig`,
        })),
    [playerStats],
  );

  return (
    <div className="min-h-full flex flex-col">
      <header
        className="sticky top-0 z-10 border-b"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(var(--glass-blur)) saturate(160%)",
          WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(160%)",
          borderColor: "var(--glass-border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
                Alphia{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--sunset-pink)] via-[var(--sunset-orange)] to-[var(--sunset-purple)]">
                  Dashboard
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-text-muted">
                Statistieken van {seasons.length} seizoenen zaalvoetbal
              </p>
            </div>
          </div>
          <Filters
            seasons={seasons}
            seasonId={seasonId}
            matchType={matchType}
            onSeasonChange={setSeasonId}
            onMatchTypeChange={setMatchType}
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6 w-full">
        {selectedPlayer && (
          <Card
            icon={<Users className="h-4 w-4" />}
            title={selectedPlayer}
            action={
              <button
                onClick={() => setSelectedPlayer(null)}
                className="text-xs font-medium text-text-muted hover:text-text-primary rounded-full px-3 py-1.5 hover:bg-white/40 dark:hover:bg-white/10"
              >
                Sluiten
              </button>
            }
          >
            <PlayerDetail player={selectedPlayer} seasons={seasons} />
          </Card>
        )}

        <Card icon={<Activity className="h-4 w-4" />} title="Wedstrijdvorm" description="Doelsaldo per wedstrijd, chronologisch">
          <HeroFormChart matches={filteredMatches} />
        </Card>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatTile label="Wedstrijden" value={standings.played} />
          <StatTile label="Winst" value={standings.won} accent="good" />
          <StatTile label="Gelijk" value={standings.drawn} />
          <StatTile label="Verlies" value={standings.lost} accent="critical" />
          <StatTile
            label="Doelsaldo"
            value={standings.goalDiff > 0 ? `+${standings.goalDiff}` : standings.goalDiff}
            sublabel={`${standings.goalsFor} voor · ${standings.goalsAgainst} tegen`}
            accent={standings.goalDiff > 0 ? "good" : standings.goalDiff < 0 ? "critical" : "neutral"}
          />
          <StatTile label="Winstpercentage" value={`${standings.winPct.toFixed(0)}%`} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card
            icon={<Trophy className="h-4 w-4" />}
            title="Topscorers"
            description="Meeste doelpunten (alle wedstrijdtypes, klik voor details)"
          >
            <BarList
              items={topscorers}
              gradientFrom="var(--sunset-pink)"
              gradientTo="var(--sunset-orange)"
              onSelect={setSelectedPlayer}
              selectedKey={selectedPlayer}
            />
          </Card>
          <Card
            icon={<Users className="h-4 w-4" />}
            title="Aanwezigheid"
            description="Meest aanwezige spelers (alle wedstrijdtypes)"
          >
            <BarList
              items={attendanceLeaders}
              gradientFrom="var(--sunset-purple)"
              gradientTo="var(--sunset-mint)"
              onSelect={setSelectedPlayer}
              selectedKey={selectedPlayer}
            />
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card icon={<TrendingUp className="h-4 w-4" />} title="Resultaten per seizoen" description="Winst / gelijk / verlies">
            <ResultTrendChart data={seasonTrend} />
          </Card>
          <Card icon={<Goal className="h-4 w-4" />} title="Doelpunten per seizoen" description="Voor vs. tegen">
            <GoalsTrendChart data={seasonTrend} />
          </Card>
        </div>

        <Card icon={<Swords className="h-4 w-4" />} title="Tegenstanders" description="Head-to-head record per tegenstander (huidige selectie)">
          <HeadToHeadTable data={headToHead} />
        </Card>

        <Card
          icon={<ListChecks className="h-4 w-4" />}
          title="Wedstrijden"
          description={`${filteredMatches.length} wedstrijden in huidige selectie`}
        >
          <MatchTable matches={filteredMatches} />
        </Card>
      </main>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-xs text-text-muted w-full">
        Data getranscribeerd uit historische team-spreadsheets van Alphia. Kleine afwijkingen t.o.v. het origineel zijn mogelijk.
      </footer>
    </div>
  );
}
