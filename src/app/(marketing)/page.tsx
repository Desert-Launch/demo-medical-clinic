import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { CtaBand } from "@/components/marketing/cta-band";
import { Hero } from "@/components/marketing/hero";
import { InsuranceStrip } from "@/components/marketing/insurance-strip";
import { Testimonials } from "@/components/marketing/testimonials";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { SectionHeading } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { DoctorStrip } from "@/features/doctors/components/doctor-strip";
import { SpecialtyGrid } from "@/features/specialties/components/specialty-grid";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />

      <section className="bg-stone-0 py-20">
        <PageContainer>
          <SectionHeading
            eyebrow="Departments"
            title="Find the right department first"
            lead="Not sure which one you need? Family medicine sees you first and sends you upstairs if it is something else."
            action={
              <Button asChild variant="outline">
                <Link href="/specialties">All specialties</Link>
              </Button>
            }
          />
          <div className="mt-12">
            <SpecialtyGrid />
          </div>
        </PageContainer>
      </section>

      <section className="border-y border-border bg-stone-100 py-20">
        <PageContainer>
          <SectionHeading
            eyebrow="Our doctors"
            title="Twelve consultants and specialists"
            lead="Consultant-led in every department, with Arabic and English spoken throughout."
            action={
              <Button asChild variant="outline">
                <Link href="/doctors">Doctor directory</Link>
              </Button>
            }
          />
          <div className="mt-12">
            <DoctorStrip limit={6} />
          </div>
        </PageContainer>
      </section>

      <InsuranceStrip />
      <Testimonials />
      <CtaBand />
    </>
  );
}
