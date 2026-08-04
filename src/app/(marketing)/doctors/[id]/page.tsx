import type { Metadata } from "next";

import { CtaBand } from "@/components/marketing/cta-band";
import { DoctorProfile } from "@/features/doctors/components/doctor-profile";
import { listDoctorRoutes } from "@/features/doctors";

/** The roster is the whole set — an unknown id is a real 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return listDoctorRoutes().map(({ id }) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const doctor = listDoctorRoutes().find((item) => item.id === id);
  if (!doctor) return { title: "Doctor" };
  return { title: doctor.name, description: doctor.focus };
}

export default async function DoctorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <DoctorProfile doctorId={id} />
      <CtaBand />
    </>
  );
}
