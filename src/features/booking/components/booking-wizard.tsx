"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { BookingSummary } from "@/features/booking/components/booking-summary";
import { SlotPicker } from "@/features/booking/components/slot-picker";
import { StepCare } from "@/features/booking/components/step-care";
import { StepConfirmation } from "@/features/booking/components/step-confirmation";
import { StepDetails } from "@/features/booking/components/step-details";
import { StepDoctor } from "@/features/booking/components/step-doctor";
import { WizardStepper } from "@/features/booking/components/wizard-stepper";
import {
  FIRST_AVAILABLE,
  emptyBookingDraft,
  useFirstAvailable,
  useSubmitBooking,
  type BookingDetailsValues,
  type BookingDraft,
} from "@/features/booking";
import { useDoctors } from "@/features/doctors";
import { useSpecialties } from "@/features/specialties";
import type { AppointmentWithRelations, Specialty } from "@/types";

export function BookingWizard() {
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();

  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<BookingDraft>(emptyBookingDraft);
  const [result, setResult] = useState<{
    appointment: AppointmentWithRelations;
    isNewPatient: boolean;
  } | null>(null);

  const { data: specialties } = useSpecialties();
  const { data: doctors } = useDoctors();
  const submit = useSubmitBooking();

  // Deep links from the marketing pages: ?specialty=cardiology, ?doctor=doc_x.
  const [prefilled, setPrefilled] = useState(false);
  useEffect(() => {
    if (prefilled || !specialties || !doctors) return;

    const doctorParam = searchParams.get("doctor");
    const specialtyParam = searchParams.get("specialty");

    const doctor = doctorParam
      ? doctors.find((item) => item.id === doctorParam)
      : undefined;
    const specialty = doctor
      ? specialties.find((item) => item.id === doctor.specialtyId)
      : specialtyParam
        ? specialties.find((item) => item.slug === specialtyParam)
        : undefined;

    if (specialty) {
      setDraft((current) => ({
        ...current,
        specialtyId: specialty.id,
        serviceId: specialty.services[0]?.id ?? "",
        doctorId: doctor?.id ?? current.doctorId,
      }));
    }
    setPrefilled(true);
  }, [doctors, prefilled, searchParams, specialties]);

  const specialty = specialties?.find((item) => item.id === draft.specialtyId);
  const service = specialty?.services.find((item) => item.id === draft.serviceId);
  const duration = service?.durationMinutes ?? 0;

  // "First available" is resolved to a real doctor before the time step, so the
  // picker and the summary always name someone.
  const firstAvailable = useFirstAvailable(
    draft.specialtyId,
    duration,
    draft.doctorId === FIRST_AVAILABLE && step >= 2,
  );

  const resolvedDoctorId =
    draft.doctorId === FIRST_AVAILABLE
      ? (firstAvailable.data?.doctorId ?? "")
      : draft.doctorId;

  const doctor = doctors?.find((item) => item.id === resolvedDoctorId);

  const canContinue = useMemo(() => {
    if (step === 1) return Boolean(draft.specialtyId && draft.serviceId);
    if (step === 2)
      return draft.doctorId === FIRST_AVAILABLE
        ? Boolean(firstAvailable.data)
        : Boolean(draft.doctorId);
    if (step === 3) return draft.startsAt.length > 0;
    return true;
  }, [draft, firstAvailable.data, step]);

  function selectSpecialty(next: Specialty) {
    setDraft((current) =>
      current.specialtyId === next.id
        ? current
        : {
            ...current,
            specialtyId: next.id,
            serviceId: next.services[0]?.id ?? "",
            doctorId: "",
            startsAt: "",
          },
    );
  }

  function selectService(serviceId: string) {
    setDraft((current) => ({ ...current, serviceId, startsAt: "" }));
  }

  function selectDoctor(doctorId: string) {
    setDraft((current) => ({ ...current, doctorId, startsAt: "" }));
  }

  function submitBooking(details: BookingDetailsValues) {
    if (!resolvedDoctorId || !draft.serviceId || !draft.startsAt) return;
    setDraft((current) => ({ ...current, details }));
    submit.mutate(
      {
        doctorId: resolvedDoctorId,
        serviceId: draft.serviceId,
        startsAt: draft.startsAt,
        details,
      },
      {
        onSuccess: (booking) => {
          setResult(booking);
          setStep(5);
        },
      },
    );
  }

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <PageContainer className="py-10 sm:py-14">
      <div className="mx-auto max-w-2xl lg:max-w-none">
        <WizardStepper
          current={step}
          onStepSelect={step < 5 ? setStep : undefined}
        />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={reduceMotion ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -24 }}
              transition={transition}
            >
              {step === 1 ? (
                <StepCare
                  specialtyId={draft.specialtyId}
                  serviceId={draft.serviceId}
                  onSelectSpecialty={selectSpecialty}
                  onSelectService={selectService}
                />
              ) : null}

              {step === 2 ? (
                <StepDoctor
                  specialtyId={draft.specialtyId}
                  serviceId={draft.serviceId}
                  durationMinutes={duration}
                  doctorId={draft.doctorId}
                  onSelect={selectDoctor}
                />
              ) : null}

              {step === 3 ? (
                <div>
                  <h2 className="text-xl font-semibold">Pick a time</h2>
                  <p className="mt-2 text-stone-600">
                    {doctor
                      ? `${doctor.name}’s diary for the weeks ahead. Times shown are already free.`
                      : "Loading the diary…"}
                  </p>
                  <div className="mt-6">
                    {resolvedDoctorId ? (
                      <SlotPicker
                        doctorId={resolvedDoctorId}
                        durationMinutes={duration}
                        value={draft.startsAt}
                        onChange={(startsAt) =>
                          setDraft((current) => ({ ...current, startsAt }))
                        }
                      />
                    ) : null}
                  </div>
                </div>
              ) : null}

              {step === 4 ? (
                <StepDetails
                  defaultValues={draft.details}
                  onBack={() => setStep(3)}
                  onSubmit={submitBooking}
                  pending={submit.isPending}
                />
              ) : null}

              {step === 5 && result ? (
                <StepConfirmation
                  appointment={result.appointment}
                  isNewPatient={result.isNewPatient}
                  onBookAnother={() => {
                    setDraft(emptyBookingDraft);
                    setResult(null);
                    setStep(1);
                  }}
                />
              ) : null}
            </motion.div>
          </AnimatePresence>

          {step < 4 ? (
            <div className="mt-10 flex flex-wrap gap-3 border-t border-border pt-6">
              {step > 1 ? (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setStep((current) => current - 1)}
                >
                  Back
                </Button>
              ) : null}
              <Button
                size="lg"
                disabled={!canContinue}
                onClick={() => setStep((current) => current + 1)}
              >
                Continue
              </Button>
              {!canContinue && step === 2 && draft.doctorId === FIRST_AVAILABLE ? (
                <p className="w-full text-sm text-stone-500">
                  Checking who is free soonest…
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        {step < 5 ? (
          <BookingSummary
            specialty={specialty}
            service={service}
            doctor={doctor}
            startsAt={draft.startsAt}
          />
        ) : null}
      </div>
    </PageContainer>
  );
}
