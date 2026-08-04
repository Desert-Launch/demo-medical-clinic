import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { GradientArt } from "@/components/shared/gradient-art";
import { specialtyIcon } from "@/features/specialties/components/specialty-icon";
import { formatAED } from "@/lib/utils";
import type { Specialty } from "@/types";

export function SpecialtyCard({ specialty }: { specialty: Specialty }) {
  const Icon = specialtyIcon(specialty.icon);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-xs transition-shadow hover:shadow-md">
      <div className="relative px-5 pt-5">
        <GradientArt
          variant={specialty.art}
          className="arch-sm h-36 w-full"
        />
        <span className="absolute bottom-4 left-9 flex size-11 items-center justify-center rounded-full bg-stone-0 text-lapis-700 shadow-sm">
          <Icon aria-hidden="true" className="size-5" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 pt-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-xl">
            <Link
              href={`/specialties/${specialty.slug}`}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {specialty.name}
            </Link>
          </h3>
          <span
            dir="rtl"
            lang="ar"
            className="shrink-0 font-arabic text-xs text-stone-400"
          >
            {specialty.nameArabic}
          </span>
        </div>

        <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-600">
          {specialty.summary}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <p className="text-sm text-stone-500">
            Consultation from{" "}
            <span data-numeric className="font-semibold text-stone-800">
              {formatAED(specialty.consultationFeeAED)}
            </span>
          </p>
          <span className="flex items-center gap-1 text-sm font-medium text-lapis-700">
            View
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </article>
  );
}
