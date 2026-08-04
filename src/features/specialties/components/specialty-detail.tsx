"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { GradientArt } from "@/components/shared/gradient-art";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DoctorCard } from "@/features/doctors/components/doctor-card";
import { useDoctors } from "@/features/doctors";
import { specialtyIcon } from "@/features/specialties/components/specialty-icon";
import { useSpecialty } from "@/features/specialties";
import { formatAED } from "@/lib/utils";

export function SpecialtyDetail({ slug }: { slug: string }) {
  const { data: specialty, isPending, isError } = useSpecialty(slug);
  const { data: doctors } = useDoctors(
    specialty ? { specialtyId: specialty.id } : {},
  );

  if (isPending) {
    return (
      <PageContainer className="py-16">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="mt-6 h-24 w-full max-w-2xl" />
        <Skeleton className="mt-10 h-64 w-full" />
      </PageContainer>
    );
  }

  if (isError || !specialty) {
    notFound();
  }

  const Icon = specialtyIcon(specialty.icon);

  return (
    <>
      <div className="border-b border-border bg-stone-0">
        <PageContainer className="grid gap-12 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-20">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-full bg-lapis-50 text-lapis-700">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <span
                dir="rtl"
                lang="ar"
                className="font-arabic text-sm text-stone-500"
              >
                {specialty.nameArabic}
              </span>
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl">{specialty.name}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-600">
              {specialty.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={`/book?specialty=${specialty.slug}`}>
                  Book appointment
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={`/doctors?specialty=${specialty.slug}`}>
                  See the doctors
                </Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <GradientArt
              variant={specialty.art}
              className="arch mx-auto h-80 w-full max-w-sm sm:h-96"
            />
          </Reveal>
        </PageContainer>
      </div>

      <PageContainer className="py-16">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="text-2xl">What this department treats</h2>
            <ul className="mt-6 space-y-3">
              {specialty.treats.map((item) => (
                <li key={item} className="flex gap-3 text-stone-700">
                  <Check
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0 text-success-700"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {specialty.slug === "family-medicine" ? (
              <div className="mt-8 rounded-xl border border-lapis-200 bg-lapis-50 p-5">
                <p className="text-sm font-semibold text-lapis-900">
                  The door into the rest of the clinic
                </p>
                <p className="mt-2 text-sm leading-relaxed text-stone-700">
                  If what you need turns out to belong upstairs, your GP walks
                  you across the same day — with your notes already there.
                </p>
                <Button asChild variant="outline" className="mt-4 bg-surface">
                  <Link href="/specialties">See the other departments</Link>
                </Button>
              </div>
            ) : (
              <div className="mt-8 rounded-xl border border-lapis-200 bg-lapis-50 p-5">
                <p className="text-sm font-semibold text-lapis-900">
                  Not sure this is the right department?
                </p>
                <p className="mt-2 text-sm leading-relaxed text-stone-700">
                  Book family medicine instead. They see you first and walk you
                  across to {specialty.name.toLowerCase()} the same day if that
                  is where you belong.
                </p>
                <Button asChild variant="outline" className="mt-4 bg-surface">
                  <Link href="/book?specialty=family-medicine">
                    Book family medicine
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl">Appointments and prices</h2>
            <ul className="mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
              {specialty.services.map((service) => (
                <li
                  key={service.id}
                  className="flex flex-wrap items-start justify-between gap-4 p-5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-stone-900">
                      {service.name}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-stone-600">
                      {service.summary}
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-stone-500">
                      <Clock aria-hidden="true" className="size-3.5" />
                      {service.durationMinutes} minutes
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      data-numeric
                      className="font-display text-lg font-semibold text-stone-900"
                    >
                      {formatAED(service.priceAED)}
                    </p>
                    {service.priceNote ? (
                      <p className="text-xs text-stone-500">
                        {service.priceNote}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-stone-500">
              Insured patients pay their co-payment only. We confirm cover
              before the appointment, not after it.
            </p>
          </div>
        </div>
      </PageContainer>

      <div className="border-t border-border bg-stone-100 py-16">
        <PageContainer>
          <SectionHeading
            eyebrow="The team"
            title={`Doctors in ${specialty.name.toLowerCase()}`}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors
              ? doctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    specialty={specialty}
                  />
                ))
              : Array.from({ length: 2 }).map((_, index) => (
                  <Skeleton key={index} className="h-72 rounded-xl" />
                ))}
          </div>
        </PageContainer>
      </div>
    </>
  );
}
