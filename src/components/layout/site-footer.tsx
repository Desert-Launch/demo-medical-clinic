import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { KhatimMark } from "@/components/layout/logo";
import { PageContainer } from "@/components/layout/page-container";
import { site } from "@/lib/site";

const columns = [
  {
    heading: "Care",
    links: [
      { href: "/specialties", label: "All specialties" },
      { href: "/doctors", label: "Find a doctor" },
      { href: "/book", label: "Book an appointment" },
    ],
  },
  {
    heading: "Clinic",
    links: [
      { href: "/about", label: "About the clinic" },
      { href: "/contact", label: "Contact and directions" },
      { href: "/admin", label: "Clinic dashboard" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-lapis-950 text-lapis-100">
      <div
        aria-hidden="true"
        className="khatim-field pointer-events-none absolute inset-0 opacity-[0.045]"
      />
      <PageContainer className="relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3 text-saffron-300">
              <KhatimMark className="size-8" />
              <div className="leading-none">
                <p className="font-display text-lg font-semibold text-stone-0">
                  {site.name}
                </p>
                <p
                  dir="rtl"
                  lang="ar"
                  className="mt-1.5 font-arabic text-xs text-lapis-200/80"
                >
                  {site.nameArabic}
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-lapis-200">
              A multi-specialty outpatient clinic in Abu Dhabi. Six departments
              under one roof, one appointment desk, one patient record.
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="eyebrow text-lapis-300">{column.heading}</h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-lapis-100 transition-colors hover:text-stone-0"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="eyebrow text-lapis-300">Visit</h2>
            <address className="mt-4 space-y-3 text-sm not-italic text-lapis-100">
              <p className="flex gap-2.5">
                <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <span>
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                  <br />
                  {site.address.city}
                </span>
              </p>
              <p className="flex gap-2.5">
                <Phone aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <a
                  href={site.phoneHref}
                  className="transition-colors hover:text-stone-0"
                >
                  {site.phone}
                </a>
              </p>
              <p className="flex gap-2.5">
                <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-stone-0"
                >
                  {site.email}
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-lapis-800/60 pt-6 text-xs text-lapis-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Fictional clinic built as
            a product demo.
          </p>
          <p>
            For emergencies call 998. This site does not provide medical advice.
          </p>
        </div>
      </PageContainer>
    </footer>
  );
}
