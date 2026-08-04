import {
  createPatient,
  deletePatient,
  getPatientById,
  listPatients,
  sleep,
  updatePatient,
  type PatientFilters,
  type PatientInput,
} from "@/lib/store";
import type { PatientWithHistory } from "@/types";

const LATENCY_MS = 120;
const WRITE_LATENCY_MS = 260;

export async function fetchPatients(
  filters: PatientFilters = {},
): Promise<PatientWithHistory[]> {
  await sleep(LATENCY_MS);
  return listPatients(filters);
}

export async function fetchPatient(id: string): Promise<PatientWithHistory> {
  await sleep(LATENCY_MS);
  const patient = getPatientById(id);
  if (!patient) throw new Error("We could not find that patient record.");
  return patient;
}

export async function createPatientRecord(
  input: PatientInput,
): Promise<PatientWithHistory> {
  await sleep(WRITE_LATENCY_MS);
  return createPatient(input);
}

export async function updatePatientRecord(
  id: string,
  input: Partial<PatientInput>,
): Promise<PatientWithHistory> {
  await sleep(WRITE_LATENCY_MS);
  return updatePatient(id, input);
}

export async function deletePatientRecord(id: string): Promise<void> {
  await sleep(WRITE_LATENCY_MS);
  deletePatient(id);
}
