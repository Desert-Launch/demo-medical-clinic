import { PageContainer } from "@/components/layout/page-container";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";
import { site } from "@/lib/site";

/**
 * Insurer names are invented for the demo — no real brand marks appear
 * anywhere on the site, so these are set as type rather than logos.
 */
export function InsuranceStrip() {
  return (
    <section className="bg-stone-0 py-14">
      <PageContainer>
        <Reveal>
          <p className="eyebrow text-center text-stone-500">
            Direct billing with
          </p>
        </Reveal>
        {/* Set as type, so the names read across as one line rather than a
            row of competing logos. They fade in left to right at the same
            cadence as everything else on the page. */}
        <RevealGroup
          as="ul"
          className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-5"
          step={0.04}
          delay={0.06}
        >
          {site.insurers.map((insurer) => (
            <RevealItem
              as="li"
              key={insurer}
              distance={10}
              className="font-display text-lg font-medium tracking-[-0.01em] text-stone-400 transition-colors duration-200 hover:text-stone-600"
            >
              {insurer}
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal delay={0.1}>
          <p className="mt-7 text-center text-sm text-stone-500">
            Not on the list? Pay at the desk and we will issue a claimable
            invoice the same day.
          </p>
        </Reveal>
      </PageContainer>
    </section>
  );
}
