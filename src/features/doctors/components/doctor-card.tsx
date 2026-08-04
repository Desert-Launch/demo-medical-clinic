import Link from "next/link";
import { ArrowRight, Languages } from "lucide-react";

import { GradientArt } from "@/components/shared/gradient-art";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NextAvailable } from "@/features/doctors/components/next-available";
import { initials } from "@/lib/utils";
import type { Doctor, Specialty } from "@/types";

export function DoctorCard({
  doctor,
  specialty,
}: {
  doctor: Doctor;
  specialty: Specialty | undefined;
}) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-xs">
      <div className="flex gap-4 p-5">
        <GradientArt
          variant={doctor.portrait}
          pattern={false}
          className="arch-sm flex size-20 shrink-0 items-center justify-center"
        >
          <span className="relative z-10 font-display text-xl font-semibold text-stone-0">
            {initials(doctor.name.replace(/^(Dr\.|Ms\.|Mr\.)\s*/, ""))}
          </span>
        </GradientArt>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg">
            <Link
              href={`/doctors/${doctor.id}`}
              className="hover:text-lapis-700"
            >
              {doctor.name}
            </Link>
          </h3>
          <p className="mt-0.5 text-sm text-stone-600">{doctor.focus}</p>
          {specialty ? (
            <Badge variant="secondary" className="mt-2.5">
              {specialty.name}
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="mt-auto space-y-3 border-t border-border px-5 py-4">
        <p className="flex items-center gap-2 text-sm text-stone-600">
          <Languages aria-hidden="true" className="size-4 text-stone-400" />
          <span className="truncate">{doctor.languages.join(", ")}</span>
        </p>
        <NextAvailable
          doctorId={doctor.id}
          durationMinutes={specialty?.services[0]?.durationMinutes ?? 20}
        />
      </div>

      <div className="flex gap-2 border-t border-border p-4">
        <Button asChild className="flex-1">
          <Link href={`/book?doctor=${doctor.id}`}>Book appointment</Link>
        </Button>
        <Button asChild variant="outline" size="icon" aria-label={`Read ${doctor.name}’s profile`}>
          <Link href={`/doctors/${doctor.id}`}>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
