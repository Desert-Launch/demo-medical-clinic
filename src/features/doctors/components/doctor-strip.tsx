"use client";

import Link from "next/link";

import { GradientArt } from "@/components/shared/gradient-art";
import { Skeleton } from "@/components/ui/skeleton";
import { useDoctors } from "@/features/doctors";
import { useSpecialties } from "@/features/specialties";
import { initials } from "@/lib/utils";

/** A short row of doctors for the home page — the directory does the real work. */
export function DoctorStrip({ limit = 6 }: { limit?: number }) {
  const { data: doctors, isPending } = useDoctors();
  const { data: specialties } = useSpecialties();

  if (isPending || !doctors) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: limit }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  const specialtyById = new Map(
    (specialties ?? []).map((item) => [item.id, item.name]),
  );

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {doctors.slice(0, limit).map((doctor) => (
        <li key={doctor.id}>
          <Link
            href={`/doctors/${doctor.id}`}
            className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-lapis-300 hover:bg-lapis-50/40"
          >
            <GradientArt
              variant={doctor.portrait}
              pattern={false}
              className="arch-sm flex size-14 shrink-0 items-center justify-center"
            >
              <span className="relative z-10 font-display text-sm font-semibold text-stone-0">
                {initials(doctor.name.replace(/^(Dr\.|Ms\.|Mr\.)\s*/, ""))}
              </span>
            </GradientArt>
            <div className="min-w-0">
              <p className="truncate font-semibold text-stone-900">
                {doctor.name}
              </p>
              <p className="text-sm leading-snug text-stone-500">
                {specialtyById.get(doctor.specialtyId)} · {doctor.focus}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
