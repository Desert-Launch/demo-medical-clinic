import { Suspense } from "react";
import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingWizard } from "@/features/booking/components/booking-wizard";

export const metadata: Metadata = {
  title: "Book an appointment",
  description:
    "Choose a department, a doctor and a time. Booking takes under a minute and confirms straight away.",
};

export default function BookPage() {
  return (
    <>
      <div className="border-b border-border bg-stone-0">
        <PageContainer className="py-10 sm:py-12">
          <p className="eyebrow text-lapis-600">Booking</p>
          <h1 className="mt-3 text-3xl sm:text-4xl">Book an appointment</h1>
          <p className="mt-3 max-w-2xl text-lg text-stone-600">
            Four steps and a confirmation. You can go back at any point without
            losing what you have entered.
          </p>
        </PageContainer>
      </div>

      <Suspense
        fallback={
          <PageContainer className="py-14">
            <Skeleton className="h-10 w-full max-w-2xl rounded-full" />
            <Skeleton className="mt-10 h-96 w-full rounded-xl" />
          </PageContainer>
        }
      >
        <BookingWizard />
      </Suspense>
    </>
  );
}
