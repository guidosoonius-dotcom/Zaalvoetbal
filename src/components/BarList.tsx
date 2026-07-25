"use client";

import { cn } from "@/lib/utils";

export interface BarListItem {
  key: string;
  label: string;
  value: number;
  valueLabel?: string;
  sublabel?: string;
}

export function BarList({
  items,
  color = "var(--series-1)",
  onSelect,
  selectedKey,
  unit,
}: {
  items: BarListItem[];
  color?: string;
  onSelect?: (key: string) => void;
  selectedKey?: string | null;
  unit?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));

  if (items.length === 0) {
    return <p className="text-sm text-text-muted py-6 text-center">Geen data voor deze selectie.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, idx) => {
        const pct = Math.max(2, (item.value / max) * 100);
        const isSelected = selectedKey === item.key;
        return (
          <li key={item.key}>
            <button
              type="button"
              onClick={() => onSelect?.(item.key)}
              className={cn(
                "w-full text-left group rounded-lg px-1 py-1 transition-colors",
                onSelect && "cursor-pointer hover:bg-black/[0.03] dark:hover:bg-white/[0.05]",
                isSelected && "bg-black/[0.04] dark:bg-white/[0.08]",
              )}
            >
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className="flex items-center gap-2 text-sm font-medium text-text-primary truncate">
                  <span className="text-text-muted tabular-nums text-xs w-4 shrink-0">{idx + 1}</span>
                  {item.label}
                </span>
                <span className="text-sm font-semibold tabular-nums text-text-primary shrink-0">
                  {item.valueLabel ?? item.value}
                  {unit && <span className="text-text-muted font-normal">{unit}</span>}
                </span>
              </div>
              <div className="h-2 rounded-full bg-gridline overflow-hidden ml-6">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
              {item.sublabel && (
                <div className="ml-6 mt-0.5 text-xs text-text-muted">{item.sublabel}</div>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
