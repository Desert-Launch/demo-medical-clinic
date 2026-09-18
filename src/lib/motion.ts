import type { Transition, Variants } from "framer-motion";

/**
 * The product's motion vocabulary, mirroring the `--duration-*` and `--ease-*`
 * tokens in styles/tokens.css. Framer needs seconds and cubic-bezier arrays,
 * CSS needs milliseconds and a function — this file is the one place the two
 * representations are allowed to sit side by side.
 *
 * Nothing here decides *whether* to animate. That is the caller's job, via
 * `useReducedMotion()`. Keeping this module free of React also keeps it inside
 * `lib/`, which the layering rules say may not import upward.
 */

type Bezier = [number, number, number, number];

/** Entrance: decelerate into place. Exit: accelerate away. Emphasis: overshoot. */
export const ease = {
  out: [0.22, 1, 0.36, 1] as Bezier,
  in: [0.4, 0, 1, 1] as Bezier,
  inOut: [0.65, 0, 0.35, 1] as Bezier,
  emphasis: [0.34, 1.4, 0.64, 1] as Bezier,
};

/** Seconds. Four tiers, matching `--duration-*`. */
export const duration = {
  micro: 0.12,
  fast: 0.14,
  base: 0.22,
  slow: 0.38,
  slower: 0.52,
};

export const transitions = {
  /** A control changing state — a chip selecting, a chevron turning. */
  ui: { duration: duration.base, ease: ease.out } satisfies Transition,
  /** A panel or list settling. */
  panel: { duration: duration.slow, ease: ease.out } satisfies Transition,
  /** A page-level entrance. */
  reveal: { duration: duration.slower, ease: ease.out } satisfies Transition,
  /** A wizard step sliding sideways. */
  step: { duration: 0.32, ease: ease.out } satisfies Transition,
  /** The one curve with overshoot — reserved for booking confirmations. */
  emphasis: { duration: duration.slow, ease: ease.emphasis } satisfies Transition,
};

/**
 * Per-item delay in a staggered list. Deliberately small: past ~0.06s the last
 * card in a six-up grid arrives late enough to read as lag rather than rhythm.
 */
export const STAGGER_STEP = 0.055;

/**
 * Cap on how many children stagger. Beyond this the tail feels sluggish, so
 * everything past the cap shares the last delay and arrives together.
 */
export const STAGGER_CAP = 8;

/** The delay item `index` should wait, honouring the cap. */
export function staggerDelay(index: number, step = STAGGER_STEP) {
  return Math.min(index, STAGGER_CAP) * step;
}

export type RevealDirection = "up" | "down" | "start" | "end" | "none";

/** Offset in px for each direction. `start`/`end` are logical, for RTL. */
function offset(direction: RevealDirection, distance: number) {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "start":
      return { x: distance };
    case "end":
      return { x: -distance };
    default:
      return {};
  }
}

/** Variants for a single revealed element. */
export function revealVariants(
  direction: RevealDirection = "up",
  distance = 18,
): Variants {
  return {
    hidden: { opacity: 0, ...offset(direction, distance) },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: transitions.reveal,
    },
  };
}

/**
 * Variants for a container that releases its children in sequence. The
 * container itself never moves — only its children do, so a grid never shifts
 * its own layout box mid-animation.
 */
export function staggerVariants(
  step = STAGGER_STEP,
  delayChildren = 0,
): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: step, delayChildren },
    },
  };
}

/**
 * Viewport contract for scroll reveals: fire once, a little before the element
 * is fully on screen, so the motion has finished by the time it is being read.
 */
export const viewport = { once: true, amount: 0.15, margin: "0px 0px -12% 0px" };

/** Horizontal step transition for the booking wizard, direction-aware. */
export function stepVariants(distance = 28): Variants {
  return {
    enter: (forward: boolean) => ({
      opacity: 0,
      x: forward ? distance : -distance,
    }),
    center: { opacity: 1, x: 0, transition: transitions.step },
    exit: (forward: boolean) => ({
      opacity: 0,
      x: forward ? -distance : distance,
      transition: { duration: 0.2, ease: ease.in },
    }),
  };
}
