import { Suspense } from "react";
import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { CtaBand } from "@/components/marketing/cta-band";
import { MarketingPageHeader } from "@/components/marketing/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { DoctorDirectoryPanel } from "@/features/doctors/components/doctor-directory-panel";

export const metadata: Metadata = {
  title: "Doctors",
  description:
    "Consultants and specialists at the Demo Medical Clinic, filtered by department and language spoken.",
};

export default function DoctorsPage() {
  return (
    <>
      <MarketingPageHeader
        eyebrow="The team"
        title="Find a doctor who speaks your language"
        lead="Twelve consultants and specialists across six departments. Filter by what you need and who you can talk to comfortably."
      />

      <PageContainer className="py-14 sm:py-16">
        <Suspense fallback={<Skeleton className="h-32 w-full rounded-xl" />}>
          <DoctorDirectoryPanel />
        </Suspense>
      </PageContainer>

      <CtaBand
        title="Booked with someone before?"
        lead="Open their profile and book the same doctor again — your record and notes are already there."
      />
    </>
  );
}
