import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  title,
  description,
  icon,
  action,
  children,
  className,
}: {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("glass rounded-[28px] p-4 sm:p-6 flex flex-col gap-4 min-w-0", className)}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            {icon && (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/50 dark:bg-white/10 text-text-primary">
                {icon}
              </span>
            )}
            <div>
              {title && <h2 className="font-display text-base font-semibold text-text-primary">{title}</h2>}
              {description && <p className="text-xs text-text-muted mt-0.5">{description}</p>}
            </div>
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
