import { RecordStats } from "@/lib/stats";
import { StatTile } from "./StatTile";

export function RecordStatsCard({ stats }: { stats: RecordStats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <StatTile
        label="Grootste zege"
        value={stats.biggestWin ? `${stats.biggestWin.scoreFor}-${stats.biggestWin.scoreAgainst}` : "—"}
        sublabel={stats.biggestWin ? `vs ${stats.biggestWin.opponent} (${stats.biggestWin.seasonLabel})` : undefined}
        accent="good"
      />
      <StatTile
        label="Grootste nederlaag"
        value={stats.biggestLoss ? `${stats.biggestLoss.scoreFor}-${stats.biggestLoss.scoreAgainst}` : "—"}
        sublabel={stats.biggestLoss ? `vs ${stats.biggestLoss.opponent} (${stats.biggestLoss.seasonLabel})` : undefined}
        accent="critical"
      />
      <StatTile label="Clean sheets" value={stats.cleanSheets} sublabel="wedstrijden zonder tegendoelpunt" />
      <StatTile label="Langste zegereeks" value={stats.longestWinStreak} accent="good" />
      <StatTile label="Langste ongeslagen reeks" value={stats.longestUnbeatenStreak} accent="good" />
      <StatTile label="Langste verliesreeks" value={stats.longestLossStreak} accent="critical" />
    </div>
  );
}
