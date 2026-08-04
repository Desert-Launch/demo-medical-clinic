import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "default",
  className,
}: {
  label: string;
  value: string;
  detail?: string;
  icon?: LucideIcon;
  tone?: "default" | "brand" | "warning";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-5 shadow-xs",
        tone === "brand" && "border-lapis-200 bg-lapis-50",
        tone === "warning" && "border-warning-100 bg-warning-50",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-stone-600">{label}</p>
        {Icon ? (
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-md",
              tone === "warning"
                ? "bg-warning-100 text-warning-700"
                : "bg-lapis-100 text-lapis-700",
            )}
          >
            <Icon aria-hidden="true" className="size-4" />
          </span>
        ) : null}
      </div>
      <p
        data-numeric
        className="mt-3 font-display text-3xl font-semibold tracking-[-0.02em] text-stone-900"
      >
        {value}
      </p>
      {detail ? (
        <p className="mt-1.5 text-sm text-stone-500">{detail}</p>
      ) : null}
    </div>
  );
}
