"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import {
  CircleAlert,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  UserPlus,
  UsersRound,
} from "lucide-react";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PatientDetailDrawer } from "@/features/patients/components/patient-detail-drawer";
import { PatientFormDialog } from "@/features/patients/components/patient-form-dialog";
import { useDeletePatient, usePatients } from "@/features/patients";
import { patientAge } from "@/lib/store";
import { site } from "@/lib/site";
import { initials } from "@/lib/utils";
import { patientFullName, type PatientWithHistory } from "@/types";

const ALL = "all";

export function PatientsBoard() {
  const [search, setSearch] = useState("");
  const [insurer, setInsurer] = useState<string>(ALL);
  const [openPatientId, setOpenPatientId] = useState<string | null>(null);
  const [editing, setEditing] = useState<PatientWithHistory | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] =
    useState<PatientWithHistory | null>(null);

  const { data, isPending, isError } = usePatients({
    search: search.trim() || undefined,
    insurer: insurer === ALL ? undefined : insurer,
  });
  const remove = useDeletePatient();

  const filtersApplied = search.trim().length > 0 || insurer !== ALL;

  const columns = useMemo<ColumnDef<PatientWithHistory, unknown>[]>(
    () => [
      {
        id: "name",
        header: "Patient",
        accessorFn: (row) => patientFullName(row),
        cell: ({ row }) => {
          const patient = row.original;
          const age = patientAge(patient.dateOfBirth);
          return (
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-lapis-100 text-xs font-semibold text-lapis-800">
                {initials(patientFullName(patient))}
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium text-stone-900">
                  {patientFullName(patient)}
                </p>
                <p className="text-xs text-stone-500">
                  {age === null ? "—" : `${age} years`}
                  {patient.allergies ? " · allergies on file" : ""}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        id: "contact",
        header: "Contact",
        accessorFn: (row) => row.phone,
        cell: ({ row }) => (
          <div className="min-w-44">
            <p className="text-stone-800">{row.original.phone}</p>
            <p className="truncate text-xs text-stone-500">
              {row.original.email}
            </p>
          </div>
        ),
      },
      {
        id: "insurer",
        header: "Insurance",
        accessorFn: (row) => row.insurer ?? "Self-paying",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-stone-700">
            {row.original.insurer ?? "Self-paying"}
          </span>
        ),
      },
      {
        id: "visits",
        header: "Visits",
        accessorFn: (row) => row.visitCount,
        cell: ({ row }) => (
          <span data-numeric className="text-stone-700">
            {row.original.visitCount}
          </span>
        ),
      },
      {
        id: "lastVisit",
        header: "Last visit",
        accessorFn: (row) => row.lastVisitAt ?? "",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-stone-600">
            {row.original.lastVisitAt
              ? format(parseISO(row.original.lastVisitAt), "d MMM yyyy")
              : "—"}
          </span>
        ),
      },
      {
        id: "nextVisit",
        header: "Next visit",
        accessorFn: (row) => row.nextVisitAt ?? "",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-stone-600">
            {row.original.nextVisitAt
              ? format(parseISO(row.original.nextVisitAt), "d MMM yyyy")
              : "—"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => {
          const patient = row.original;
          return (
            <div
              className="flex justify-end"
              onClick={(event) => event.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Actions for ${patientFullName(patient)}`}
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onSelect={() => setOpenPatientId(patient.id)}
                  >
                    <UsersRound className="size-4" />
                    Open record
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setEditing(patient);
                      setFormOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                    Edit details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => setPendingDelete(patient)}
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
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl">Patient list</h2>
          <p className="mt-1 text-stone-600">
            One record per person, shared by every department. Open a row to see
            their history.
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <UserPlus className="size-4" />
          Add patient
        </Button>
      </div>

      <div className="grid gap-4 rounded-xl border border-border bg-surface p-5 sm:grid-cols-[1.6fr_1fr]">
        <div className="space-y-2">
          <Label htmlFor="patient-search">Search</Label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400"
            />
            <Input
              id="patient-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, email or phone"
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="patient-insurer">Insurer</Label>
          <Select value={insurer} onValueChange={setInsurer}>
            <SelectTrigger id="patient-insurer" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All patients</SelectItem>
              {site.insurers.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isError ? (
        <EmptyState
          icon={CircleAlert}
          title="The patient list did not load"
          description="Refresh the page to try again."
        />
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          isLoading={isPending}
          getRowId={(row) => row.id}
          onRowClick={(row) => setOpenPatientId(row.id)}
          caption="Patients, with contact details, insurer and visit history"
          itemNoun="patient"
          pageSize={10}
          empty={
            <EmptyState
              icon={UsersRound}
              title={
                filtersApplied ? "No patients match that search" : "No patients yet"
              }
              description={
                filtersApplied
                  ? "Try a different spelling, or clear the insurer filter."
                  : "Add the first record, or wait for a booking to come in through the website."
              }
              action={
                filtersApplied ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearch("");
                      setInsurer(ALL);
                    }}
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
                    Add patient
                  </Button>
                )
              }
            />
          }
        />
      )}

      <PatientDetailDrawer
        patientId={openPatientId}
        onOpenChange={(open) => {
          if (!open) setOpenPatientId(null);
        }}
      />

      <PatientFormDialog
        open={formOpen}
        onOpenChange={(next) => {
          setFormOpen(next);
          if (!next) setEditing(null);
        }}
        patient={editing}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(next) => {
          if (!next) setPendingDelete(null);
        }}
        title="Delete this patient record?"
        description={
          pendingDelete ? (
            <>
              {patientFullName(pendingDelete)}’s record and their{" "}
              {pendingDelete.appointments.length} appointment
              {pendingDelete.appointments.length === 1 ? "" : "s"} are removed.
              Records with an upcoming appointment cannot be deleted — cancel it
              first.
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
