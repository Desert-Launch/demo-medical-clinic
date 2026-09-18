"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

import { transitions } from "@/lib/motion";
import { cn } from "@/lib/utils";

export const bookingSteps = [
  { id: 1, label: "Care" },
  { id: 2, label: "Doctor" },
  { id: 3, label: "Time" },
  { id: 4, label: "Details" },
  { id: 5, label: "Confirmed" },
] as const;

export function WizardStepper({
  current,
  onStepSelect,
}: {
  current: number;
  /** Only reached steps are selectable; undefined disables the shortcut. */
  onStepSelect?: (step: number) => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <nav aria-label="Booking progress">
      <ol className="flex items-center gap-1.5 sm:gap-2">
        {bookingSteps.map((step, index) => {
          const done = step.id < current;
          const active = step.id === current;
          const reachable = done && onStepSelect && current < 5;

          const content = (
            <>
              <span
                className={cn(
                  "relative flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  active && "bg-lapis-700 text-stone-0",
                  done && "bg-lapis-100 text-lapis-800",
                  !active && !done && "bg-stone-200 text-stone-500",
                )}
              >
                {done ? (
                  // The tick is the only place the overshoot curve is used
                  // outside the confirmation — a step closing should feel
                  // like something latching.
                  <motion.span
                    initial={reduceMotion ? false : { scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={transitions.emphasis}
                    className="flex items-center justify-center"
                  >
                    <Check aria-hidden="true" className="size-3.5" />
                  </motion.span>
                ) : (
                  step.id
                )}
              </span>
              <span
                className={cn(
                  "hidden text-sm font-medium transition-colors sm:inline",
                  active ? "text-stone-900" : "text-stone-500",
                )}
              >
                {step.label}
              </span>
            </>
          );

          return (
            <li key={step.id} className="flex flex-1 items-center gap-1.5 sm:gap-2">
              {reachable ? (
                <button
                  type="button"
                  onClick={() => onStepSelect(step.id)}
                  aria-label={`Back to step ${step.id}: ${step.label}`}
                  className="press flex cursor-pointer items-center gap-2 rounded-full transition-opacity hover:opacity-80"
                >
                  {content}
                </button>
              ) : (
                <span
                  className="flex items-center gap-2"
                  aria-current={active ? "step" : undefined}
                >
                  {content}
                </span>
              )}
              {index < bookingSteps.length - 1 ? (
                // The connector fills rather than switching colour, so the
                // rail reads as progress travelling along the flow.
                <span
                  aria-hidden="true"
                  className="relative h-px flex-1 overflow-hidden rounded-full bg-stone-200"
                >
                  <motion.span
                    className="absolute inset-0 origin-left rounded-full bg-lapis-300"
                    initial={false}
                    animate={{ scaleX: done ? 1 : 0 }}
                    transition={
                      reduceMotion ? { duration: 0 } : transitions.panel
                    }
                  />
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
