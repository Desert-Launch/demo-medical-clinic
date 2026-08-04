import Link from "next/link";
import { Phone } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export function CtaBand({
  title = "Book the department you need",
  lead = "Pick a specialty, choose a doctor or take the first slot free, and you are done in under a minute.",
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-lapis-950 text-stone-0">
      <span
        aria-hidden="true"
        className="khatim-field pointer-events-none absolute inset-0 opacity-[0.06]"
      />
      <PageContainer className="relative flex flex-col items-start gap-8 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl text-stone-0 sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-lapis-200">{lead}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-stone-0 text-lapis-900 hover:bg-lapis-50"
          >
            <Link href="/book">Book appointment</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-lapis-700 bg-transparent text-stone-0 hover:bg-lapis-900 hover:text-stone-0"
          >
            <a href={`tel:${site.phone.replace(/\s/g, "")}`}>
              <Phone aria-hidden="true" className="size-4" />
              {site.phone}
            </a>
          </Button>
        </div>
      </PageContainer>
    </section>
  );
}
