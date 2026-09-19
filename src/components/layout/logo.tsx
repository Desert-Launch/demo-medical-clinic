import Link from "next/link";

import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/**
 * The mark is an eight-point khatim star — the tile motif that runs through the
 * site — with the bilingual wordmark beside it.
 */
export function KhatimMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cn("size-9", className)}
    >
      <path
        d="M32 3 41.4 12.4h13.3v13.3L64 35.1 54.6 44.5v13.3H41.4L32 67.2l-9.4-9.4H9.3V44.5L0 35.1l9.3-9.4V12.4h13.3z"
        transform="translate(0 -2) scale(0.94) translate(2 2)"
        className="fill-current"
      />
      <path
        d="M32 19.5 44.5 32 32 44.5 19.5 32z"
        className="fill-stone-0"
        opacity="0.92"
      />
      <path
        d="M32 26.5 37.5 32 32 37.5 26.5 32z"
        className="fill-current"
      />
    </svg>
  );
}

export function Logo({
  className,
  tone = "brand",
  showArabic = true,
}: {
  className?: string;
  tone?: "brand" | "inverse";
  showArabic?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-3 rounded-md",
        tone === "inverse" ? "text-stone-0" : "text-lapis-700",
        className,
      )}
    >
      <KhatimMark className="size-9 shrink-0 transition-transform duration-[--duration-base] ease-[--ease-out] group-hover:rotate-45" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-semibold tracking-[-0.015em]",
            tone === "inverse" ? "text-stone-0" : "text-stone-900",
          )}
        >
          Demo
          <span
            className={cn(
              "ml-1.5 font-medium",
              tone === "inverse" ? "text-lapis-200" : "text-lapis-600",
            )}
          >
            Medical Clinic
          </span>
        </span>
        {showArabic ? (
          <span
            dir="rtl"
            lang="ar"
            className={cn(
              "mt-1 font-arabic text-[0.6875rem] leading-none",
              tone === "inverse" ? "text-lapis-200/80" : "text-stone-500",
            )}
          >
            {site.nameArabic}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
