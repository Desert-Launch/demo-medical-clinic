import {
  addMinutes,
  format,
  isAfter,
  isBefore,
  parseISO,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
} from "date-fns";

import type { Shift } from "@/types";

/** Front-desk opening hours, keyed to `Date.getDay()` (0 = Sunday). */
export const clinicHours: Record<number, { open: number; close: number } | null> =
  {
    0: { open: 8, close: 21 },
    1: { open: 8, close: 21 },
    2: { open: 8, close: 21 },
    3: { open: 8, close: 21 },
    4: { open: 8, close: 21 },
    5: { open: 8, close: 12 }, // Friday mornings only
    6: { open: 9, close: 18 },
  };

/** Midday break. Skipped on Friday, whose shift ends before it starts. */
export const clinicBreak = { startHour: 13, endHour: 14 };

/** Consultation slots start on this grid, whatever the service duration. */
export const SLOT_STEP_MINUTES = 30;

export const weekdayLabels = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const weekdayShortLabels = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

export function atHour(date: Date, hour: number, minute = 0): Date {
  return setSeconds(setMinutes(setHours(date, hour), minute), 0);
}

/** `true` when the two `[start, end)` intervals share any minute. */
export function intervalsOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/** The doctor's shift for a given calendar day, or null if they are off. */
export function shiftForDay(shifts: Shift[], date: Date): Shift | null {
  return shifts.find((shift) => shift.day === date.getDay()) ?? null;
}

/**
 * Every candidate start time on a doctor's shift for one day. Availability
 * against booked appointments is applied by the store, which owns that data.
 */
export function candidateStarts(shift: Shift, date: Date): Date[] {
  const day = startOfDay(date);
  const shiftStart = atHour(day, shift.startHour);
  const shiftEnd = atHour(day, shift.endHour);
  const breakStart = atHour(day, clinicBreak.startHour);
  const breakEnd = atHour(day, clinicBreak.endHour);

  const starts: Date[] = [];
  let cursor = shiftStart;
  while (isBefore(cursor, shiftEnd)) {
    const insideBreak =
      !isBefore(cursor, breakStart) && isBefore(cursor, breakEnd);
    if (!insideBreak) starts.push(cursor);
    cursor = addMinutes(cursor, SLOT_STEP_MINUTES);
  }
  return starts;
}

/** `true` when a slot of `durationMinutes` fits inside the shift and misses
 *  the midday break. */
export function slotFitsShift(
  start: Date,
  durationMinutes: number,
  shift: Shift,
): boolean {
  const day = startOfDay(start);
  const end = addMinutes(start, durationMinutes);
  const shiftEnd = atHour(day, shift.endHour);
  if (isAfter(end, shiftEnd)) return false;

  const breakStart = atHour(day, clinicBreak.startHour);
  const breakEnd = atHour(day, clinicBreak.endHour);
  if (shift.endHour <= clinicBreak.startHour) return true;
  return !intervalsOverlap(start, end, breakStart, breakEnd);
}

export interface ClinicStatus {
  open: boolean;
  /** e.g. "Open until 9:00 pm" or "Closed · opens Saturday 9:00 am". */
  label: string;
}

/** Front-desk open/closed state for the header strip. */
export function clinicStatusAt(now: Date): ClinicStatus {
  const today = clinicHours[now.getDay()];
  if (today) {
    const open = atHour(now, today.open);
    const close = atHour(now, today.close);
    if (!isBefore(now, open) && isBefore(now, close)) {
      return { open: true, label: `Open until ${format(close, "h:mm a")}` };
    }
    if (isBefore(now, open)) {
      return { open: false, label: `Opens today at ${format(open, "h:mm a")}` };
    }
  }

  for (let offset = 1; offset <= 7; offset += 1) {
    const day = (now.getDay() + offset) % 7;
    const hours = clinicHours[day];
    if (!hours) continue;
    const next = atHour(startOfDay(now), hours.open);
    return {
      open: false,
      label: `Closed · opens ${weekdayLabels[day]} ${format(next, "h:mm a")}`,
    };
  }

  return { open: false, label: "Closed" };
}

/** `yyyy-MM-dd`, the key format used for slot days throughout the app. */
export function dateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function parseDateKey(key: string): Date {
  return startOfDay(parseISO(key));
}

export function formatSlotTime(iso: string): string {
  return format(parseISO(iso), "h:mm a");
}

export function formatSlotRange(iso: string, durationMinutes: number): string {
  const start = parseISO(iso);
  return `${format(start, "h:mm a")} – ${format(addMinutes(start, durationMinutes), "h:mm a")}`;
}
