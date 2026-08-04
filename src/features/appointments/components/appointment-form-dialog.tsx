"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  appointmentFormSchema,
  type AppointmentFormValues,
} from "@/features/appointments/schema";
import {
  useCreateAppointment,
  useUpdateAppointment,
} from "@/features/appointments";
import { SlotPicker } from "@/features/booking/components/slot-picker";
import { useDoctors } from "@/features/doctors";
import { usePatients } from "@/features/patients";
import { useSpecialties } from "@/features/specialties";
import {
  appointmentStatusLabels,
  appointmentStatuses,
  bookingChannelLabels,
  bookingChannels,
  patientFullName,
  type AppointmentWithRelations,
} from "@/types";

const blankValues: AppointmentFormValues = {
  patientId: "",
  specialtyId: "",
  doctorId: "",
  serviceId: "",
  startsAt: "",
  status: "scheduled",
  channel: "phone",
  reason: "",
  notes: "",
};

export function AppointmentFormDialog({
  open,
  onOpenChange,
  appointment,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Null opens the dialog in create mode. */
  appointment: AppointmentWithRelations | null;
}) {
  const isEdit = appointment !== null;

  const { data: patients } = usePatients();
  const { data: specialties } = useSpecialties();
  const create = useCreateAppointment();
  const update = useUpdateAppointment();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: blankValues,
  });

  const specialtyId = form.watch("specialtyId");
  const doctorId = form.watch("doctorId");
  const serviceId = form.watch("serviceId");
  const startsAt = form.watch("startsAt");

  const { data: doctors } = useDoctors(
    specialtyId ? { specialtyId } : { specialtyId: "none" },
  );
  const specialty = specialties?.find((item) => item.id === specialtyId);
  const service = specialty?.services.find((item) => item.id === serviceId);

  // Reset the form each time the dialog opens so an edit never inherits the
  // previous row's values.
  useEffect(() => {
    if (!open) return;
    form.reset(
      appointment
        ? {
            patientId: appointment.patientId,
            specialtyId: appointment.specialtyId,
            doctorId: appointment.doctorId,
            serviceId: appointment.serviceId,
            startsAt: appointment.startsAt,
            status: appointment.status,
            channel: appointment.channel,
            reason: appointment.reason,
            notes: appointment.notes,
          }
        : blankValues,
    );
  }, [appointment, form, open]);

  const pending = create.isPending || update.isPending;

  function submit(values: AppointmentFormValues) {
    if (isEdit && appointment) {
      update.mutate(
        {
          id: appointment.id,
          input: {
            doctorId: values.doctorId,
            serviceId: values.serviceId,
            startsAt: values.startsAt,
            status: values.status,
            reason: values.reason,
            notes: values.notes,
          },
        },
        { onSuccess: () => onOpenChange(false) },
      );
      return;
    }

    create.mutate(
      {
        patientId: values.patientId,
        doctorId: values.doctorId,
        serviceId: values.serviceId,
        startsAt: values.startsAt,
        status: values.status,
        channel: values.channel,
        reason: values.reason,
        notes: values.notes,
      },
      { onSuccess: () => onOpenChange(false) },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit appointment" : "Book an appointment"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? `Reference ${appointment.reference} · ${patientFullName(appointment.patient)}`
              : "For phone and walk-in bookings taken at the desk."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(submit)}
            className="space-y-6"
          >
            {!isEdit ? (
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose a patient" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {patients?.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patientFullName(patient)} · {patient.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      New patient? Add them on the patients page first.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="specialtyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(next) => {
                        field.onChange(next);
                        form.setValue("doctorId", "");
                        form.setValue("serviceId", "");
                        form.setValue("startsAt", "");
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {specialties?.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment type</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(next) => {
                        field.onChange(next);
                        form.setValue("startsAt", "");
                      }}
                      disabled={!specialty}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {specialty?.services.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} · {item.durationMinutes} min
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="doctorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(next) => {
                        field.onChange(next);
                        form.setValue("startsAt", "");
                      }}
                      disabled={!specialty}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose a doctor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {doctors?.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {appointmentStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {appointmentStatusLabels[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isEdit ? (
                <FormField
                  control={form.control}
                  name="channel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booked through</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {bookingChannels.map((channel) => (
                            <SelectItem key={channel} value={channel}>
                              {bookingChannelLabels[channel]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
            </div>

            <FormField
              control={form.control}
              name="startsAt"
              render={() => (
                <FormItem>
                  <FormLabel>Date and time</FormLabel>
                  {doctorId && service ? (
                    <SlotPicker
                      doctorId={doctorId}
                      durationMinutes={service.durationMinutes}
                      value={startsAt}
                      onChange={(next) =>
                        form.setValue("startsAt", next, {
                          shouldValidate: true,
                        })
                      }
                      ignoreAppointmentId={appointment?.id}
                    />
                  ) : (
                    <p className="rounded-xl border border-dashed border-border-strong p-6 text-sm text-stone-500">
                      Choose a department, appointment type and doctor first —
                      the diary depends on all three.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for visit</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} />
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
                  <FormLabel>Front-desk notes</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={2}
                      placeholder="Optional — anything the desk should know."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending
                  ? "Saving…"
                  : isEdit
                    ? "Save changes"
                    : "Book appointment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
