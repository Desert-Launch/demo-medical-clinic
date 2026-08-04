import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { MarketingPageHeader } from "@/components/marketing/page-header";
import { StaticMap } from "@/components/shared/static-map";
import { ContactForm } from "@/features/contact/components/contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Call, message or visit Andalus Medical Center in Al Bateen, Abu Dhabi.",
};

export default function ContactPage() {
  return (
    <>
      <MarketingPageHeader
        eyebrow="Contact"
        title="Talk to the front desk"
        lead="Booking, insurance, results, or something that needs a person — this reaches the same team either way."
      />

      <PageContainer className="py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <ContactForm />

          <aside className="space-y-8">
            <div>
              <h2 className="text-xl">Reach us directly</h2>
              <ul className="mt-5 space-y-4">
                <li className="flex gap-3">
                  <Phone
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-lapis-600"
                  />
                  <div>
                    <p className="text-sm text-stone-500">Front desk</p>
                    <a
                      href={`tel:${site.phone.replace(/\s/g, "")}`}
                      className="font-medium text-stone-900 underline-offset-4 hover:underline"
                    >
                      {site.phone}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <MessageCircle
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-lapis-600"
                  />
                  <div>
                    <p className="text-sm text-stone-500">WhatsApp</p>
                    <p className="font-medium text-stone-900">
                      {site.whatsapp}
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Mail
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-lapis-600"
                  />
                  <div>
                    <p className="text-sm text-stone-500">Email</p>
                    <a
                      href={`mailto:${site.email}`}
                      className="font-medium text-stone-900 underline-offset-4 hover:underline"
                    >
                      {site.email}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <MapPin
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-lapis-600"
                  />
                  <div>
                    <p className="text-sm text-stone-500">Clinic</p>
                    <address className="font-medium not-italic text-stone-900">
                      {site.address.line1}
                      <br />
                      {site.address.line2}
                      <br />
                      {site.address.city}
                    </address>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="flex items-center gap-2 text-xl">
                <Clock aria-hidden="true" className="size-5 text-lapis-600" />
                Opening hours
              </h2>
              <dl className="mt-5 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
                {site.hours.map((entry) => (
                  <div
                    key={entry.day}
                    className="flex items-center justify-between px-5 py-3.5 text-sm"
                  >
                    <dt className="font-medium text-stone-800">{entry.day}</dt>
                    <dd data-numeric className="text-stone-600">
                      {entry.time}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <StaticMap className="h-56" />

            <p className="rounded-xl border border-danger-100 bg-danger-50 p-5 text-sm leading-relaxed text-stone-700">
              <strong className="font-semibold">In an emergency,</strong> call
              998 or go to your nearest hospital emergency department. Andalus is
              an outpatient clinic and does not run a 24-hour service.
            </p>
          </aside>
        </div>
      </PageContainer>
    </>
  );
}
