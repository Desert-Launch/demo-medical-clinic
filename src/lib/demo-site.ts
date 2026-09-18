/**
 * What this demo is, in one place. The Desert Launch bar, the share-preview
 * card, the metadata and the structured data all read from here, so they can
 * never disagree about the name, the URL or the language.
 */
export type DemoLang = "en" | "ar";

export const DEMO = {
  /** Short id the landing site uses; also the subdomain and utm_campaign. */
  slug: "medical",
  name: "Andalus Medical Center",
  /** Latin-only name for the share-preview image, whose default font has no Arabic. */
  latinName: "Andalus Medical Center",
  url: "https://medical.demos.desertlaunch.dev",
  /** Language of the bar and the metadata. Typed as the union so the shared
   *  code that handles both languages stays identical in every demo. */
  lang: "en" as DemoLang,
  /** Interface languages the demo itself offers. */
  languages: ["en"],
  kind: "multi-specialty clinic",
  city: "Abu Dhabi",
  /** One paragraph for share previews and search snippets. */
  description:
    "A working demo of a multi-specialty clinic website with its staff dashboard, by Desert Launch: doctors by specialty, a five-step booking flow with live availability, appointments and patient files. Fictional clinic, sample data.",
  /** Plain statement that the business is invented. */
  fiction:
    "A fictional business: the names, prices, address and phone numbers are invented, and the data is sample data that resets on refresh.",
  features: [
      "Doctors by specialty with profiles",
      "Five-step booking wizard with live slot availability",
      "First available slot across a whole department",
      "Deep links into booking by specialty or doctor",
      "Staff dashboard with full control over appointments and patient files",
      "Filters by status, department, doctor and date range"
  ],
  repo: "https://github.com/Desert-Launch/demo-medical-clinic",
} as const;
