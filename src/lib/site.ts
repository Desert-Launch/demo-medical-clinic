/**
 * Clinic-wide facts used by the header, footer, contact page and metadata.
 * Fictional throughout — no real practice, address, or insurer.
 */

export const site = {
  name: "Andalus Medical Center",
  nameArabic: "مركز الأندلس الطبي",
  shortName: "Andalus",
  tagline: "Six specialties, one appointment.",
  description:
    "A multi-specialty outpatient clinic in Abu Dhabi. Book family medicine, dermatology, paediatrics, cardiology, ENT and physiotherapy in one place.",
  phone: "+971 2 555 0142",
  whatsapp: "+971 50 555 0142",
  email: "hello@andalusmedical.ae",
  address: {
    line1: "Al Bateen Clinic Tower, Level 3",
    line2: "Bainunah Street, Al Bateen",
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
  accreditations: [
    { label: "DOH licensed", note: "Department of Health – Abu Dhabi" },
    { label: "JCI-style quality programme", note: "Audited twice yearly" },
    { label: "Paediatric safety certified", note: "Renewed 2025" },
  ],
} as const;

export type Insurer = (typeof site.insurers)[number];
