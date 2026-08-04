import { toStoredInsurer } from "@/features/patients/schema";
import type { BookingInput } from "@/features/booking/schema";
import {
  createAppointment,
  createPatient,
  findPatientByEmail,
  sleep,
  updatePatient,
} from "@/lib/store";
import type { AppointmentWithRelations } from "@/types";

const WRITE_LATENCY_MS = 320;

export interface BookingResult {
  appointment: AppointmentWithRelations;
  /** Drives the confirmation copy — returning patients see a shorter message. */
  isNewPatient: boolean;
}

/**
 * The public booking path. It resolves the patient record first — an email we
 * already hold reuses the existing chart rather than opening a duplicate — then
 * writes the appointment.
 */
export async function submitBooking(
  input: BookingInput,
): Promise<BookingResult> {
  await sleep(WRITE_LATENCY_MS);

  const { details } = input;
  const insurer = toStoredInsurer(details.insurer);
  const insuranceMemberId = insurer ? details.insuranceMemberId : null;

  const existing = findPatientByEmail(details.email);
  const isNewPatient = existing === null;

  const patient = existing
    ? updatePatient(existing.id, {
        phone: details.phone,
        insurer,
        insuranceMemberId,
      })
    : createPatient({
        firstName: details.firstName,
        lastName: details.lastName,
        email: details.email,
        phone: details.phone,
        dateOfBirth: details.dateOfBirth,
        gender: details.gender,
        insurer,
        insuranceMemberId,
        allergies: "",
        notes: "Registered through the website booking form.",
      });

  const appointment = createAppointment({
    patientId: patient.id,
    doctorId: input.doctorId,
    serviceId: input.serviceId,
    startsAt: input.startsAt,
    status: "scheduled",
    channel: "online",
    reason: details.reason,
  });

  return { appointment, isNewPatient };
}
