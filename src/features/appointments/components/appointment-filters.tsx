"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ALL_VALUE,
  emptyAppointmentFilters,
  type AppointmentFilterValues,
} from "@/features/appointments/schema";
import { useDoctors } from "@/features/doctors";
import { useSpecialties } from "@/features/specialties";
import { cn } from "@/lib/utils";
import {
  appointmentStatusLabels,
  appointmentStatuses,
  type AppointmentStatus,
} from "@/types";

export function AppointmentFilters({
  value,
  onChange,
}: {
  value: AppointmentFilterValues;
  onChange: (next: AppointmentFilterValues) => void;
}) {
  const { data: specialties } = useSpecialties();
  const { data: doctors } = useDoctors(
    value.specialtyId === ALL_VALUE ? {} : { specialtyId: value.specialtyId },
  );

  const dirty =
    JSON.stringify(value) !== JSON.stringify(emptyAppointmentFilters);

  function toggleStatus(status: AppointmentStatus) {
    const statuses = value.statuses.includes(status)
      ? value.statuses.filter((item) => item !== status)
      : [...value.statuses, status];
    onChange({ ...value, statuses });
  }

  return (
    <div className="space-y-5 rounded-xl border border-border bg-surface p-5">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_auto_auto]">
        <div className="space-y-2">
          <Label htmlFor="appointment-search">Search</Label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400"
            />
            <Input
              id="appointment-search"
              value={value.search}
              onChange={(event) =>
                onChange({ ...value, search: event.target.value })
              }
              placeholder="Patient, reference or reason"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="appointment-specialty">Department</Label>
          <Select
            value={value.specialtyId}
            onValueChange={(specialtyId) =>
              onChange({ ...value, specialtyId, doctorId: ALL_VALUE })
            }
          >
            <SelectTrigger id="appointment-specialty" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>All departments</SelectItem>
              {specialties?.map((specialty) => (
                <SelectItem key={specialty.id} value={specialty.id}>
                  {specialty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="appointment-doctor">Doctor</Label>
          <Select
            value={value.doctorId}
            onValueChange={(doctorId) => onChange({ ...value, doctorId })}
          >
            <SelectTrigger id="appointment-doctor" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>All doctors</SelectItem>
              {doctors?.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="appointment-from">From</Label>
          <Input
            id="appointment-from"
            type="date"
            value={value.from}
            onChange={(event) =>
              onChange({ ...value, from: event.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="appointment-to">To</Label>
          <Input
            id="appointment-to"
            type="date"
            value={value.to}
            onChange={(event) => onChange({ ...value, to: event.target.value })}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-medium text-stone-600">Status</span>
        {appointmentStatuses.map((status) => {
          const active = value.statuses.includes(status);
          return (
            <button
              key={status}
              type="button"
              aria-pressed={active}
              onClick={() => toggleStatus(status)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                active
                  ? "border-lapis-600 bg-lapis-700 text-stone-0"
                  : "border-border bg-surface text-stone-600 hover:border-lapis-300 hover:text-stone-900",
              )}
            >
              {appointmentStatusLabels[status]}
            </button>
          );
        })}

        {dirty ? (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={() => onChange(emptyAppointmentFilters)}
          >
            <X className="size-4" />
            Clear filters
          </Button>
        ) : null}
      </div>
    </div>
  );
}
