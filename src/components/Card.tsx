import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-surface-raised p-4 sm:p-5 flex flex-col gap-4 min-w-0", className)}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-sm font-semibold text-text-primary">{title}</h2>}
            {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
