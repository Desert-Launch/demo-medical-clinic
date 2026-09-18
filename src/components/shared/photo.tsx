"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

/**
 * A remote placeholder photograph laid over `GradientArt`.
 *
 * The gradient (and whatever initials sit inside it) stays mounted underneath,
 * so this component only ever adds. The photo fades in once decoded and removes
 * itself on error — a blocked host, an offline laptop or a slow network during
 * a walkthrough degrades to the brand art rather than a broken image icon.
 *
 * Always rendered inside a positioned, clipped parent; `GradientArt` is already
 * `relative isolate overflow-hidden`, so the arch mask crops the photo too.
 */
export function Photo({
  src,
  sizes,
  priority = false,
  className,
}: {
  /** `null` renders nothing — the caller's fallback art shows through. */
  src: string | null;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || failed) return null;

  return (
    <Image
      // Decorative: every use site names the doctor or department in adjacent
      // text, so an alt here would only duplicate it for a screen reader.
      alt=""
      aria-hidden="true"
      src={src}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={false}
      onError={() => setFailed(true)}
      onLoad={() => setLoaded(true)}
      className={cn(
        "absolute inset-0 z-20 object-cover transition-opacity duration-500 motion-reduce:transition-none",
        loaded ? "opacity-100" : "opacity-0",
        className,
      )}
    />
  );
}
