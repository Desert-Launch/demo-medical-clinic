import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind-aware class merge. Used by every component in `components/ui`. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const aedFormatter = new Intl.NumberFormat("en-AE", {
  style: "currency",
  currency: "AED",
  maximumFractionDigits: 0,
});

/** `AED 350` — consultation fees are always whole dirhams in this demo. */
export function formatAED(amount: number): string {
  return aedFormatter.format(amount);
}

const compactNumber = new Intl.NumberFormat("en-AE", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCompact(value: number): string {
  return compactNumber.format(value);
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return `${value.toFixed(fractionDigits)}%`;
}

/** Two-letter initials for avatar fallbacks. Handles single-word names. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/** Deterministic 0..(buckets-1) hash — picks placeholder art without randomness. */
export function hashToBucket(input: string, buckets: number): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % buckets;
}
