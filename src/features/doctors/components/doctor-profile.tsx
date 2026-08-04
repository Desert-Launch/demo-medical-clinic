"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, CalendarDays, Languages } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { GradientArt } from "@/components/shared/gradient-art";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { NextAvailable } from "@/features/doctors/components/next-available";
import { useDoctor } from "@/features/doctors";
import { useSpecialties } from "@/features/specialties";
import { weekdayLabels } from "@/lib/scheduling";
import { formatAED, initials } from "@/lib/utils";

export function DoctorProfile({ doctorId }: { doctorId: string }) {
  const { data: doctor, isPending, isError } = useDoctor(doctorId);
  const { data: specialties } = useSpecialties();

  if (isPending) {
    return (
      <PageContainer className="py-16">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="mt-6 h-32 w-full max-w-2xl" />
      </PageContainer>
    );
  }

  if (isError || !doctor) {
    notFound();
  }

  const specialty = specialties?.find((item) => item.id === doctor.specialtyId);
  const consultation = specialty?.services[0];

  return (
    <PageContainer className="py-12 sm:py-16">
      <Link
        href="/doctors"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition-colors hover:text-lapis-700"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        All doctors
      </Link>

      <Reveal className="mt-8 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <GradientArt
            variant={doctor.portrait}
            className="arch flex h-80 w-full items-center justify-center"
          >
            <span className="relative z-10 font-display text-6xl font-semibold text-stone-0/90">
              {initials(doctor.name.replace(/^(Dr\.|Ms\.|Mr\.)\s*/, ""))}
            </span>
          </GradientArt>

          <div className="mt-6 space-y-4 rounded-xl border border-border bg-surface p-5">
            <NextAvailable
              doctorId={doctor.id}
              durationMinutes={consultation?.durationMinutes ?? 20}
            />
            <p className="flex items-center gap-2 text-sm text-stone-600">
              <Languages
                aria-hidden="true"
                className="size-4 shrink-0 text-stone-400"
              />
              {doctor.languages.join(", ")}
            </p>
            <p className="flex items-center gap-2 text-sm text-stone-600">
              <BadgeCheck
                aria-hidden="true"
                className="size-4 shrink-0 text-stone-400"
              />
              {doctor.yearsExperience} years in practice
            </p>
            <Button asChild size="lg" className="w-full">
              <Link href={`/book?doctor=${doctor.id}`}>Book appointment</Link>
            </Button>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            {specialty ? (
              <Badge variant="secondary">
                <Link href={`/specialties/${specialty.slug}`}>
                  {specialty.name}
                </Link>
              </Badge>
            ) : null}
            <Badge variant="outline">{doctor.title}</Badge>
          </div>

          <h1 className="mt-5 text-4xl sm:text-5xl">{doctor.name}</h1>
          <p
            dir="rtl"
            lang="ar"
            className="mt-3 font-arabic text-base text-stone-500"
          >
            {doctor.nameArabic}
          </p>
          <p className="mt-4 text-lg text-lapis-700">{doctor.focus}</p>

          <p className="mt-7 text-lg leading-relaxed text-stone-700">
            {doctor.bio}
          </p>

          <dl className="mt-10 grid gap-6 border-t border-border pt-8 sm:grid-cols-2">
            <div>
              <dt className="eyebrow text-stone-500">Qualifications</dt>
              <dd className="mt-2 text-stone-800">{doctor.credentials}</dd>
            </div>
            <div>
              <dt className="eyebrow text-stone-500">Consultation fee</dt>
              <dd data-numeric className="mt-2 text-stone-800">
                {formatAED(doctor.consultationFeeAED)}
              </dd>
            </div>
          </dl>

          <div className="mt-10 border-t border-border pt-8">
            <h2 className="flex items-center gap-2 text-xl">
              <CalendarDays aria-hidden="true" className="size-5 text-lapis-600" />
              Clinic days
            </h2>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {[...doctor.shifts]
                .sort((a, b) => a.day - b.day)
                .map((shift) => (
                  <li
                    key={shift.day}
                    className="flex items-center justify-between rounded-md border border-border bg-surface px-4 py-2.5 text-sm"
                  >
                    <span className="font-medium text-stone-800">
                      {weekdayLabels[shift.day]}
                    </span>
                    <span data-numeric className="text-stone-600">
                      {formatHour(shift.startHour)} – {formatHour(shift.endHour)}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </PageContainer>
  );
}

function formatHour(hour: number): string {
  const suffix = hour >= 12 ? "pm" : "am";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:00 ${suffix}`;
}
