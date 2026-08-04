"use client";

import { useSearchParams } from "next/navigation";

import { DoctorDirectory } from "@/features/doctors/components/doctor-directory";

/**
 * Reads the `?specialty=` deep link used by the department pages. Kept apart
 * from `DoctorDirectory` so only this sliver needs a Suspense boundary.
 */
export function DoctorDirectoryPanel() {
  const searchParams = useSearchParams();
  const specialty = searchParams.get("specialty") ?? undefined;

  return <DoctorDirectory initialSpecialtySlug={specialty} />;
}
