import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The one horizontal rhythm for the whole site. Every page section sits inside
 * this so gutters never drift between routes.
 */
export function PageContainer({
  children,
  className,
  width = "default",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  width?: "default" | "wide" | "narrow";
  as?: ElementType;
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        width === "default" && "max-w-[--container-max]",
        width === "wide" && "max-w-[--container-wide]",
        width === "narrow" && "max-w-3xl",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
