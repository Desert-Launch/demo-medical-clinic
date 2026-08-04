"use client";

import { format, parseISO } from "date-fns";
import { CalendarDays, Clock, Stethoscope, UserRound } from "lucide-react";

import { formatAED } from "@/lib/utils";
import type { ClinicService, Doctor, Specialty } from "@/types";

/** The running receipt beside the wizard: what has been chosen so far. */
export function BookingSummary({
  specialty,
  service,
  doctor,
  startsAt,
}: {
  specialty: Specialty | undefined;
  service: ClinicService | undefined;
  doctor: Doctor | undefined;
  startsAt: string;
}) {
  const rows = [
    {
      icon: Stethoscope,
      label: "Department",
      value: specialty?.name ?? "Not chosen yet",
      muted: !specialty,
    },
    {
      icon: Clock,
      label: "Appointment",
      value: service
        ? `${service.name} · ${service.durationMinutes} min`
        : "Not chosen yet",
      muted: !service,
    },
    {
      icon: UserRound,
      label: "Doctor",
      value: doctor?.name ?? "Not chosen yet",
      muted: !doctor,
    },
    {
      icon: CalendarDays,
      label: "Date and time",
      value: startsAt
        ? format(parseISO(startsAt), "EEEE d MMMM, h:mm a")
        : "Not chosen yet",
      muted: !startsAt,
    },
  ];

  return (
    <aside className="rounded-xl border border-border bg-surface p-5 lg:sticky lg:top-28">
      <h2 className="font-display text-sm font-semibold uppercase tracking-[0.1em] text-stone-500">
        Your appointment
      </h2>

      <dl className="mt-5 space-y-4">
        {rows.map((row) => (
          <div key={row.label} className="flex gap-3">
            <row.icon
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-stone-400"
            />
            <div className="min-w-0">
              <dt className="text-xs text-stone-500">{row.label}</dt>
              <dd
                className={
                  row.muted
                    ? "text-sm text-stone-400"
                    : "text-sm font-medium text-stone-900"
                }
              >
                {row.value}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      {service ? (
        <div className="mt-6 flex items-baseline justify-between border-t border-border pt-4">
          <span className="text-sm text-stone-600">Fee</span>
          <span
            data-numeric
            className="font-display text-xl font-semibold text-stone-900"
          >
            {formatAED(service.priceAED)}
          </span>
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-stone-500">
        Nothing is charged now. Insured patients pay their co-payment at the
        desk once cover is confirmed.
      </p>
    </aside>
  );
}
