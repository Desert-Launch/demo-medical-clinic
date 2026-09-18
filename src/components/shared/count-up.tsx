"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

import { ease } from "@/lib/motion";

/**
 * A figure that counts up the first time it is scrolled into view.
 *
 * It takes the already-formatted string a designer wrote — "48,000+", "4.8/5",
 * "2.1%" — and animates only the numeric part of it, keeping whatever prefix
 * and suffix came with it. That way the component never owns the formatting
 * decision, and a stat can be changed in one place without touching this file.
 *
 * The accessible name is always the final value: a screen reader announces
 * "48,000+", not a stream of intermediate numbers.
 */

type Parsed = {
  prefix: string;
  target: number;
  suffix: string;
  decimals: number;
  grouped: boolean;
};

function parse(value: string): Parsed | null {
  const match = /^(\D*?)([\d,]+(?:\.\d+)?)([\s\S]*)$/.exec(value);
  if (!match) return null;

  const [, prefix, digits, suffix] = match;
  const target = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(target)) return null;

  return {
    prefix,
    target,
    suffix,
    decimals: digits.includes(".") ? digits.split(".")[1].length : 0,
    grouped: digits.includes(","),
  };
}

function format(value: number, { decimals, grouped }: Parsed) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouped,
  });
}

/** The `--ease-out` curve, evaluated for the count so it lands rather than stops. */
function easeOut(t: number) {
  // Cubic-bezier(0.22, 1, 0.36, 1) is close enough to 1 - (1 - t)^3 for a
  // number rolling over that solving the real curve would be wasted work.
  return 1 - Math.pow(1 - t, 3);
}

export function CountUp({
  value,
  durationMs = 900,
  className,
}: {
  value: string;
  durationMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const parsed = parse(value);

  const [display, setDisplay] = useState(() =>
    parsed ? `${parsed.prefix}${format(0, parsed)}${parsed.suffix}` : value,
  );

  useEffect(() => {
    if (!parsed || reduceMotion || !inView) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const current = parsed.target * easeOut(progress);
      setDisplay(
        `${parsed.prefix}${format(
          progress === 1 ? parsed.target : current,
          parsed,
        )}${parsed.suffix}`,
      );
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // `parsed` is derived from `value`; depending on the object identity would
    // restart the count on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationMs, inView, reduceMotion, value]);

  if (!parsed || reduceMotion) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {/* The rolling figure is decoration; the final value is the content. A
          bare `aria-label` on a <span> is unreliable, so the real number is in
          the accessibility tree as text and only visually hidden. */}
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

/** Re-exported so callers can share the system curve if they animate alongside. */
export const countUpEase = ease.out;
