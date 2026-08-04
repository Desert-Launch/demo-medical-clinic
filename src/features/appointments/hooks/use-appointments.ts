"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  cancelAppointmentRecord,
  createAppointmentRecord,
  deleteAppointmentRecord,
  fetchAppointments,
  fetchClinicOverview,
  updateAppointmentRecord,
} from "@/features/appointments/api";
import { queryKeys } from "@/lib/query-client";
import type {
  AppointmentFilters,
  AppointmentInput,
  AppointmentUpdate,
} from "@/lib/store";
import { patientFullName, type AppointmentWithRelations } from "@/types";

export function useAppointments(filters: AppointmentFilters = {}) {
  return useQuery({
    queryKey: queryKeys.appointments.list(filters),
    queryFn: () => fetchAppointments(filters),
  });
}

export function useClinicOverview() {
  return useQuery({
    queryKey: queryKeys.appointments.overview(),
    queryFn: fetchClinicOverview,
  });
}

/** Appointment writes change patient history too, so both caches are refreshed. */
function useInvalidateAppointmentData() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({
      queryKey: queryKeys.appointments.all,
    });
    void queryClient.invalidateQueries({ queryKey: queryKeys.patients.all });
    void queryClient.invalidateQueries({ queryKey: queryKeys.doctors.all });
  };
}

export function useCreateAppointment() {
  const invalidate = useInvalidateAppointmentData();
  return useMutation({
    mutationFn: (input: AppointmentInput) => createAppointmentRecord(input),
    onSuccess: (appointment) => {
      invalidate();
      toast.success(
        `Booked ${patientFullName(appointment.patient)} with ${appointment.doctor.name}.`,
        { description: `Reference ${appointment.reference}` },
      );
    },
    onError: (error: Error) => {
      toast.error("Appointment not booked", { description: error.message });
    },
  });
}

export function useUpdateAppointment() {
  const invalidate = useInvalidateAppointmentData();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: AppointmentUpdate }) =>
      updateAppointmentRecord(id, input),
    onSuccess: (appointment) => {
      invalidate();
      toast.success(
        `${patientFullName(appointment.patient)}’s appointment updated.`,
      );
    },
    onError: (error: Error) => {
      toast.error("Changes not saved", { description: error.message });
    },
  });
}

export function useDeleteAppointment() {
  const invalidate = useInvalidateAppointmentData();
  return useMutation({
    mutationFn: (id: string) => deleteAppointmentRecord(id),
    onSuccess: () => {
      invalidate();
      toast.success("Appointment deleted.");
    },
    onError: (error: Error) => {
      toast.error("Appointment not deleted", { description: error.message });
    },
  });
}

type AppointmentListCache = [
  readonly unknown[],
  AppointmentWithRelations[] | undefined,
][];

/**
 * Cancelling is the one action staff take mid-call, so it updates the table
 * immediately and reconciles afterwards. The API fails roughly one attempt in
 * ten, which rolls every touched list back to its previous contents.
 */
export function useCancelAppointment() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateAppointmentData();

  return useMutation({
    mutationFn: (appointment: AppointmentWithRelations) =>
      cancelAppointmentRecord(appointment.id),

    onMutate: async (appointment) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.appointments.all });

      const previous = queryClient.getQueriesData<AppointmentWithRelations[]>({
        queryKey: queryKeys.appointments.all,
      }) as AppointmentListCache;

      for (const [key, value] of previous) {
        if (!Array.isArray(value)) continue;
        queryClient.setQueryData<AppointmentWithRelations[]>(
          key,
          value.map((item) =>
            item.id === appointment.id
              ? { ...item, status: "cancelled" as const }
              : item,
          ),
        );
      }

      return { previous };
    },

    onError: (error: Error, appointment, context) => {
      for (const [key, value] of context?.previous ?? []) {
        queryClient.setQueryData(key, value);
      }
      toast.error(
        `${patientFullName(appointment.patient)}’s appointment is still booked`,
        { description: error.message },
      );
    },

    onSuccess: (_result, appointment) => {
      toast.success(
        `Cancelled ${patientFullName(appointment.patient)}’s appointment.`,
        { description: `Reference ${appointment.reference}` },
      );
    },

    onSettled: () => {
      invalidate();
    },
  });
}
