"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createPatientRecord,
  deletePatientRecord,
  fetchPatient,
  fetchPatients,
  updatePatientRecord,
} from "@/features/patients/api";
import { queryKeys } from "@/lib/query-client";
import type { PatientFilters, PatientInput } from "@/lib/store";
import { patientFullName } from "@/types";

export function usePatients(filters: PatientFilters = {}) {
  return useQuery({
    queryKey: queryKeys.patients.list(filters),
    queryFn: () => fetchPatients(filters),
  });
}

export function usePatient(id: string | null) {
  return useQuery({
    queryKey: queryKeys.patients.detail(id ?? ""),
    queryFn: () => fetchPatient(id as string),
    enabled: Boolean(id),
  });
}

/** Patients and appointments are joined on read, so both caches are refreshed
 *  after any write rather than only the one that changed. */
function useInvalidatePatientData() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.patients.all });
    void queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
  };
}

export function useCreatePatient() {
  const invalidate = useInvalidatePatientData();
  return useMutation({
    mutationFn: (input: PatientInput) => createPatientRecord(input),
    onSuccess: (patient) => {
      invalidate();
      toast.success(`${patientFullName(patient)} added to the patient list.`);
    },
    onError: (error: Error) => {
      toast.error("Patient not added", { description: error.message });
    },
  });
}

export function useUpdatePatient() {
  const invalidate = useInvalidatePatientData();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<PatientInput> }) =>
      updatePatientRecord(id, input),
    onSuccess: (patient) => {
      invalidate();
      toast.success(`${patientFullName(patient)}’s record updated.`);
    },
    onError: (error: Error) => {
      toast.error("Changes not saved", { description: error.message });
    },
  });
}

export function useDeletePatient() {
  const invalidate = useInvalidatePatientData();
  return useMutation({
    mutationFn: (id: string) => deletePatientRecord(id),
    onSuccess: () => {
      invalidate();
      toast.success("Patient record deleted.");
    },
    onError: (error: Error) => {
      toast.error("Record not deleted", { description: error.message });
    },
  });
}
