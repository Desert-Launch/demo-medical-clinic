import { Quote } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/shared/section";

/** Fictional patients, written as people talk rather than as marketing copy. */
const testimonials = [
  {
    quote:
      "My son saw paediatrics at nine and had his hearing test with ENT before eleven. Two departments, one visit, one bill.",
    name: "Mariam A.",
    context: "Paediatrics and ENT",
  },
  {
    quote:
      "Dr. Al Shamsi did the echo himself and talked me through it on the screen. I left knowing what was wrong, not waiting a week to find out.",
    name: "Ziad B.",
    context: "Cardiology",
  },
  {
    quote:
      "Four months of acne treatment with a review date every time. Nobody sold me anything I did not need.",
    name: "Shamma F.",
    context: "Dermatology",
  },
];

export function Testimonials() {
  return (
    <section className="bg-stone-100 py-20">
      <PageContainer>
        <SectionHeading
          eyebrow="Patients"
          title="What people say after the visit"
          lead="Collected at discharge, published unedited apart from surnames."
        />

        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <li
              key={item.name}
              className="flex flex-col rounded-xl border border-border bg-surface p-7 shadow-xs"
            >
              <Quote
                aria-hidden="true"
                className="size-6 text-saffron-500"
                strokeWidth={2.25}
              />
              <blockquote className="mt-5 flex-1 text-base leading-relaxed text-stone-700">
                {item.quote}
              </blockquote>
              <div className="mt-6 border-t border-border pt-4">
                <p className="text-sm font-semibold text-stone-900">
                  {item.name}
                </p>
                <p className="text-sm text-stone-500">{item.context}</p>
              </div>
            </li>
          ))}
        </ul>
      </PageContainer>
    </section>
  );
}
