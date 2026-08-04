import {
  findFirstAvailableInSpecialty,
  findNextAvailableSlot,
  getDoctorById,
  listAvailability,
  listDoctors,
  sleep,
  type AvailabilityQuery,
  type DoctorFilters,
} from "@/lib/store";
import type { DaySlots, Doctor, Slot } from "@/types";

const LATENCY_MS = 120;

export async function fetchDoctors(
  filters: DoctorFilters = {},
): Promise<Doctor[]> {
  await sleep(LATENCY_MS);
  return listDoctors(filters);
}

export async function fetchDoctor(id: string): Promise<Doctor> {
  await sleep(LATENCY_MS);
  const doctor = getDoctorById(id);
  if (!doctor) throw new Error("We could not find that doctor.");
  return doctor;
}

/**
 * The roster is fixed for the life of the app, so route generation and page
 * metadata read it synchronously rather than through the query layer.
 */
export function listDoctorRoutes(): Array<{
  id: string;
  name: string;
  focus: string;
}> {
  return listDoctors().map(({ id, name, focus }) => ({ id, name, focus }));
}

export async function fetchAvailability(
  query: AvailabilityQuery,
): Promise<DaySlots[]> {
  await sleep(LATENCY_MS);
  return listAvailability(query);
}

export async function fetchNextAvailableSlot(
  doctorId: string,
  durationMinutes: number,
): Promise<Slot | null> {
  await sleep(LATENCY_MS);
  return findNextAvailableSlot(doctorId, durationMinutes);
}

export async function fetchFirstAvailableInSpecialty(
  specialtyId: string,
  durationMinutes: number,
): Promise<{ doctorId: string; slot: Slot } | null> {
  await sleep(LATENCY_MS);
  return findFirstAvailableInSpecialty(specialtyId, durationMinutes);
}
