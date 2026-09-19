import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { CtaBand } from "@/components/marketing/cta-band";
import { MarketingPageHeader } from "@/components/marketing/page-header";
import { SpecialtyGrid } from "@/features/specialties/components/specialty-grid";

export const metadata: Metadata = {
  title: "Specialties",
  description:
    "Family medicine, dermatology, paediatrics, cardiology, ENT and physiotherapy at the Demo Medical Clinic in Abu Dhabi.",
};

export default function SpecialtiesPage() {
  return (
    <>
      <MarketingPageHeader
        eyebrow="Departments"
        title="Six departments, one appointment desk"
        lead="Each department runs its own clinic list but shares one patient record — so a referral upstairs does not mean starting your history again."
      />

      <PageContainer className="py-14 sm:py-16">
        <SpecialtyGrid />
      </PageContainer>

      <CtaBand
        title="Still not sure which department?"
        lead="Book family medicine. They see you first, and refer you on the same day if it belongs somewhere else."
      />
    </>
  );
}
