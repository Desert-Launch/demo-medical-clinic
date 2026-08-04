import type { Metadata } from "next";
import { BadgeCheck, Clock } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { CtaBand } from "@/components/marketing/cta-band";
import { MarketingPageHeader } from "@/components/marketing/page-header";
import { GradientArt } from "@/components/shared/gradient-art";
import { SectionHeading } from "@/components/shared/section";
import { StaticMap } from "@/components/shared/static-map";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "How Andalus Medical Center works: six departments, one record, and a front desk that confirms your insurance before the appointment.",
};

const principles = [
  {
    title: "One record, six departments",
    body: "A referral from family medicine to cardiology is a corridor, not a form. Your history, allergies and results move with you.",
  },
  {
    title: "The price before the appointment",
    body: "Consultation fees are published on every department page. Insured patients get their cover confirmed before they arrive, not at the desk afterwards.",
  },
  {
    title: "The doctor who saw you reads the test",
    body: "Echoes, hearing tests and endoscopies are done and read in the department, so most patients leave the same visit with an answer.",
  },
];

export default function AboutPage() {
  return (
    <>
      <MarketingPageHeader
        eyebrow="About"
        title="A clinic organised the way patients actually arrive"
        lead="Andalus opened in Al Bateen in 2016 with three departments and a simple rule: nobody should have to work out which specialist they need before they can be seen."
      />

      <PageContainer className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="space-y-6 text-lg leading-relaxed text-stone-700">
            <p>
              We started as a family practice on the third floor of the Bateen
              Clinic Tower. Patients kept coming back with problems that needed
              a specialist, and kept coming back frustrated at what happened
              next — a referral letter, a new clinic, a new set of forms, and a
              history retold from memory.
            </p>
            <p>
              So we brought the specialists in. Dermatology and paediatrics
              joined in 2018, cardiology and ENT in 2021, physiotherapy the year
              after. Six departments now share one floor, one appointment desk
              and one patient record.
            </p>
            <p>
              We are deliberately outpatient only. Anything that needs a
              hospital gets referred the same day, with the scans and notes sent
              ahead — not handed to you in an envelope.
            </p>
          </div>

          <GradientArt
            variant={2}
            className="arch mx-auto h-96 w-full max-w-sm"
          />
        </div>
      </PageContainer>

      <section className="border-y border-border bg-stone-100 py-16">
        <PageContainer>
          <SectionHeading eyebrow="How we work" title="Three things we hold to" />
          <ul className="mt-10 grid gap-6 lg:grid-cols-3">
            {principles.map((item) => (
              <li
                key={item.title}
                className="rounded-xl border border-border bg-surface p-7"
              >
                <h3 className="text-xl">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-stone-600">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </PageContainer>
      </section>

      <PageContainer className="py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl">Licensing and quality</h2>
            <ul className="mt-6 space-y-4">
              {site.accreditations.map((item) => (
                <li key={item.label} className="flex gap-3">
                  <BadgeCheck
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-lapis-600"
                  />
                  <div>
                    <p className="font-semibold text-stone-900">{item.label}</p>
                    <p className="text-sm text-stone-600">{item.note}</p>
                  </div>
                </li>
              ))}
            </ul>

            <h3 className="mt-10 text-xl">Insurers we bill directly</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {site.insurers.map((insurer) => (
                <li
                  key={insurer}
                  className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-stone-700"
                >
                  {insurer}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-stone-500">
              Insurer names are invented for this demo.
            </p>
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-2xl">
              <Clock aria-hidden="true" className="size-5 text-lapis-600" />
              Opening hours
            </h2>
            <dl className="mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
              {site.hours.map((entry) => (
                <div
                  key={entry.day}
                  className="flex items-center justify-between px-5 py-4"
                >
                  <dt className="font-medium text-stone-800">{entry.day}</dt>
                  <dd data-numeric className="text-stone-600">
                    {entry.time}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm text-stone-500">
              Friday mornings are family medicine and paediatrics only. The
              specialist clinics resume on Saturday.
            </p>

            <StaticMap className="mt-8 h-64" />
          </div>
        </div>
      </PageContainer>

      <CtaBand />
    </>
  );
}
