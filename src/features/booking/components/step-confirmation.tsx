"use client";

import Link from "next/link";
import { format, parseISO } from "date-fns";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarCheck, MapPin, Phone } from "lucide-react";

import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { transitions } from "@/lib/motion";
import { site } from "@/lib/site";
import { formatAED } from "@/lib/utils";
import { patientFullName, type AppointmentWithRelations } from "@/types";

export function StepConfirmation({
  appointment,
  isNewPatient,
  onBookAnother,
}: {
  appointment: AppointmentWithRelations;
  isNewPatient: boolean;
  onBookAnother: () => void;
}) {
  const startsAt = parseISO(appointment.startsAt);
  const reduceMotion = useReducedMotion();

  return (
    <RevealGroup step={0.07} trigger="mount">
      {/* The one confirmation moment in the product. The mark lands with a
          little overshoot; nothing else on this screen moves, so the eye goes
          to it and then down to the reference number. */}
      <motion.div
        initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={transitions.emphasis}
        className="flex size-14 items-center justify-center rounded-full bg-success-100 text-success-700"
      >
        <CalendarCheck aria-hidden="true" className="size-7" />
      </motion.div>

      <RevealItem>
        <h2 className="mt-6 text-3xl">
          You are booked in, {appointment.patient.firstName}.
        </h2>
        <p className="mt-3 text-lg text-stone-600">
          {isNewPatient
            ? "We have opened a record for you. Bring your Emirates ID and insurance card to the first visit."
            : "Added to your existing record — the doctor will see your history before you arrive."}
        </p>
      </RevealItem>

      <RevealItem className="mt-8 overflow-hidden rounded-xl border border-border bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-lapis-950 px-5 py-4 text-stone-0">
          <div>
            <p className="text-xs uppercase tracking-[0.1em] text-lapis-300">
              Booking reference
            </p>
            <p
              data-numeric
              className="mt-1 font-mono text-lg font-semibold tracking-wide"
            >
              {appointment.reference}
            </p>
          </div>
          <p className="text-sm text-lapis-200">
            Quote this if you need to change anything
          </p>
        </div>

        <dl className="divide-y divide-border">
          <Row label="Patient" value={patientFullName(appointment.patient)} />
          <Row
            label="When"
            value={format(startsAt, "EEEE d MMMM yyyy, h:mm a")}
          />
          <Row
            label="Appointment"
            value={`${appointment.service.name} · ${appointment.durationMinutes} minutes`}
          />
          <Row
            label="With"
            value={`${appointment.doctor.name} · ${appointment.specialty.name}`}
          />
          <Row label="Reason given" value={appointment.reason} />
          <Row label="Fee" value={formatAED(appointment.feeAED)} />
        </dl>
      </RevealItem>

      <RevealItem className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-stone-25 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-stone-900">
            <MapPin aria-hidden="true" className="size-4 text-lapis-600" />
            Where to go
          </p>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            {site.address.line1}, {site.address.line2}. Arrive ten minutes early
            so the desk can check your insurance.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-stone-25 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-stone-900">
            <Phone aria-hidden="true" className="size-4 text-lapis-600" />
            Need to change it?
          </p>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Call {site.phone} with your reference. Cancelling more than four
            hours ahead frees the slot for someone else.
          </p>
        </div>
      </RevealItem>

      <RevealItem className="mt-8 flex flex-wrap gap-3">
        <Button size="lg" onClick={onBookAnother}>
          Book another appointment
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/admin/appointments">See it in the clinic dashboard</Link>
        </Button>
      </RevealItem>

      <RevealItem>
        <p className="mt-6 text-sm text-stone-500">
          This is a demo — no email or SMS was sent. The appointment is held in
          memory and resets when you refresh the page.
        </p>
      </RevealItem>
    </RevealGroup>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 px-5 py-3.5">
      <dt className="w-32 shrink-0 text-sm text-stone-500">{label}</dt>
      <dd className="min-w-0 flex-1 font-medium text-stone-900">{value}</dd>
    </div>
  );
}
