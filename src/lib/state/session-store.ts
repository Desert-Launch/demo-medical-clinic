"use client";

import { create } from "zustand";

/**
 * Cross-cutting client state. The demo has no auth server, so the "signed-in"
 * staff member is simply whoever the viewer picks from the admin topbar.
 */

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  /** Doctor id when this staff member is also a clinician. */
  doctorId?: string;
}

export const staffDirectory: StaffMember[] = [
  {
    id: "stf_reception",
    name: "Receptionist 1",
    role: "Front desk lead",
  },
  {
    id: "stf_manager",
    name: "Manager 1",
    role: "Clinic manager",
  },
  {
    id: "stf_mansoori",
    name: "Doctor 1",
    role: "Consultant, family medicine",
    doctorId: "doc_almansoori",
  },
  {
    id: "stf_alshamsi",
    name: "Doctor 8",
    role: "Consultant, cardiology",
    doctorId: "doc_alshamsi",
  },
];

interface SessionState {
  staff: StaffMember;
  sidebarOpen: boolean;
  setStaff: (staffId: string) => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  staff: staffDirectory[0],
  sidebarOpen: false,
  setStaff: (staffId) =>
    set((state) => ({
      staff: staffDirectory.find((item) => item.id === staffId) ?? state.staff,
    })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
