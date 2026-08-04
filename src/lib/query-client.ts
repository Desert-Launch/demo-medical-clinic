import { QueryClient } from "@tanstack/react-query";

/**
 * The store lives in memory, so cached data can never go stale behind our back
 * — a short staleTime keeps skeletons visible on first paint without refetching
 * on every window focus during a demo walkthrough.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/** Query key factory. Every hook builds its key from here so invalidation is
 *  a single, greppable prefix rather than a scattered string literal. */
export const queryKeys = {
  specialties: {
    all: ["specialties"] as const,
    list: () => [...queryKeys.specialties.all, "list"] as const,
    detail: (slug: string) =>
      [...queryKeys.specialties.all, "detail", slug] as const,
  },
  doctors: {
    all: ["doctors"] as const,
    list: (filters?: unknown) =>
      [...queryKeys.doctors.all, "list", filters ?? null] as const,
    detail: (id: string) => [...queryKeys.doctors.all, "detail", id] as const,
    availability: (query: unknown) =>
      [...queryKeys.doctors.all, "availability", query] as const,
    nextAvailable: (id: string) =>
      [...queryKeys.doctors.all, "next-available", id] as const,
  },
  patients: {
    all: ["patients"] as const,
    list: (filters?: unknown) =>
      [...queryKeys.patients.all, "list", filters ?? null] as const,
    detail: (id: string) => [...queryKeys.patients.all, "detail", id] as const,
  },
  appointments: {
    all: ["appointments"] as const,
    list: (filters?: unknown) =>
      [...queryKeys.appointments.all, "list", filters ?? null] as const,
    detail: (id: string) =>
      [...queryKeys.appointments.all, "detail", id] as const,
    overview: () => [...queryKeys.appointments.all, "overview"] as const,
  },
} as const;
