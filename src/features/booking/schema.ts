import { z } from "zod";

import {
  SELF_PAY,
  uaePhonePattern,
} from "@/features/patients/schema";
import { patientGenders } from "@/types";
import { differenceInYears, isValid, parseISO } from "date-fns";

/** Sentinel for "whoever is free soonest" in step two. */
export const FIRST_AVAILABLE = "first-available";

export const bookingDetailsSchema = z.object({
  firstName: z.string().trim().min(2, "Enter your first name."),
  lastName: z.string().trim().min(2, "Enter your last name."),
  email: z.email("Enter an email address like name@example.com."),
  phone: z
    .string()
    .trim()
    .regex(uaePhonePattern, "Enter a UAE number, like +971 50 123 4567."),
  dateOfBirth: z
    .string()
    .min(1, "Enter a date of birth.")
    .refine((value) => isValid(parseISO(value)), "Enter a date like 1990-04-21.")
    .refine((value) => {
      const age = differenceInYears(new Date(), parseISO(value));
      return age >= 0 && age <= 120;
    }, "That date of birth is outside the range we can accept."),
  gender: z.enum(patientGenders),
  insurer: z.string().min(1, "Choose an insurer, or select self-paying."),
  insuranceMemberId: z.string().trim().max(40, "That membership number is too long."),
  reason: z
    .string()
    .trim()
    .min(4, "Tell the doctor what to expect, in a line or two.")
    .max(280, "Keep it under 280 characters."),
  consent: z.boolean().refine((value) => value, {
    message: "Tick the box so we can hold the appointment.",
  }),
});

export type BookingDetailsValues = z.infer<typeof bookingDetailsSchema>;

/** Everything the wizard collects, assembled across the five steps. */
export interface BookingDraft {
  specialtyId: string;
  serviceId: string;
  doctorId: string;
  startsAt: string;
  details: BookingDetailsValues | null;
}

export const emptyBookingDraft: BookingDraft = {
  specialtyId: "",
  serviceId: "",
  doctorId: "",
  startsAt: "",
  details: null,
};

export const emptyBookingDetails: BookingDetailsValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "unspecified",
  insurer: SELF_PAY,
  insuranceMemberId: "",
  reason: "",
  consent: false,
};

export interface BookingInput {
  serviceId: string;
  doctorId: string;
  startsAt: string;
  details: BookingDetailsValues;
}
