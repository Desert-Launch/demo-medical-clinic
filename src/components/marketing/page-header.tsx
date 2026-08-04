import { PageContainer } from "@/components/layout/page-container";
import { Reveal } from "@/components/shared/reveal";

/** The opener shared by every inner marketing page. */
export function MarketingPageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <div className="relative overflow-hidden border-b border-border bg-stone-0">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-40 size-[26rem] rounded-full bg-[radial-gradient(circle,var(--lapis-100),transparent_65%)]"
      />
      <PageContainer className="relative py-14 sm:py-20">
        <Reveal>
          <p className="eyebrow text-lapis-600">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">
            {lead}
          </p>
          <div aria-hidden="true" className="rule-brand mt-8 w-40 rounded-full" />
        </Reveal>
      </PageContainer>
    </div>
  );
}
