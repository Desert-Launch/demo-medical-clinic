import { MapPin } from "lucide-react";

import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * A drawn placeholder rather than an embedded map — the demo makes no external
 * requests and shows no real location.
 */
export function StaticMap({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-stone-100",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 size-full"
        viewBox="0 0 400 260"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="400" height="260" className="fill-stone-100" />
        <g className="stroke-stone-300" strokeWidth="1.5" fill="none">
          <path d="M-10 70 H410" />
          <path d="M-10 160 H410" />
          <path d="M90 -10 V270" />
          <path d="M250 -10 V270" />
          <path d="M330 -10 V270" />
        </g>
        <g className="stroke-stone-200" strokeWidth="8" fill="none">
          <path d="M-10 115 H410" />
          <path d="M170 -10 V270" />
        </g>
        <rect
          x="176"
          y="76"
          width="60"
          height="34"
          rx="4"
          className="fill-lapis-100 stroke-lapis-300"
        />
        <rect
          x="20"
          y="180"
          width="54"
          height="40"
          rx="4"
          className="fill-stone-200"
        />
        <rect
          x="280"
          y="30"
          width="70"
          height="30"
          rx="4"
          className="fill-stone-200"
        />
      </svg>

      <div className="relative flex h-full flex-col justify-end p-5">
        <p className="inline-flex w-fit items-center gap-2 rounded-full bg-lapis-950 px-3.5 py-1.5 text-xs font-medium text-stone-0">
          <MapPin aria-hidden="true" className="size-3.5" />
          {site.address.line1}
        </p>
        <p className="mt-2 max-w-xs text-sm text-stone-600">
          {site.address.line2}, {site.address.city}. Parking is under the tower,
          levels B1 and B2, free for the first two hours.
        </p>
      </div>
    </div>
  );
}
