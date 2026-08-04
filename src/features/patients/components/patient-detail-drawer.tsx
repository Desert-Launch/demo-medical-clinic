"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format, parseISO } from "date-fns";
import { CalendarDays, Mail, Phone, ShieldCheck, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/features/appointments/components/status-badge";
import {
  patientRecordSchema,
  usePatient,
  useUpdatePatient,
  type PatientRecordValues,
} from "@/features/patients";
import { patientAge } from "@/lib/store";
import { formatAED, initials } from "@/lib/utils";
import { patientFullName, patientGenderLabels } from "@/types";

export function PatientDetailDrawer({
  patientId,
  onOpenChange,
}: {
  patientId: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: patient, isPending } = usePatient(patientId);
  const update = useUpdatePatient();

  const form = useForm<PatientRecordValues>({
    resolver: zodResolver(patientRecordSchema),
    defaultValues: { allergies: "", notes: "" },
  });

  useEffect(() => {
    if (!patient) return;
    form.reset({ allergies: patient.allergies, notes: patient.notes });
  }, [form, patient]);

  return (
    <Sheet open={patientId !== null} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto p-0 sm:max-w-xl"
      >
        {isPending || !patient ? (
          <div className="space-y-4 p-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <>
            <SheetHeader className="border-b border-border p-6">
              <div className="flex items-center gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-lapis-100 font-display font-semibold text-lapis-800">
                  {initials(patientFullName(patient))}
                </span>
                <div className="min-w-0">
                  <SheetTitle className="truncate text-xl">
                    {patientFullName(patient)}
                  </SheetTitle>
                  <SheetDescription>
                    {patientAge(patient.dateOfBirth) ?? "—"} years ·{" "}
                    {patientGenderLabels[patient.gender]} · Registered{" "}
                    {format(parseISO(patient.createdAt), "MMM yyyy")}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="space-y-8 p-6">
              {patient.allergies ? (
                <p className="flex items-start gap-3 rounded-xl border border-danger-100 bg-danger-50 p-4 text-sm text-stone-800">
                  <TriangleAlert
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-danger-700"
                  />
                  <span>
                    <span className="font-semibold">Allergies:</span>{" "}
                    {patient.allergies}
                  </span>
                </p>
              ) : null}

              <section>
                <h3 className="eyebrow text-stone-500">Contact</h3>
                <dl className="mt-3 space-y-2.5 text-sm">
                  <div className="flex items-center gap-2.5">
                    <Phone
                      aria-hidden="true"
                      className="size-4 shrink-0 text-stone-400"
                    />
                    <dt className="sr-only">Phone</dt>
                    <dd className="text-stone-800">{patient.phone}</dd>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail
                      aria-hidden="true"
                      className="size-4 shrink-0 text-stone-400"
                    />
                    <dt className="sr-only">Email</dt>
                    <dd className="truncate text-stone-800">{patient.email}</dd>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck
                      aria-hidden="true"
                      className="size-4 shrink-0 text-stone-400"
                    />
                    <dt className="sr-only">Insurance</dt>
                    <dd className="text-stone-800">
                      {patient.insurer
                        ? `${patient.insurer} · ${patient.insuranceMemberId ?? "no membership number"}`
                        : "Self-paying"}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="grid grid-cols-3 gap-3">
                <Stat label="Visits" value={String(patient.visitCount)} />
                <Stat
                  label="Billed"
                  value={formatAED(patient.totalBilledAED)}
                />
                <Stat
                  label="Next visit"
                  value={
                    patient.nextVisitAt
                      ? format(parseISO(patient.nextVisitAt), "d MMM")
                      : "None"
                  }
                />
              </section>

              <section>
                <h3 className="eyebrow text-stone-500">
                  Allergies and clinical notes
                </h3>
                <Form {...form}>
                  <form
                    noValidate
                    onSubmit={form.handleSubmit((values) =>
                      update.mutate({ id: patient.id, input: values }),
                    )}
                    className="mt-3 space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="allergies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Allergies</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={2}
                              placeholder="None recorded"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="Anything the next clinician should know."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={update.isPending || !form.formState.isDirty}
                    >
                      {update.isPending ? "Saving…" : "Save record"}
                    </Button>
                  </form>
                </Form>
              </section>

              <section>
                <h3 className="eyebrow text-stone-500">Visit history</h3>
                {patient.appointments.length === 0 ? (
                  <p className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-border-strong p-5 text-sm text-stone-500">
                    <CalendarDays aria-hidden="true" className="size-4" />
                    No appointments yet.
                  </p>
                ) : (
                  <ul className="mt-3 divide-y divide-border">
                    {patient.appointments.map((appointment) => (
                      <li key={appointment.id} className="py-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-medium text-stone-900">
                            {format(
                              parseISO(appointment.startsAt),
                              "d MMM yyyy, h:mm a",
                            )}
                          </p>
                          <StatusBadge status={appointment.status} />
                        </div>
                        <p className="mt-0.5 text-sm text-stone-600">
                          {appointment.service.name} · {appointment.doctor.name}
                        </p>
                        {appointment.reason ? (
                          <p className="mt-1 text-sm text-stone-500">
                            {appointment.reason}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-stone-25 p-3">
      <p className="text-xs text-stone-500">{label}</p>
      <p
        data-numeric
        className="mt-1 font-display text-lg font-semibold text-stone-900"
      >
        {value}
      </p>
    </div>
  );
}
