import type { Metadata } from "next";

import { CtaBand } from "@/components/marketing/cta-band";
import { listSpecialtyRoutes } from "@/features/specialties";
import { SpecialtyDetail } from "@/features/specialties/components/specialty-detail";

/** The six departments are the whole set — anything else is a real 404, served
 *  as one rather than rendered and then swapped out on the client. */
export const dynamicParams = false;

export function generateStaticParams() {
  return listSpecialtyRoutes().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const specialty = listSpecialtyRoutes().find((item) => item.slug === slug);
  if (!specialty) return { title: "Department" };
  return { title: specialty.name, description: specialty.summary };
}

export default async function SpecialtyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <SpecialtyDetail slug={slug} />
      <CtaBand />
    </>
  );
}
