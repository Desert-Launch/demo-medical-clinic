/**
 * Clinic-wide facts used by the header, footer, contact page and metadata.
 * Fictional throughout — no real practice, address, or insurer.
 */

export const site = {
  name: "Demo Medical Clinic",
  nameArabic: "عيادة طبية تجريبية",
  shortName: "Demo Clinic",
  tagline: "Six specialties, one appointment.",
  description:
    "A multi-specialty outpatient clinic in Abu Dhabi. Book family medicine, dermatology, paediatrics, cardiology, ENT and physiotherapy in one place.",
  // Deliberately undialable: a demo must never ring a real line.
  phone: "+971 2 555 0xxx",
  /** Where a "call us" control goes: the number above must never dial. */
  phoneHref: "/contact",
  whatsapp: "+971 50 555 0xxx",
  email: "hello@example.com",
  address: {
    line1: "Demo Tower, Level 3",
    line2: "1 Demo Street, Demo District",
    city: "Abu Dhabi",
    country: "United Arab Emirates",
  },
  /** Front-desk hours. Keyed to `Date.getDay()` — 0 is Sunday. */
  hours: [
    { day: "Sunday – Thursday", time: "8:00 am – 9:00 pm" },
    { day: "Friday", time: "8:00 am – 12:00 pm" },
    { day: "Saturday", time: "9:00 am – 6:00 pm" },
  ],
  /** Fictional insurers. Deliberately not real brands. */
  insurers: [
    "Gulf Assure",
    "Falcon Health",
    "Emirates Care Plus",
    "Nahda Medical Cover",
    "Sahel Insurance",
    "Meridian Global Health",
  ],
  // Generic on purpose: a fictional clinic must not claim a real regulator.
  accreditations: [
    { label: "Licensed clinic", note: "Demo credential" },
    { label: "Quality programme", note: "Audited twice yearly" },
    { label: "Paediatric safety certified", note: "Renewed 2025" },
  ],
} as const;

export type Insurer = (typeof site.insurers)[number];
