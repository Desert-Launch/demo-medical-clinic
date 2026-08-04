"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import {
  Ban,
  CalendarPlus,
  CalendarX,
  Check,
  CircleAlert,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppointmentFilters } from "@/features/appointments/components/appointment-filters";
import { AppointmentFormDialog } from "@/features/appointments/components/appointment-form-dialog";
import { StatusBadge } from "@/features/appointments/components/status-badge";
import {
  ALL_VALUE,
  emptyAppointmentFilters,
  useAppointments,
  useCancelAppointment,
  useDeleteAppointment,
  useUpdateAppointment,
  type AppointmentFilterValues,
} from "@/features/appointments";
import type { AppointmentFilters as StoreFilters } from "@/lib/store";
import { formatAED } from "@/lib/utils";
import { patientFullName, type AppointmentWithRelations } from "@/types";

export function AppointmentsBoard() {
  const [filters, setFilters] = useState<AppointmentFilterValues>(
    emptyAppointmentFilters,
  );
  const [editing, setEditing] = useState<AppointmentWithRelations | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingCancel, setPendingCancel] =
    useState<AppointmentWithRelations | null>(null);
  const [pendingDelete, setPendingDelete] =
    useState<AppointmentWithRelations | null>(null);

  const storeFilters: StoreFilters = useMemo(
    () => ({
      search: filters.search.trim() || undefined,
      statuses: filters.statuses.length > 0 ? filters.statuses : undefined,
      specialtyId:
        filters.specialtyId === ALL_VALUE ? undefined : filters.specialtyId,
      doctorId: filters.doctorId === ALL_VALUE ? undefined : filters.doctorId,
      from: filters.from || undefined,
      to: filters.to || undefined,
    }),
    [filters],
  );

  const { data, isPending, isError } = useAppointments(storeFilters);
  const update = useUpdateAppointment();
  const cancel = useCancelAppointment();
  const remove = useDeleteAppointment();

  const filtersApplied =
    JSON.stringify(filters) !== JSON.stringify(emptyAppointmentFilters);

  const columns = useMemo<ColumnDef<AppointmentWithRelations, unknown>[]>(
    () => [
      {
        id: "when",
        header: "When",
        accessorFn: (row) => row.startsAt,
        cell: ({ row }) => {
          const startsAt = parseISO(row.original.startsAt);
          return (
            <div className="whitespace-nowrap">
              <p className="font-medium text-stone-900">
                {format(startsAt, "EEE d MMM")}
              </p>
              <p
                data-numeric
                className="whitespace-nowrap font-mono text-xs text-stone-500"
              >
                {format(startsAt, "h:mm a")} · {row.original.durationMinutes} min
              </p>
            </div>
          );
        },
      },
      {
        id: "patient",
        header: "Patient",
        accessorFn: (row) => patientFullName(row.patient),
        cell: ({ row }) => (
          <div className="min-w-40">
            <p className="font-medium text-stone-900">
              {patientFullName(row.original.patient)}
            </p>
            <p className="truncate text-xs text-stone-500">
              {row.original.reason}
            </p>
          </div>
        ),
      },
      {
        id: "department",
        header: "Department",
        accessorFn: (row) => row.specialty.name,
        cell: ({ row }) => (
          <div className="min-w-36">
            <p className="text-stone-800">{row.original.specialty.name}</p>
            <p className="truncate text-xs text-stone-500">
              {row.original.service.name}
            </p>
          </div>
        ),
      },
      {
        id: "doctor",
        header: "Doctor",
        accessorFn: (row) => row.doctor.name,
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-stone-800">
            {row.original.doctor.name}
          </span>
        ),
      },
      {
        id: "status",
        header: "Status",
        accessorFn: (row) => row.status,
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "fee",
        header: "Fee",
        accessorFn: (row) => row.feeAED,
        cell: ({ row }) => (
          <span data-numeric className="whitespace-nowrap text-stone-700">
            {formatAED(row.original.feeAED)}
          </span>
        ),
      },
      {
        id: "reference",
        header: "Reference",
        accessorFn: (row) => row.reference,
        cell: ({ row }) => (
          <span className="font-mono text-xs text-stone-500">
            {row.original.reference}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => {
          const appointment = row.original;
          const active =
            appointment.status !== "cancelled" &&
            appointment.status !== "completed";
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Actions for ${patientFullName(appointment.patient)}`}
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem
                    onSelect={() => {
                      setEditing(appointment);
                      setFormOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                    Edit or reschedule
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs font-normal text-stone-500">
                    Change status
                  </DropdownMenuLabel>

                  {appointment.status !== "confirmed" && active ? (
                    <DropdownMenuItem
                      onSelect={() =>
                        update.mutate({
                          id: appointment.id,
                          input: { status: "confirmed" },
                        })
                      }
                    >
                      <Check className="size-4" />
                      Mark confirmed
                    </DropdownMenuItem>
                  ) : null}

                  {appointment.status !== "completed" ? (
                    <DropdownMenuItem
                      onSelect={() =>
                        update.mutate({
                          id: appointment.id,
                          input: { status: "completed" },
                        })
                      }
                    >
                      <Check className="size-4" />
                      Mark completed
                    </DropdownMenuItem>
                  ) : null}

                  {appointment.status !== "no-show" ? (
                    <DropdownMenuItem
                      onSelect={() =>
                        update.mutate({
                          id: appointment.id,
                          input: { status: "no-show" },
                        })
                      }
                    >
                      <Ban className="size-4" />
                      Mark no-show
                    </DropdownMenuItem>
                  ) : null}

                  <DropdownMenuSeparator />

                  {appointment.status !== "cancelled" ? (
                    <DropdownMenuItem
                      onSelect={() => setPendingCancel(appointment)}
                    >
                      <CalendarX className="size-4" />
                      Cancel appointment
                    </DropdownMenuItem>
                  ) : null}

                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => setPendingDelete(appointment)}
                  >
                    <Trash2 className="size-4" />
                    Delete record
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [update],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl">Appointment diary</h2>
          <p className="mt-1 text-stone-600">
            Every booking across the six departments. Changes here show on the
            public site immediately.
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <CalendarPlus className="size-4" />
          Book appointment
        </Button>
      </div>

      <AppointmentFilters value={filters} onChange={setFilters} />

      {isError ? (
        <EmptyState
          icon={CircleAlert}
          title="The diary did not load"
          description="Refresh the page to try again."
        />
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          isLoading={isPending}
          getRowId={(row) => row.id}
          caption="Appointments, with patient, department, doctor and status"
          itemNoun="appointment"
          empty={
            <EmptyState
              icon={CalendarX}
              title={
                filtersApplied
                  ? "No appointments match those filters"
                  : "No appointments yet"
              }
              description={
                filtersApplied
                  ? "Widen the date range or clear a status to see more."
                  : "Book the first one from the button above, or take a booking through the public site."
              }
              action={
                filtersApplied ? (
                  <Button
                    variant="outline"
                    onClick={() => setFilters(emptyAppointmentFilters)}
                  >
                    Clear filters
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setEditing(null);
                      setFormOpen(true);
                    }}
                  >
                    Book appointment
                  </Button>
                )
              }
            />
          }
        />
      )}

      <AppointmentFormDialog
        open={formOpen}
        onOpenChange={(next) => {
          setFormOpen(next);
          if (!next) setEditing(null);
        }}
        appointment={editing}
      />

      <ConfirmDialog
        open={pendingCancel !== null}
        onOpenChange={(next) => {
          if (!next) setPendingCancel(null);
        }}
        title="Cancel this appointment?"
        description={
          pendingCancel ? (
            <>
              {patientFullName(pendingCancel.patient)} with{" "}
              {pendingCancel.doctor.name} on{" "}
              {format(parseISO(pendingCancel.startsAt), "EEEE d MMMM, h:mm a")}.
              The slot is released for someone else.
            </>
          ) : null
        }
        confirmLabel="Cancel appointment"
        cancelLabel="Keep it booked"
        pending={cancel.isPending}
        onConfirm={() => {
          if (!pendingCancel) return;
          cancel.mutate(pendingCancel, {
            onSettled: () => setPendingCancel(null),
          });
        }}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(next) => {
          if (!next) setPendingDelete(null);
        }}
        title="Delete this appointment record?"
        description={
          pendingDelete ? (
            <>
              Reference {pendingDelete.reference} disappears from the diary and
              from {patientFullName(pendingDelete.patient)}’s history. Cancel it
              instead if you want to keep the record.
            </>
          ) : null
        }
        confirmLabel="Delete record"
        pending={remove.isPending}
        onConfirm={() => {
          if (!pendingDelete) return;
          remove.mutate(pendingDelete.id, {
            onSettled: () => setPendingDelete(null),
          });
        }}
      />
    </div>
  );
}
