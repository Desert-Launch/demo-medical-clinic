/**
 * What this demo is, in one place. The Desert Launch bar, the share-preview
 * card, the metadata and the structured data all read from here, so they can
 * never disagree about the name, the URL or the language.
 */
export type DemoLang = "en" | "ar";

export const DEMO = {
  /** Short id the landing site uses; also the subdomain and utm_campaign. */
  slug: "medical",
  name: "Demo Medical Clinic",
  /** Latin-only name for the share-preview image, whose default font has no Arabic. */
  latinName: "Demo Medical Clinic",
  url: "https://medical.demos.desertlaunch.dev",
  /** The staff side. The demo bar's switch opens it from every public page. */
  adminPath: "/admin",
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
    "A fictional business: the names, prices, address and phone numbers are invented, and the data is sample data. What a visitor changes is saved only in their own browser, for the day.",
  features: [
      "Doctors by specialty with profiles",
      "Five-step booking wizard with live slot availability",
      "First available slot across a whole department",
      "Deep links into booking by specialty or doctor",
      "Staff dashboard with full control over appointments and patient files",
      "Filters by status, department, doctor and date range"
  ],
  repo: "https://github.com/Desert-Launch/demo-medical-clinic",
  /** What the demo is, in the words its buyer searches with. The share-preview
   *  title and the heading of llms.txt. In the demo's own language. */
  headline: "Multi-specialty clinic website with online booking",
  /** Who the demo is for: the owner of this kind of business, not the
   *  business's customers. Emitted as `audience` in the JSON-LD. */
  audience: "Medical clinics and multi-specialty medical centres",
  /** The Desert Launch page that owns this vertical in search and explains
   *  what a real build adds. The bar's brand link and the JSON-LD point here,
   *  so the demo hands its visitors and its context to one indexed page. */
  industry: {
    url: "https://www.desertlaunch.dev/industries/clinics/",
    name: "Clinic and dental websites by Desert Launch",
  },
  /** The bar's call to action, in the demo's language. */
  cta: "Want this for your clinic?",
  /** Routes worth opening, listed in llms.txt. */
  pages: [
    { path: "/", label: "home" },
    { path: "/specialties", label: "departments" },
    { path: "/doctors", label: "doctor profiles" },
    { path: "/book", label: "the five-step booking flow" },
    { path: "/admin", label: "staff dashboard" },
    { path: "/admin/appointments", label: "appointments with filters" },
    { path: "/admin/patients", label: "patient files" },
  ],
} as const;
