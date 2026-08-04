"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchAvailability,
  fetchDoctor,
  fetchDoctors,
  fetchNextAvailableSlot,
} from "@/features/doctors/api";
import { queryKeys } from "@/lib/query-client";
import type { AvailabilityQuery, DoctorFilters } from "@/lib/store";

export function useDoctors(filters: DoctorFilters = {}) {
  return useQuery({
    queryKey: queryKeys.doctors.list(filters),
    queryFn: () => fetchDoctors(filters),
  });
}

export function useDoctor(id: string) {
  return useQuery({
    queryKey: queryKeys.doctors.detail(id),
    queryFn: () => fetchDoctor(id),
    enabled: id.length > 0,
  });
}

export function useAvailability(query: AvailabilityQuery | null) {
  return useQuery({
    queryKey: queryKeys.doctors.availability(query),
    queryFn: () => fetchAvailability(query as AvailabilityQuery),
    enabled: query !== null && query.doctorId.length > 0,
  });
}

export function useNextAvailableSlot(id: string, durationMinutes: number) {
  return useQuery({
    queryKey: queryKeys.doctors.nextAvailable(id),
    queryFn: () => fetchNextAvailableSlot(id, durationMinutes),
    enabled: id.length > 0,
  });
}
