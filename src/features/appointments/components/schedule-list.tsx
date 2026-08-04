"use client";

import { format, parseISO } from "date-fns";
import { CalendarDays } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/features/appointments/components/status-badge";
import { patientFullName, type AppointmentWithRelations } from "@/types";

export function ScheduleList({
  appointments,
  emptyTitle,
  emptyDescription,
  showDate = false,
}: {
  appointments: AppointmentWithRelations[];
  emptyTitle: string;
  emptyDescription: string;
  showDate?: boolean;
}) {
  if (appointments.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title={emptyTitle}
        description={emptyDescription}
        className="border-0 bg-transparent py-10"
      />
    );
  }

  return (
    <ul className="divide-y divide-border">
      {appointments.map((appointment) => {
        const startsAt = parseISO(appointment.startsAt);
        return (
          <li
            key={appointment.id}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3.5"
          >
            <span
              data-numeric
              className="w-20 shrink-0 font-mono text-sm font-medium text-stone-900"
            >
              {format(startsAt, "h:mm a")}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium text-stone-900">
                {patientFullName(appointment.patient)}
              </span>
              <span className="block text-sm leading-snug text-stone-500">
                {showDate ? `${format(startsAt, "EEE d MMM")} · ` : ""}
                {appointment.service.name} · {appointment.doctor.name}
              </span>
            </span>
            <StatusBadge status={appointment.status} />
          </li>
        );
      })}
    </ul>
  );
}
