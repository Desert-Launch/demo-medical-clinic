import { PageContainer } from "@/components/layout/page-container";

/** Dummy figures. Real enough to read as a going concern, flagged as a demo in
 *  the footer. */
const stats = [
  { value: "6", label: "Specialties", detail: "One booking desk between them" },
  { value: "12", label: "Doctors", detail: "Consultants and specialists" },
  { value: "48,000+", label: "Patient visits", detail: "Since opening in 2016" },
  { value: "4.8/5", label: "Patient rating", detail: "1,240 reviews" },
];

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-stone-100">
      <PageContainer className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p
              data-numeric
              className="font-display text-3xl font-semibold tracking-[-0.02em] text-lapis-800 sm:text-4xl"
            >
              {stat.value}
            </p>
            <p className="mt-2 text-sm font-semibold text-stone-800">
              {stat.label}
            </p>
            <p className="mt-0.5 text-sm text-stone-500">{stat.detail}</p>
          </div>
        ))}
      </PageContainer>
    </section>
  );
}
