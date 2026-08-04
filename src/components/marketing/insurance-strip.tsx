import { PageContainer } from "@/components/layout/page-container";
import { site } from "@/lib/site";

/**
 * Insurer names are invented for the demo — no real brand marks appear
 * anywhere on the site, so these are set as type rather than logos.
 */
export function InsuranceStrip() {
  return (
    <section className="bg-stone-0 py-14">
      <PageContainer>
        <p className="eyebrow text-center text-stone-500">
          Direct billing with
        </p>
        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {site.insurers.map((insurer) => (
            <li
              key={insurer}
              className="font-display text-lg font-medium tracking-[-0.01em] text-stone-400"
            >
              {insurer}
            </li>
          ))}
        </ul>
        <p className="mt-7 text-center text-sm text-stone-500">
          Not on the list? Pay at the desk and we will issue a claimable
          invoice the same day.
        </p>
      </PageContainer>
    </section>
  );
}
