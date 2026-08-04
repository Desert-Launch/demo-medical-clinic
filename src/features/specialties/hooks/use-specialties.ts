"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchSpecialties,
  fetchSpecialtyBySlug,
} from "@/features/specialties/api";
import { queryKeys } from "@/lib/query-client";

export function useSpecialties() {
  return useQuery({
    queryKey: queryKeys.specialties.list(),
    queryFn: fetchSpecialties,
  });
}

export function useSpecialty(slug: string) {
  return useQuery({
    queryKey: queryKeys.specialties.detail(slug),
    queryFn: () => fetchSpecialtyBySlug(slug),
    enabled: slug.length > 0,
  });
}
