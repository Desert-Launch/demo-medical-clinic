/**
 * Cross-feature entity types. Feature-local input shapes (form values, filter
 * payloads) are derived from zod schemas inside each feature's `schema.ts`.
 */

/* -------------------------------------------------------------------------- */
/* Specialties                                                                 */
/* -------------------------------------------------------------------------- */

/** Icon key resolved to a lucide component by the UI layer. */
export type SpecialtyIcon =
  | "stethoscope"
  | "scan-face"
  | "baby"
  | "heart-pulse"
  | "ear"
  | "activity";

/** A bookable appointment type within a specialty. */
export interface ClinicService {
  id: string;
  name: string;
  /** One patient-facing line. No jargon. */
  summary: string;
  durationMinutes: number;
  priceAED: number;
  /** Qualifier shown beside the price, e.g. "per session". */
  priceNote?: string;
}

export interface Specialty {
  id: string;
  slug: string;
  name: string;
  nameArabic: string;
  icon: SpecialtyIcon;
  /** One line for cards and the wizard. */
  summary: string;
  /** Two or three sentences for the detail page. */
  description: string;
  /** What the department treats — shown as a checklist. */
  treats: string[];
  consultationFeeAED: number;
  services: ClinicService[];
  /** Picks the gradient used for the arch placeholder art. */
  art: 1 | 2 | 3 | 4 | 5 | 6;
}

/* -------------------------------------------------------------------------- */
/* Doctors                                                                     */
/* -------------------------------------------------------------------------- */

export const spokenLanguages = [
  "Arabic",
  "English",
  "Hindi",
  "Urdu",
  "Tagalog",
  "French",
  "Malayalam",
] as const;

export type SpokenLanguage = (typeof spokenLanguages)[number];

/** A doctor's daily shift, in whole hours on a 24-hour clock. */
export interface Shift {
  /** Matches `Date.getDay()` — 0 is Sunday. */
  day: number;
  startHour: number;
  endHour: number;
}

export interface Doctor {
  id: string;
  name: string;
  nameArabic: string;
  title: string;
  credentials: string;
  specialtyId: string;
  /** Sub-focus shown under the name, e.g. "Interventional cardiology". */
  focus: string;
  bio: string;
  languages: SpokenLanguage[];
  yearsExperience: number;
  consultationFeeAED: number;
  shifts: Shift[];
  /** Picks the gradient used for the portrait placeholder. */
  portrait: 1 | 2 | 3 | 4 | 5 | 6;
}

/* -------------------------------------------------------------------------- */
/* Patients                                                                    */
/* -------------------------------------------------------------------------- */

export const patientGenders = ["female", "male", "unspecified"] as const;
export type PatientGender = (typeof patientGenders)[number];

export const patientGenderLabels: Record<PatientGender, string> = {
  female: "Female",
  male: "Male",
  unspecified: "Prefer not to say",
};

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** ISO date, `yyyy-MM-dd`. */
  dateOfBirth: string;
  gender: PatientGender;
  /** Fictional insurer name, or null for self-paying patients. */
  insurer: string | null;
  insuranceMemberId: string | null;
  /** Free text. Empty string means "none recorded", never null. */
  allergies: string;
  notes: string;
  createdAt: string;
}

/* -------------------------------------------------------------------------- */
/* Appointments                                                                */
/* -------------------------------------------------------------------------- */

export const appointmentStatuses = [
  "scheduled",
  "confirmed",
  "completed",
  "cancelled",
  "no-show",
] as const;

export type AppointmentStatus = (typeof appointmentStatuses)[number];

export const appointmentStatusLabels: Record<AppointmentStatus, string> = {
  scheduled: "Scheduled",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  "no-show": "No-show",
};

/** Statuses that still occupy a slot in the doctor's calendar. */
export const blockingStatuses: AppointmentStatus[] = [
  "scheduled",
  "confirmed",
  "completed",
];

export const bookingChannels = ["online", "phone", "walk-in"] as const;
export type BookingChannel = (typeof bookingChannels)[number];

export const bookingChannelLabels: Record<BookingChannel, string> = {
  online: "Online",
  phone: "Phone",
  "walk-in": "Walk-in",
};

export interface Appointment {
  id: string;
  /** Human-readable booking reference, e.g. `AMC-7QK4M`. */
  reference: string;
  patientId: string;
  doctorId: string;
  specialtyId: string;
  serviceId: string;
  /** ISO datetime of the slot start. */
  startsAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
  channel: BookingChannel;
  /** Why the patient is coming in. Shown to the doctor before the visit. */
  reason: string;
  notes: string;
  feeAED: number;
  createdAt: string;
  updatedAt: string;
}

/** An appointment joined with the records the UI always needs alongside it. */
export interface AppointmentWithRelations extends Appointment {
  patient: Patient;
  doctor: Doctor;
  specialty: Specialty;
  service: ClinicService;
}

/** A patient joined with their visit history, newest first. */
export interface PatientWithHistory extends Patient {
  appointments: AppointmentWithRelations[];
  lastVisitAt: string | null;
  nextVisitAt: string | null;
  visitCount: number;
  totalBilledAED: number;
}

/* -------------------------------------------------------------------------- */
/* Scheduling                                                                  */
/* -------------------------------------------------------------------------- */

/** One bookable slot on a doctor's calendar. */
export interface Slot {
  /** ISO datetime of the slot start. */
  startsAt: string;
  durationMinutes: number;
  available: boolean;
}

/** A doctor's slots for one calendar day. */
export interface DaySlots {
  /** ISO date, `yyyy-MM-dd`. */
  date: string;
  slots: Slot[];
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

export function patientFullName(
  patient: Pick<Patient, "firstName" | "lastName">,
): string {
  return `${patient.firstName} ${patient.lastName}`;
}
