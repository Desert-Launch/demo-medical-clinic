import Link from "next/link";
import { CalendarDays, Clock, ShieldCheck } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { GradientArt } from "@/components/shared/gradient-art";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { SpecialtyQuickPick } from "@/features/specialties/components/specialty-quick-pick";

const assurances = [
  { icon: CalendarDays, label: "Same-week slots in every department" },
  { icon: ShieldCheck, label: "Six major insurers billed directly" },
  { icon: Clock, label: "Friday mornings and Saturday clinics" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-stone-0">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 size-[34rem] rounded-full bg-[radial-gradient(circle,var(--lapis-100),transparent_62%)]"
      />
      <PageContainer className="relative grid gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-24">
        <Reveal>
          <p className="eyebrow text-lapis-600">
            Multi-specialty clinic · Al Bateen, Abu Dhabi
          </p>
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl">
            Six departments, one waiting room, one record.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600">
            Family medicine, dermatology, paediatrics, cardiology, ENT and
            physiotherapy under one roof. Book the department you need and the
            next doctor free — your history follows you between them.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/book">Book appointment</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/doctors">Meet the doctors</Link>
            </Button>
          </div>

          <ul className="mt-10 space-y-3 border-t border-border pt-7">
            {assurances.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-3 text-sm text-stone-600"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-lapis-50 text-lapis-700">
                  <item.icon aria-hidden="true" className="size-3.5" />
                </span>
                {item.label}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.12} className="relative">
          {/* The signature arch: a Moorish horseshoe panel, with the booking
              navigator sitting proud of its foot. */}
          <GradientArt
            variant={4}
            className="arch mx-auto h-[26rem] w-full max-w-md sm:h-[30rem]"
          />
          <div className="relative z-10 mx-auto -mt-24 w-full max-w-sm">
            <SpecialtyQuickPick />
          </div>
        </Reveal>
      </PageContainer>
    </section>
  );
}
