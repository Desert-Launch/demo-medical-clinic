"use client";

import { Languages, Sparkles } from "lucide-react";

import { GradientArt } from "@/components/shared/gradient-art";
import { Skeleton } from "@/components/ui/skeleton";
import { FIRST_AVAILABLE } from "@/features/booking/schema";
import { useFirstAvailable } from "@/features/booking";
import {
  formatSlotLabel,
  NextAvailable,
} from "@/features/doctors/components/next-available";
import { useDoctors } from "@/features/doctors";
import { cn, initials } from "@/lib/utils";

export function StepDoctor({
  specialtyId,
  serviceId,
  durationMinutes,
  doctorId,
  onSelect,
}: {
  specialtyId: string;
  serviceId: string;
  durationMinutes: number;
  doctorId: string;
  onSelect: (doctorId: string) => void;
}) {
  const { data: doctors, isPending } = useDoctors({ specialtyId });
  const firstAvailable = useFirstAvailable(
    specialtyId,
    durationMinutes,
    serviceId.length > 0,
  );

  return (
    <div>
      <h2 className="text-xl font-semibold">Who would you like to see?</h2>
      <p className="mt-2 text-stone-600">
        Any of them can handle this appointment. Pick a name, or take whoever is
        free soonest.
      </p>

      <button
        type="button"
        aria-pressed={doctorId === FIRST_AVAILABLE}
        onClick={() => onSelect(FIRST_AVAILABLE)}
        className={cn(
          "mt-6 flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all",
          doctorId === FIRST_AVAILABLE
            ? "border-lapis-600 bg-lapis-50 ring-1 ring-lapis-600"
            : "border-border bg-surface hover:border-lapis-300",
        )}
      >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-saffron-100 text-saffron-700">
          <Sparkles aria-hidden="true" className="size-5" />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold text-stone-900">
            First available
          </span>
          <span className="mt-0.5 block text-sm text-stone-600">
            {firstAvailable.isPending
              ? "Checking the diary…"
              : firstAvailable.data
                ? `Soonest slot in this department is ${formatSlotLabel(firstAvailable.data.slot.startsAt)}`
                : "Nothing free in the next four weeks — pick a doctor to see their diary"}
          </span>
        </span>
      </button>

      <div className="mt-4 space-y-3">
        {isPending
          ? Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-24 rounded-xl" />
            ))
          : doctors?.map((doctor) => {
              const active = doctor.id === doctorId;
              return (
                <button
                  key={doctor.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSelect(doctor.id)}
                  className={cn(
                    "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all",
                    active
                      ? "border-lapis-600 bg-lapis-50 ring-1 ring-lapis-600"
                      : "border-border bg-surface hover:border-lapis-300",
                  )}
                >
                  <GradientArt
                    variant={doctor.portrait}
                    pattern={false}
                    className="arch-sm flex size-14 shrink-0 items-center justify-center"
                  >
                    <span className="relative z-10 font-display text-sm font-semibold text-stone-0">
                      {initials(
                        doctor.name.replace(/^(Dr\.|Ms\.|Mr\.)\s*/, ""),
                      )}
                    </span>
                  </GradientArt>

                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-stone-900">
                      {doctor.name}
                    </span>
                    <span className="mt-0.5 block text-sm text-stone-600">
                      {doctor.focus}
                    </span>
                    <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="flex items-center gap-1.5 text-sm text-stone-500">
                        <Languages aria-hidden="true" className="size-3.5" />
                        {doctor.languages.join(", ")}
                      </span>
                    </span>
                    <NextAvailable
                      doctorId={doctor.id}
                      durationMinutes={durationMinutes}
                      className="mt-2"
                    />
                  </span>
                </button>
              );
            })}
      </div>
    </div>
  );
}
