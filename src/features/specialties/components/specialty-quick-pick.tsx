"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { specialtyIcon } from "@/features/specialties/components/specialty-icon";
import { useSpecialties } from "@/features/specialties";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * The department navigator, compact. Patients arrive knowing a symptom, not a
 * department, so the fastest route into the booking flow is a named tile.
 */
export function SpecialtyQuickPick() {
  const { data: specialties, isPending } = useSpecialties();

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-lg">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-display text-sm font-semibold text-stone-900">
          Where do you need to be seen?
        </p>
        <Link
          href="/specialties"
          className="text-xs font-medium text-lapis-700 underline-offset-4 hover:underline"
        >
          All departments
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {isPending
          ? Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-[3.25rem] rounded-md" />
            ))
          : specialties?.map((specialty) => {
              const Icon = specialtyIcon(specialty.icon);
              return (
                <Link
                  key={specialty.id}
                  href={`/book?specialty=${specialty.slug}`}
                  className="group flex items-center gap-2.5 rounded-md border border-border bg-stone-25 px-3 py-3 text-sm font-medium text-stone-800 transition-colors hover:border-lapis-300 hover:bg-lapis-50"
                >
                  <Icon
                    aria-hidden="true"
                    className="size-4 shrink-0 text-lapis-600"
                  />
                  <span className="truncate">{specialty.name}</span>
                </Link>
              );
            })}
      </div>

      <Link
        href="/book"
        className="mt-4 flex items-center justify-between rounded-md bg-lapis-950 px-4 py-3 text-sm font-semibold text-stone-0 transition-colors hover:bg-lapis-900"
      >
        Not sure? Start the booking guide
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );
}
