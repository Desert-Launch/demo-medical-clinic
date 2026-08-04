import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Section opener: eyebrow, heading, optional lead and a trailing action. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  action,
  align = "start",
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  action?: ReactNode;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center",
        className,
      )}
    >
      <div
        className={cn("max-w-2xl", align === "center" && "text-center")}
      >
        {eyebrow ? (
          <p className="eyebrow text-lapis-600">{eyebrow}</p>
        ) : null}
        <h2 className="mt-3 text-3xl sm:text-4xl">{title}</h2>
        {lead ? (
          <p className="mt-4 text-lg leading-relaxed text-stone-600">{lead}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
