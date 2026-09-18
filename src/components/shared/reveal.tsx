"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

import {
  revealVariants,
  staggerVariants,
  transitions,
  viewport,
  type RevealDirection,
} from "@/lib/motion";

/**
 * The entrance system. Three components, and nothing in the product animates
 * on entry except through them:
 *
 *   <Reveal>       one element arriving
 *   <RevealGroup>  a container that releases its children in sequence
 *   <RevealItem>   a child of that container
 *
 * Everything fires once, on first sight, and never replays on scroll-back —
 * re-animating content someone has already read is the tell that separates a
 * motion system from motion for its own sake.
 *
 * When the OS asks for reduced motion, all three collapse to plain wrappers
 * that render the final state immediately. There is no reduced variant of the
 * animation; there is no animation.
 */

type Common = {
  children: ReactNode;
  className?: string;
  /**
   * `"view"` waits until the element is scrolled into sight — the default, and
   * right for page content. `"mount"` fires as soon as it renders, for content
   * that appears in place (a wizard step, a swapped panel), where waiting on
   * the viewport risks leaving it invisible if it happens to render below the
   * fold.
   */
  trigger?: "view" | "mount";
};

/** Framer props for whichever trigger was asked for. */
function triggerProps(trigger: "view" | "mount") {
  return trigger === "mount"
    ? ({ initial: "hidden", animate: "visible" } as const)
    : ({ initial: "hidden", whileInView: "visible", viewport } as const);
}

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 18,
  trigger = "view",
}: Common & {
  delay?: number;
  direction?: RevealDirection;
  /** Travel distance in px. Shorter for small elements, longer for panels. */
  distance?: number;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={revealVariants(direction, distance)}
      {...triggerProps(trigger)}
      transition={{ ...transitions.reveal, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Wraps a grid or list so its children arrive in sequence rather than as one
 * block. The container never moves — only the children do — so the page's
 * layout box is stable from first paint and the reveal costs no CLS.
 */
export function RevealGroup({
  children,
  className,
  as = "div",
  step,
  delay = 0,
  trigger = "view",
}: Common & {
  as?: "div" | "ul" | "ol";
  /** Per-child delay in seconds. Defaults to the system's stagger step. */
  step?: number;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    if (as === "ul") return <ul className={className}>{children}</ul>;
    if (as === "ol") return <ol className={className}>{children}</ol>;
    return <div className={className}>{children}</div>;
  }

  const shared = {
    className,
    variants: staggerVariants(step, delay),
    ...triggerProps(trigger),
  };

  if (as === "ul") return <motion.ul {...shared}>{children}</motion.ul>;
  if (as === "ol") return <motion.ol {...shared}>{children}</motion.ol>;
  return <motion.div {...shared}>{children}</motion.div>;
}

/** A child of `RevealGroup`. Takes its timing from the parent, not its index. */
export function RevealItem({
  children,
  className,
  as = "div",
  direction = "up",
  distance = 16,
}: Common & {
  as?: "div" | "li";
  direction?: RevealDirection;
  distance?: number;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    if (as === "li") return <li className={className}>{children}</li>;
    return <div className={className}>{children}</div>;
  }

  const shared = {
    className,
    variants: revealVariants(direction, distance),
  };

  if (as === "li") return <motion.li {...shared}>{children}</motion.li>;
  return <motion.div {...shared}>{children}</motion.div>;
}
