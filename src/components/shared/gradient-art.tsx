import { cn } from "@/lib/utils";

/**
 * Placeholder art. The demo ships no photography of real people or places, so
 * portraits and department headers use tinted gradients with the khatim motif
 * laid over them. Six variants keep a grid from looking uniform.
 */
const gradients: Record<number, string> = {
  1: "bg-[linear-gradient(140deg,var(--lapis-800)_0%,var(--lapis-500)_55%,var(--lapis-300)_100%)]",
  2: "bg-[linear-gradient(140deg,var(--lapis-900)_0%,var(--lapis-600)_50%,var(--saffron-300)_130%)]",
  3: "bg-[linear-gradient(140deg,var(--lapis-700)_0%,var(--lapis-400)_60%,var(--stone-200)_120%)]",
  4: "bg-[linear-gradient(140deg,var(--lapis-950)_0%,var(--lapis-700)_45%,var(--lapis-400)_100%)]",
  5: "bg-[linear-gradient(140deg,var(--lapis-600)_0%,var(--lapis-300)_55%,var(--saffron-200)_120%)]",
  6: "bg-[linear-gradient(140deg,var(--lapis-800)_0%,var(--lapis-500)_40%,var(--stone-300)_115%)]",
};

export function GradientArt({
  variant,
  className,
  pattern = true,
  children,
}: {
  variant: number;
  className?: string;
  pattern?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      aria-hidden={children ? undefined : "true"}
      className={cn(
        "relative isolate overflow-hidden",
        gradients[variant] ?? gradients[1],
        className,
      )}
    >
      {pattern ? (
        <span
          aria-hidden="true"
          className="khatim-field absolute inset-0 opacity-[0.14]"
        />
      ) : null}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,oklch(0.214_0.062_269/0.55),transparent)]"
      />
      {children}
    </div>
  );
}
