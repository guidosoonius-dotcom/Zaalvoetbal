import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatTile({
  label,
  value,
  sublabel,
  accent,
}: {
  label: string;
  value: ReactNode;
  sublabel?: ReactNode;
  accent?: "good" | "critical" | "neutral";
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-raised p-4 flex flex-col gap-1 min-w-0">
      <span className="text-xs font-medium uppercase tracking-wide text-text-muted truncate">{label}</span>
      <span
        className={cn(
          "text-2xl font-bold tabular-nums",
          accent === "good" && "text-status-good",
          accent === "critical" && "text-status-critical",
          (!accent || accent === "neutral") && "text-text-primary",
        )}
      >
        {value}
      </span>
      {sublabel && <span className="text-xs text-text-secondary truncate">{sublabel}</span>}
    </div>
  );
}
