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
    name: "Huda Al Ali",
    role: "Front desk lead",
  },
  {
    id: "stf_manager",
    name: "Peter Ndiaye",
    role: "Clinic manager",
  },
  {
    id: "stf_mansoori",
    name: "Dr. Layla Al Mansoori",
    role: "Consultant, family medicine",
    doctorId: "doc_almansoori",
  },
  {
    id: "stf_alshamsi",
    name: "Dr. Omar Al Shamsi",
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
