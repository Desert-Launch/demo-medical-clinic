import { z } from "zod";

import { appointmentStatuses, bookingChannels } from "@/types";

/** The admin create/edit form. Specialty is captured so the doctor and service
 *  lists can be filtered; the store derives it from the service on save. */
export const appointmentFormSchema = z.object({
  patientId: z.string().min(1, "Choose a patient."),
  specialtyId: z.string().min(1, "Choose a department."),
  doctorId: z.string().min(1, "Choose a doctor."),
  serviceId: z.string().min(1, "Choose an appointment type."),
  /** Full ISO datetime of the chosen slot. */
  startsAt: z.string().min(1, "Choose a date and time."),
  status: z.enum(appointmentStatuses),
  channel: z.enum(bookingChannels),
  reason: z
    .string()
    .trim()
    .min(4, "Say why the patient is coming in.")
    .max(280, "Keep the reason under 280 characters."),
  notes: z.string().max(2000, "Keep notes under 2,000 characters."),
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

/** Filter bar state. Kept as a schema so the shape is inferred, not hand-typed. */
export const appointmentFilterSchema = z.object({
  search: z.string(),
  statuses: z.array(z.enum(appointmentStatuses)),
  specialtyId: z.string(),
  doctorId: z.string(),
  from: z.string(),
  to: z.string(),
});

export type AppointmentFilterValues = z.infer<typeof appointmentFilterSchema>;

export const ALL_VALUE = "all";

export const emptyAppointmentFilters: AppointmentFilterValues = {
  search: "",
  statuses: [],
  specialtyId: ALL_VALUE,
  doctorId: ALL_VALUE,
  from: "",
  to: "",
};
