import {
  createAppointment,
  deleteAppointment,
  getAppointmentById,
  getClinicOverview,
  listAppointments,
  sleep,
  updateAppointment,
  type AppointmentFilters,
  type AppointmentInput,
  type AppointmentUpdate,
  type ClinicOverview,
} from "@/lib/store";
import type { AppointmentWithRelations } from "@/types";

const LATENCY_MS = 120;
const WRITE_LATENCY_MS = 260;

/**
 * The demo deliberately fails one cancellation in ten so the optimistic-update
 * rollback path is demonstrable on a sales call rather than theoretical.
 */
const CANCEL_FAILURE_RATE = 0.1;

export async function fetchAppointments(
  filters: AppointmentFilters = {},
): Promise<AppointmentWithRelations[]> {
  await sleep(LATENCY_MS);
  return listAppointments(filters);
}

export async function fetchAppointment(
  id: string,
): Promise<AppointmentWithRelations> {
  await sleep(LATENCY_MS);
  const appointment = getAppointmentById(id);
  if (!appointment) throw new Error("We could not find that appointment.");
  return appointment;
}

export async function fetchClinicOverview(): Promise<ClinicOverview> {
  await sleep(LATENCY_MS);
  return getClinicOverview();
}

export async function createAppointmentRecord(
  input: AppointmentInput,
): Promise<AppointmentWithRelations> {
  await sleep(WRITE_LATENCY_MS);
  return createAppointment(input);
}

export async function updateAppointmentRecord(
  id: string,
  input: AppointmentUpdate,
): Promise<AppointmentWithRelations> {
  await sleep(WRITE_LATENCY_MS);
  return updateAppointment(id, input);
}

export async function deleteAppointmentRecord(id: string): Promise<void> {
  await sleep(WRITE_LATENCY_MS);
  deleteAppointment(id);
}

export async function cancelAppointmentRecord(
  id: string,
): Promise<AppointmentWithRelations> {
  await sleep(WRITE_LATENCY_MS);
  if (Math.random() < CANCEL_FAILURE_RATE) {
    throw new Error(
      "The scheduling service did not respond. Nothing was changed — try cancelling again.",
    );
  }
  return updateAppointment(id, { status: "cancelled" });
}
