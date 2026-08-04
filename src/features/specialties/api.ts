import {
  getServiceById,
  getSpecialtyById,
  getSpecialtyBySlug,
  listSpecialties,
  sleep,
} from "@/lib/store";
import type { ClinicService, Specialty } from "@/types";

const LATENCY_MS = 120;

export async function fetchSpecialties(): Promise<Specialty[]> {
  await sleep(LATENCY_MS);
  return listSpecialties();
}

export async function fetchSpecialtyBySlug(slug: string): Promise<Specialty> {
  await sleep(LATENCY_MS);
  const specialty = getSpecialtyBySlug(slug);
  if (!specialty) throw new Error("We could not find that department.");
  return specialty;
}

export async function fetchSpecialty(id: string): Promise<Specialty> {
  await sleep(LATENCY_MS);
  const specialty = getSpecialtyById(id);
  if (!specialty) throw new Error("We could not find that department.");
  return specialty;
}

/**
 * Departments are fixed for the life of the app, so route generation and page
 * metadata read them synchronously rather than through the query layer.
 */
export function listSpecialtyRoutes(): Array<{
  slug: string;
  name: string;
  summary: string;
}> {
  return listSpecialties().map(({ slug, name, summary }) => ({
    slug,
    name,
    summary,
  }));
}

export async function fetchService(id: string): Promise<ClinicService> {
  await sleep(LATENCY_MS);
  const service = getServiceById(id);
  if (!service) throw new Error("We could not find that appointment type.");
  return service;
}
