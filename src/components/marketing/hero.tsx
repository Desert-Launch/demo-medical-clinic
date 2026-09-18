import Link from "next/link";
import { CalendarDays, Clock, ShieldCheck } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { GradientArt } from "@/components/shared/gradient-art";
import { Photo } from "@/components/shared/photo";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { SpecialtyQuickPick } from "@/features/specialties/components/specialty-quick-pick";
import { scenes } from "@/lib/images";

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
        {/* The headline blocks arrive in reading order rather than as one
            slab, so the eye is led down to the booking buttons. */}
        <RevealGroup>
          <RevealItem>
            <p className="eyebrow text-lapis-600">
              Multi-specialty clinic · Al Bateen, Abu Dhabi
            </p>
          </RevealItem>

          <RevealItem>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl">
              Six departments, one waiting room, one record.
            </h1>
          </RevealItem>

          <RevealItem>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600">
              Family medicine, dermatology, paediatrics, cardiology, ENT and
              physiotherapy under one roof. Book the department you need and the
              next doctor free — your history follows you between them.
            </p>
          </RevealItem>

          <RevealItem>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/book">Book appointment</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/doctors">Meet the doctors</Link>
              </Button>
            </div>
          </RevealItem>

          <RevealItem>
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
          </RevealItem>
        </RevealGroup>

        <div className="relative">
          {/* The signature arch: a Moorish horseshoe panel, with the booking
              navigator sitting proud of its foot. It enters last and travels
              further than the text, so the shape reads as the arrival. */}
          <Reveal delay={0.18} distance={32}>
            <GradientArt
              variant={4}
              className="arch mx-auto h-[26rem] w-full max-w-md sm:h-[30rem]"
            >
              <Photo
                src={scenes.heroInterior}
                sizes="(min-width: 1024px) 28rem, 100vw"
                priority
              />
              {/* Sits above the photo so the quick-pick card below keeps its
                  contrast against whatever the image happens to be. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 z-30 h-2/3 bg-[linear-gradient(to_top,var(--lapis-950),transparent)] opacity-80"
              />
            </GradientArt>
          </Reveal>

          <Reveal
            delay={0.34}
            distance={20}
            className="relative z-10 mx-auto -mt-24 w-full max-w-sm"
          >
            <SpecialtyQuickPick />
          </Reveal>
        </div>
      </PageContainer>
    </section>
  );
}
