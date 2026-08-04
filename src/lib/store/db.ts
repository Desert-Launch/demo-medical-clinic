import {
  addDays,
  addMinutes,
  differenceInYears,
  endOfDay,
  isAfter,
  isBefore,
  parseISO,
  startOfDay,
} from "date-fns";

import {
  candidateStarts,
  dateKey,
  intervalsOverlap,
  shiftForDay,
  slotFitsShift,
} from "@/lib/scheduling";
import { createId, createReference } from "@/lib/store/ids";
import { buildSeedData } from "@/lib/store/seed";
import {
  blockingStatuses,
  patientFullName,
  type Appointment,
  type AppointmentStatus,
  type AppointmentWithRelations,
  type BookingChannel,
  type ClinicService,
  type DaySlots,
  type Doctor,
  type Patient,
  type PatientGender,
  type PatientWithHistory,
  type Slot,
  type SpokenLanguage,
  type Specialty,
} from "@/types";

/**
 * The demo "backend": a module-level singleton holding every record. No React,
 * no persistence — a hard refresh re-seeds. Everything in the app reads and
 * writes through the functions below and never touches `database` directly.
 */
interface Database {
  specialties: Specialty[];
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
}

let database: Database = buildSeedData();

/** Thrown for rule violations the UI is expected to surface to the user. */
export class StoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StoreError";
  }
}

export function resetDatabase(): void {
  database = buildSeedData();
}

/* -------------------------------------------------------------------------- */
/* Specialties                                                                 */
/* -------------------------------------------------------------------------- */

const cloneSpecialty = (specialty: Specialty): Specialty => ({
  ...specialty,
  treats: [...specialty.treats],
  services: specialty.services.map((service) => ({ ...service })),
});

export function listSpecialties(): Specialty[] {
  return database.specialties.map(cloneSpecialty);
}

export function getSpecialtyById(id: string): Specialty | null {
  const specialty = database.specialties.find((item) => item.id === id);
  return specialty ? cloneSpecialty(specialty) : null;
}

export function getSpecialtyBySlug(slug: string): Specialty | null {
  const specialty = database.specialties.find((item) => item.slug === slug);
  return specialty ? cloneSpecialty(specialty) : null;
}

/** Looks a service up across every specialty — service ids are globally unique. */
export function getServiceById(id: string): ClinicService | null {
  for (const specialty of database.specialties) {
    const service = specialty.services.find((item) => item.id === id);
    if (service) return { ...service };
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/* Doctors                                                                     */
/* -------------------------------------------------------------------------- */

const cloneDoctor = (doctor: Doctor): Doctor => ({
  ...doctor,
  languages: [...doctor.languages],
  shifts: doctor.shifts.map((shift) => ({ ...shift })),
});

export interface DoctorFilters {
  specialtyId?: string;
  language?: SpokenLanguage;
  /** Matches name, focus or credentials. */
  search?: string;
}

export function listDoctors(filters: DoctorFilters = {}): Doctor[] {
  const search = filters.search?.trim().toLowerCase();
  return database.doctors
    .filter((doctor) => {
      if (filters.specialtyId && doctor.specialtyId !== filters.specialtyId) {
        return false;
      }
      if (filters.language && !doctor.languages.includes(filters.language)) {
        return false;
      }
      if (search) {
        const haystack =
          `${doctor.name} ${doctor.focus} ${doctor.credentials}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    })
    .map(cloneDoctor);
}

export function getDoctorById(id: string): Doctor | null {
  const doctor = database.doctors.find((item) => item.id === id);
  return doctor ? cloneDoctor(doctor) : null;
}

/* -------------------------------------------------------------------------- */
/* Joins                                                                       */
/* -------------------------------------------------------------------------- */

function hydrate(appointment: Appointment): AppointmentWithRelations | null {
  const patient = database.patients.find(
    (item) => item.id === appointment.patientId,
  );
  const doctor = database.doctors.find((item) => item.id === appointment.doctorId);
  const specialty = database.specialties.find(
    (item) => item.id === appointment.specialtyId,
  );
  const service = specialty?.services.find(
    (item) => item.id === appointment.serviceId,
  );
  if (!patient || !doctor || !specialty || !service) return null;
  return {
    ...appointment,
    patient: { ...patient },
    doctor: cloneDoctor(doctor),
    specialty: cloneSpecialty(specialty),
    service: { ...service },
  };
}

/* -------------------------------------------------------------------------- */
/* Availability                                                                */
/* -------------------------------------------------------------------------- */

/** Appointments that still hold a place in a doctor's diary. */
function blockingFor(doctorId: string, ignoreAppointmentId?: string) {
  return database.appointments.filter(
    (appointment) =>
      appointment.doctorId === doctorId &&
      appointment.id !== ignoreAppointmentId &&
      blockingStatuses.includes(appointment.status),
  );
}

function isSlotFree(
  doctorId: string,
  start: Date,
  durationMinutes: number,
  ignoreAppointmentId?: string,
): boolean {
  const end = addMinutes(start, durationMinutes);
  return !blockingFor(doctorId, ignoreAppointmentId).some((appointment) => {
    const bookedStart = parseISO(appointment.startsAt);
    return intervalsOverlap(
      start,
      end,
      bookedStart,
      addMinutes(bookedStart, appointment.durationMinutes),
    );
  });
}

export interface AvailabilityQuery {
  doctorId: string;
  durationMinutes: number;
  /** ISO date, `yyyy-MM-dd`. Defaults to today. */
  from?: string;
  /** How many consecutive days to return, including empty ones. */
  days?: number;
  /** Excluded from the clash check — used when rescheduling an appointment. */
  ignoreAppointmentId?: string;
}

/**
 * Slots for one doctor over a window of days. Days the doctor does not work
 * come back with an empty `slots` array rather than being dropped, so the
 * picker can show "Dr. Al Shamsi is not in on Fridays" instead of a gap.
 */
export function listAvailability(query: AvailabilityQuery): DaySlots[] {
  const doctor = database.doctors.find((item) => item.id === query.doctorId);
  if (!doctor) return [];

  const now = new Date();
  const first = query.from ? startOfDay(parseISO(query.from)) : startOfDay(now);
  const days = query.days ?? 7;

  const result: DaySlots[] = [];
  for (let offset = 0; offset < days; offset += 1) {
    const day = addDays(first, offset);
    const shift = shiftForDay(doctor.shifts, day);
    if (!shift) {
      result.push({ date: dateKey(day), slots: [] });
      continue;
    }

    const slots: Slot[] = candidateStarts(shift, day)
      .filter((start) => slotFitsShift(start, query.durationMinutes, shift))
      // A slot in the past is not a slot.
      .filter((start) => isAfter(start, now))
      .map((start) => ({
        startsAt: start.toISOString(),
        durationMinutes: query.durationMinutes,
        available: isSlotFree(
          doctor.id,
          start,
          query.durationMinutes,
          query.ignoreAppointmentId,
        ),
      }));

    result.push({ date: dateKey(day), slots });
  }

  return result;
}

/** The soonest free slot for a doctor, looking up to four weeks ahead. */
export function findNextAvailableSlot(
  doctorId: string,
  durationMinutes: number,
): Slot | null {
  const days = listAvailability({ doctorId, durationMinutes, days: 28 });
  for (const day of days) {
    const slot = day.slots.find((item) => item.available);
    if (slot) return slot;
  }
  return null;
}

/** The soonest free slot across every doctor in a specialty. */
export function findFirstAvailableInSpecialty(
  specialtyId: string,
  durationMinutes: number,
): { doctorId: string; slot: Slot } | null {
  let best: { doctorId: string; slot: Slot } | null = null;
  for (const doctor of database.doctors) {
    if (doctor.specialtyId !== specialtyId) continue;
    const slot = findNextAvailableSlot(doctor.id, durationMinutes);
    if (!slot) continue;
    if (!best || slot.startsAt < best.slot.startsAt) {
      best = { doctorId: doctor.id, slot };
    }
  }
  return best;
}

/* -------------------------------------------------------------------------- */
/* Patients                                                                    */
/* -------------------------------------------------------------------------- */

export interface PatientFilters {
  /** Matches name, email, phone or insurer. */
  search?: string;
  insurer?: string;
}

function withHistory(patient: Patient): PatientWithHistory {
  const now = new Date();
  const appointments = database.appointments
    .filter((appointment) => appointment.patientId === patient.id)
    .map(hydrate)
    .filter((item): item is AppointmentWithRelations => item !== null)
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt));

  const past = appointments.filter(
    (appointment) =>
      appointment.status === "completed" &&
      isBefore(parseISO(appointment.startsAt), now),
  );
  const upcoming = appointments
    .filter(
      (appointment) =>
        blockingStatuses.includes(appointment.status) &&
        isAfter(parseISO(appointment.startsAt), now),
    )
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  return {
    ...patient,
    appointments,
    lastVisitAt: past[0]?.startsAt ?? null,
    nextVisitAt: upcoming[0]?.startsAt ?? null,
    visitCount: past.length,
    totalBilledAED: past.reduce((total, item) => total + item.feeAED, 0),
  };
}

export function listPatients(
  filters: PatientFilters = {},
): PatientWithHistory[] {
  const search = filters.search?.trim().toLowerCase();
  return database.patients
    .filter((patient) => {
      if (filters.insurer && patient.insurer !== filters.insurer) return false;
      if (search) {
        const haystack =
          `${patientFullName(patient)} ${patient.email} ${patient.phone} ${patient.insurer ?? ""}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    })
    .map(withHistory)
    .sort((a, b) =>
      patientFullName(a).localeCompare(patientFullName(b), "en"),
    );
}

export function getPatientById(id: string): PatientWithHistory | null {
  const patient = database.patients.find((item) => item.id === id);
  return patient ? withHistory(patient) : null;
}

export function findPatientByEmail(email: string): Patient | null {
  const normalised = email.trim().toLowerCase();
  const patient = database.patients.find(
    (item) => item.email.toLowerCase() === normalised,
  );
  return patient ? { ...patient } : null;
}

export interface PatientInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: PatientGender;
  insurer: string | null;
  insuranceMemberId: string | null;
  allergies: string;
  notes: string;
}

export function createPatient(input: PatientInput): PatientWithHistory {
  const existing = database.patients.find(
    (item) => item.email.toLowerCase() === input.email.trim().toLowerCase(),
  );
  if (existing) {
    throw new StoreError(
      `${existing.firstName} ${existing.lastName} already uses ${input.email}. Open that record instead of creating a second one.`,
    );
  }

  const patient: Patient = {
    ...input,
    id: createId("pat"),
    email: input.email.trim(),
    createdAt: new Date().toISOString(),
  };
  database.patients = [...database.patients, patient];
  return withHistory(patient);
}

export function updatePatient(
  id: string,
  input: Partial<PatientInput>,
): PatientWithHistory {
  const index = database.patients.findIndex((item) => item.id === id);
  if (index === -1) throw new StoreError("That patient record no longer exists.");

  if (input.email) {
    const clash = database.patients.find(
      (item) =>
        item.id !== id &&
        item.email.toLowerCase() === input.email!.trim().toLowerCase(),
    );
    if (clash) {
      throw new StoreError(
        `${clash.firstName} ${clash.lastName} already uses that email address.`,
      );
    }
  }

  const updated: Patient = { ...database.patients[index], ...input };
  database.patients = database.patients.map((item) =>
    item.id === id ? updated : item,
  );
  return withHistory(updated);
}

export function deletePatient(id: string): void {
  const patient = database.patients.find((item) => item.id === id);
  if (!patient) throw new StoreError("That patient record no longer exists.");

  const upcoming = database.appointments.filter(
    (appointment) =>
      appointment.patientId === id &&
      blockingStatuses.includes(appointment.status) &&
      isAfter(parseISO(appointment.startsAt), new Date()),
  );
  if (upcoming.length > 0) {
    throw new StoreError(
      `${patientFullName(patient)} has ${upcoming.length} upcoming appointment${upcoming.length === 1 ? "" : "s"}. Cancel ${upcoming.length === 1 ? "it" : "them"} first.`,
    );
  }

  database.patients = database.patients.filter((item) => item.id !== id);
  database.appointments = database.appointments.filter(
    (appointment) => appointment.patientId !== id,
  );
}

/** Age in whole years, or null when the date of birth is unusable. */
export function patientAge(dateOfBirth: string): number | null {
  const parsed = parseISO(dateOfBirth);
  if (Number.isNaN(parsed.getTime())) return null;
  return differenceInYears(new Date(), parsed);
}

/* -------------------------------------------------------------------------- */
/* Appointments                                                                */
/* -------------------------------------------------------------------------- */

export interface AppointmentFilters {
  statuses?: AppointmentStatus[];
  doctorId?: string;
  specialtyId?: string;
  patientId?: string;
  /** Matches patient name, reference, reason, email or phone. */
  search?: string;
  /** ISO dates or datetimes. The range includes both end days in full. */
  from?: string;
  to?: string;
}

export function listAppointments(
  filters: AppointmentFilters = {},
): AppointmentWithRelations[] {
  const search = filters.search?.trim().toLowerCase();
  const from = filters.from ? startOfDay(parseISO(filters.from)) : null;
  const to = filters.to ? endOfDay(parseISO(filters.to)) : null;

  return database.appointments
    .map(hydrate)
    .filter((item): item is AppointmentWithRelations => item !== null)
    .filter((appointment) => {
      if (filters.statuses?.length && !filters.statuses.includes(appointment.status)) {
        return false;
      }
      if (filters.doctorId && appointment.doctorId !== filters.doctorId) {
        return false;
      }
      if (filters.specialtyId && appointment.specialtyId !== filters.specialtyId) {
        return false;
      }
      if (filters.patientId && appointment.patientId !== filters.patientId) {
        return false;
      }
      const startsAt = parseISO(appointment.startsAt);
      if (from && isBefore(startsAt, from)) return false;
      if (to && isAfter(startsAt, to)) return false;
      if (search) {
        const haystack = [
          patientFullName(appointment.patient),
          appointment.reference,
          appointment.reason,
          appointment.patient.email,
          appointment.patient.phone,
          appointment.doctor.name,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    })
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export function getAppointmentById(
  id: string,
): AppointmentWithRelations | null {
  const appointment = database.appointments.find((item) => item.id === id);
  return appointment ? hydrate(appointment) : null;
}

export interface AppointmentInput {
  patientId: string;
  doctorId: string;
  serviceId: string;
  startsAt: string;
  status?: AppointmentStatus;
  channel?: BookingChannel;
  reason: string;
  notes?: string;
}

/** Resolves a service to its specialty, or throws if the pairing is unknown. */
function resolveService(serviceId: string): {
  specialty: Specialty;
  service: ClinicService;
} {
  for (const specialty of database.specialties) {
    const service = specialty.services.find((item) => item.id === serviceId);
    if (service) return { specialty, service };
  }
  throw new StoreError("That appointment type is no longer offered.");
}

/** Shared rule check for create and reschedule. */
function assertSlotBookable(
  doctorId: string,
  startsAt: string,
  durationMinutes: number,
  ignoreAppointmentId?: string,
): void {
  const doctor = database.doctors.find((item) => item.id === doctorId);
  if (!doctor) throw new StoreError("That doctor is no longer taking bookings.");

  const start = parseISO(startsAt);
  if (Number.isNaN(start.getTime())) {
    throw new StoreError("Pick a date and time before saving.");
  }

  const shift = shiftForDay(doctor.shifts, start);
  if (!shift) {
    throw new StoreError(`${doctor.name} does not hold a clinic on that day.`);
  }
  if (!slotFitsShift(start, durationMinutes, shift)) {
    throw new StoreError(
      `That time falls outside ${doctor.name}’s clinic hours. Pick another slot.`,
    );
  }
  if (!isSlotFree(doctorId, start, durationMinutes, ignoreAppointmentId)) {
    throw new StoreError(
      `${doctor.name} already has an appointment at that time. Pick another slot.`,
    );
  }
}

export function createAppointment(
  input: AppointmentInput,
): AppointmentWithRelations {
  const patient = database.patients.find((item) => item.id === input.patientId);
  if (!patient) throw new StoreError("That patient record no longer exists.");

  const { specialty, service } = resolveService(input.serviceId);
  const doctor = database.doctors.find((item) => item.id === input.doctorId);
  if (!doctor) throw new StoreError("That doctor is no longer taking bookings.");
  if (doctor.specialtyId !== specialty.id) {
    throw new StoreError(
      `${doctor.name} does not run ${specialty.name.toLowerCase()} appointments.`,
    );
  }

  assertSlotBookable(input.doctorId, input.startsAt, service.durationMinutes);

  const now = new Date().toISOString();
  const appointment: Appointment = {
    id: createId("apt"),
    reference: createReference(),
    patientId: input.patientId,
    doctorId: input.doctorId,
    specialtyId: specialty.id,
    serviceId: service.id,
    startsAt: parseISO(input.startsAt).toISOString(),
    durationMinutes: service.durationMinutes,
    status: input.status ?? "scheduled",
    channel: input.channel ?? "online",
    reason: input.reason,
    notes: input.notes ?? "",
    feeAED: service.priceAED,
    createdAt: now,
    updatedAt: now,
  };

  database.appointments = [...database.appointments, appointment];
  const hydrated = hydrate(appointment);
  if (!hydrated) throw new StoreError("The booking could not be saved.");
  return hydrated;
}

export type AppointmentUpdate = Partial<
  Pick<
    AppointmentInput,
    "doctorId" | "serviceId" | "startsAt" | "status" | "reason" | "notes"
  >
>;

export function updateAppointment(
  id: string,
  input: AppointmentUpdate,
): AppointmentWithRelations {
  const current = database.appointments.find((item) => item.id === id);
  if (!current) throw new StoreError("That appointment no longer exists.");

  const serviceId = input.serviceId ?? current.serviceId;
  const { specialty, service } = resolveService(serviceId);
  const doctorId = input.doctorId ?? current.doctorId;
  const doctor = database.doctors.find((item) => item.id === doctorId);
  if (!doctor) throw new StoreError("That doctor is no longer taking bookings.");
  if (doctor.specialtyId !== specialty.id) {
    throw new StoreError(
      `${doctor.name} does not run ${specialty.name.toLowerCase()} appointments.`,
    );
  }

  const startsAt = input.startsAt ?? current.startsAt;
  const status = input.status ?? current.status;

  // Cancelled and no-show visits release the slot, so they skip the clash check.
  const movingOrRebooking =
    startsAt !== current.startsAt ||
    doctorId !== current.doctorId ||
    serviceId !== current.serviceId ||
    (blockingStatuses.includes(status) &&
      !blockingStatuses.includes(current.status));

  if (movingOrRebooking && blockingStatuses.includes(status)) {
    assertSlotBookable(doctorId, startsAt, service.durationMinutes, id);
  }

  const updated: Appointment = {
    ...current,
    doctorId,
    specialtyId: specialty.id,
    serviceId: service.id,
    startsAt: parseISO(startsAt).toISOString(),
    durationMinutes: service.durationMinutes,
    feeAED: service.priceAED,
    status,
    reason: input.reason ?? current.reason,
    notes: input.notes ?? current.notes,
    updatedAt: new Date().toISOString(),
  };

  database.appointments = database.appointments.map((item) =>
    item.id === id ? updated : item,
  );

  const hydrated = hydrate(updated);
  if (!hydrated) throw new StoreError("The appointment could not be saved.");
  return hydrated;
}

export function deleteAppointment(id: string): void {
  const exists = database.appointments.some((item) => item.id === id);
  if (!exists) throw new StoreError("That appointment no longer exists.");
  database.appointments = database.appointments.filter((item) => item.id !== id);
}

/* -------------------------------------------------------------------------- */
/* Dashboard aggregates                                                        */
/* -------------------------------------------------------------------------- */

export interface DepartmentLoad {
  specialtyId: string;
  name: string;
  booked: number;
  completed: number;
}

export interface ClinicOverview {
  todayCount: number;
  todayRemaining: number;
  upcomingCount: number;
  /** Percentage, 0–100, over the last 30 days. */
  noShowRate: number;
  monthRevenueAED: number;
  monthCompleted: number;
  newPatientsThisMonth: number;
  departmentLoad: DepartmentLoad[];
  todaySchedule: AppointmentWithRelations[];
  nextUp: AppointmentWithRelations[];
}

export function getClinicOverview(): ClinicOverview {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thirtyDaysAgo = addDays(now, -30);

  const all = database.appointments
    .map(hydrate)
    .filter((item): item is AppointmentWithRelations => item !== null);

  const today = all
    .filter((appointment) => {
      const startsAt = parseISO(appointment.startsAt);
      return !isBefore(startsAt, todayStart) && !isAfter(startsAt, todayEnd);
    })
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  const recent = all.filter((appointment) => {
    const startsAt = parseISO(appointment.startsAt);
    return isAfter(startsAt, thirtyDaysAgo) && isBefore(startsAt, now);
  });
  const attended = recent.filter(
    (appointment) =>
      appointment.status === "completed" || appointment.status === "no-show",
  );
  const noShows = recent.filter(
    (appointment) => appointment.status === "no-show",
  );

  const monthCompleted = all.filter(
    (appointment) =>
      appointment.status === "completed" &&
      !isBefore(parseISO(appointment.startsAt), monthStart),
  );

  const departmentLoad: DepartmentLoad[] = database.specialties.map(
    (specialty) => {
      const forSpecialty = all.filter(
        (appointment) =>
          appointment.specialtyId === specialty.id &&
          !isBefore(parseISO(appointment.startsAt), monthStart),
      );
      return {
        specialtyId: specialty.id,
        name: specialty.name,
        booked: forSpecialty.filter((appointment) =>
          blockingStatuses.includes(appointment.status),
        ).length,
        completed: forSpecialty.filter(
          (appointment) => appointment.status === "completed",
        ).length,
      };
    },
  );

  const upcoming = all
    .filter(
      (appointment) =>
        blockingStatuses.includes(appointment.status) &&
        isAfter(parseISO(appointment.startsAt), now),
    )
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  return {
    todayCount: today.length,
    todayRemaining: today.filter(
      (appointment) =>
        blockingStatuses.includes(appointment.status) &&
        isAfter(parseISO(appointment.startsAt), now),
    ).length,
    upcomingCount: upcoming.length,
    noShowRate:
      attended.length === 0 ? 0 : (noShows.length / attended.length) * 100,
    monthRevenueAED: monthCompleted.reduce(
      (total, appointment) => total + appointment.feeAED,
      0,
    ),
    monthCompleted: monthCompleted.length,
    newPatientsThisMonth: database.patients.filter(
      (patient) => !isBefore(parseISO(patient.createdAt), monthStart),
    ).length,
    departmentLoad,
    todaySchedule: today,
    nextUp: upcoming.slice(0, 6),
  };
}
