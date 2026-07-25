import { MatchResult } from "@/data";
import { cn } from "@/lib/utils";

const CONFIG: Record<MatchResult, { label: string; className: string }> = {
  W: { label: "Winst", className: "text-status-good bg-[var(--status-good-bg)]" },
  D: { label: "Gelijk", className: "text-[var(--status-warning)] bg-[var(--status-warning-bg)]" },
  L: { label: "Verlies", className: "text-status-critical bg-[var(--status-critical-bg)]" },
};

export function ResultBadge({ result, compact = false }: { result: MatchResult; compact?: boolean }) {
  const c = CONFIG[result];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md font-semibold shrink-0",
        compact ? "h-6 w-6 text-xs" : "px-2.5 py-1 text-xs gap-1",
        c.className,
      )}
      title={c.label}
    >
      {compact ? result : c.label}
    </span>
  );
}
