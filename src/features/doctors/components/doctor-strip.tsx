"use client";

import Link from "next/link";

import { GradientArt } from "@/components/shared/gradient-art";
import { Photo } from "@/components/shared/photo";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { useDoctors } from "@/features/doctors";
import { useSpecialties } from "@/features/specialties";
import { doctorPortrait } from "@/lib/images";
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
    <RevealGroup as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {doctors.slice(0, limit).map((doctor) => (
        <RevealItem as="li" key={doctor.id} className="h-full">
          <Link
            href={`/doctors/${doctor.id}`}
            className="lift-sm flex h-full items-center gap-4 rounded-xl border border-border bg-surface p-4 hover:bg-lapis-50/40"
          >
            <GradientArt
              variant={doctor.portrait}
              pattern={false}
              className="arch-sm flex size-14 shrink-0 items-center justify-center"
            >
              <span className="relative z-10 font-display text-sm font-semibold text-stone-0">
                {initials(doctor.name.replace(/^(Dr\.|Ms\.|Mr\.)\s*/, ""))}
              </span>
              <Photo src={doctorPortrait(doctor.id)} sizes="56px" />
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
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
