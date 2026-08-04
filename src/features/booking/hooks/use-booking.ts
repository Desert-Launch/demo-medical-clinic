"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { submitBooking } from "@/features/booking/api";
import type { BookingInput } from "@/features/booking/schema";
import { fetchFirstAvailableInSpecialty } from "@/features/doctors/api";
import { queryKeys } from "@/lib/query-client";

export function useSubmitBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: BookingInput) => submitBooking(input),
    onSuccess: ({ appointment }) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.all,
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.patients.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.doctors.all });
      toast.success("Appointment booked", {
        description: `Reference ${appointment.reference}`,
      });
    },
    onError: (error: Error) => {
      toast.error("We could not hold that slot", { description: error.message });
    },
  });
}

/** Resolves the "whoever is free soonest" option in step two. */
export function useFirstAvailable(
  specialtyId: string,
  durationMinutes: number,
  enabled: boolean,
) {
  return useQuery({
    queryKey: [
      ...queryKeys.doctors.all,
      "first-available",
      specialtyId,
      durationMinutes,
    ],
    queryFn: () =>
      fetchFirstAvailableInSpecialty(specialtyId, durationMinutes),
    enabled: enabled && specialtyId.length > 0 && durationMinutes > 0,
  });
}
