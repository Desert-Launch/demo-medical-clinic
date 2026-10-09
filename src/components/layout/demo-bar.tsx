/**
 * The one piece of Desert Launch chrome on a demo: a slim strip above the
 * site that says what this is, whose it is, and where to ask for one like it.
 *
 * Three ways out. The brand opens the studio's page for this kind of business
 * (what a real build adds, timeline, price, the questions owners ask), with
 * utm_campaign set to the demo; the call to action opens WhatsApp with a
 * message naming the demo. Between them sits the switch between the two sides
 * of the demo — the dashboard from the site, the site from the dashboard — so
 * a visitor who arrives from desertlaunch.dev on one link can place an order
 * and then go and watch it land. The demo itself stays untouched — no studio
 * copy inside the business's own pages.
 *
 * It deliberately ignores the demo's palette. The demo has to look like the
 * client's business; this strip has to look like it is *not* part of it. Navy
 * and gold are the studio's own tokens (desertlaunch.dev) and are hardcoded
 * here so they never drift with a demo's theme.
 *
 * Server component; the side switch is the only client part. It sits in
 * normal flow so sticky headers and sidebars below it behave exactly as they
 * do without it.
 */

import { DemoSideSwitch } from "@/components/layout/demo-side-switch";
import { DEMO } from "@/lib/demo-site";

const WHATSAPP = "201022838534";

type Lang = "en" | "ar";

const COPY: Record<
  Lang,
  {
    label: string;
    brand: string;
    /** Phone-width brand: the full one leaves no room for the side switch. */
    brandShort: string;
    note: string;
    /** Phone-width label: the full question does not fit beside the brand.
     *  The full one is per demo (`DEMO.cta`), because it names the vertical. */
    ctaShort: string;
    opener: (demo: string) => string;
  }
> = {
  en: {
    label: "About this demo",
    brand: "Demo by Desert Launch",
    brandShort: "Desert Launch",
    note: "A fictional business with sample data — your changes are saved in this browser for today.",
    ctaShort: "Get a quote",
    opener: (demo) =>
      `Hi Desert Launch, I tried the ${demo} demo and I'd like something similar for my business.`,
  },
  ar: {
    label: "عن هذا العرض التجريبي",
    brand: "عرض تجريبي من Desert Launch",
    brandShort: "Desert Launch",
    note: "نشاط تجاري خيالي ببيانات تجريبية — تُحفظ تغييراتك في هذا المتصفح حتى نهاية اليوم.",
    ctaShort: "اطلب عرض سعر",
    opener: (demo) => `مرحباً Desert Launch، جرّبت عرض ${demo} وأريد شيئاً مشابهاً لنشاطي.`,
  },
};

/** Which demo this is comes from `@/lib/demo-site`, the one place the
 *  layout, the share preview and the structured data all read. */
export function DemoBar() {
  const { name: demo, slug, lang } = DEMO;
  const c = COPY[lang];
  // The industry page for this demo, which is in the demo's own language.
  const back = `${DEMO.industry.url}?utm_source=demo&utm_medium=bar&utm_campaign=${slug}`;
  const wa = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(c.opener(demo))}`;

  return (
    <aside
      aria-label={c.label}
      className="flex min-h-10 items-center gap-x-3 overflow-hidden bg-[#0b0f19] px-4 py-1.5 text-[13px] leading-snug text-[#c9cfdb] sm:gap-x-4 sm:px-6"
    >
      <a
        href={back}
        className="inline-flex shrink-0 items-center gap-2 font-semibold text-[#f8fafc] hover:text-[#f5c542] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5c542]"
      >
        <span aria-hidden="true" className="size-2 rounded-full bg-[#f5c542]" />
        <span className="sm:hidden">{c.brandShort}</span>
        <span className="hidden sm:inline">{c.brand}</span>
      </a>
      <p className="hidden min-w-0 truncate lg:block">{c.note}</p>
      <DemoSideSwitch lang={lang} adminPath={DEMO.adminPath} />
      <a
        href={wa}
        target="_blank"
        rel="noreferrer"
        className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-[#f5c542] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5c542]"
      >
        <span className="sm:hidden">{c.ctaShort}</span>
        <span className="hidden sm:inline">{DEMO.cta}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="size-3.5 rtl:-scale-x-100"
        >
          <path d="M7 17 17 7M8 7h9v9" />
        </svg>
      </a>
    </aside>
  );
}
