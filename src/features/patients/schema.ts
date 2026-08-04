import { differenceInYears, isValid, parseISO } from "date-fns";
import { z } from "zod";

import { patientGenders } from "@/types";

/** UAE mobile or landline, with or without spaces: +971 50 123 4567, 0501234567. */
export const uaePhonePattern = /^(\+?971|0)[\s-]?\d{1,2}[\s-]?\d{3}[\s-]?\d{4}$/;

/** The value the insurer select uses for self-paying patients — a Radix select
 *  item cannot hold an empty string or null. */
export const SELF_PAY = "self-pay";

export const patientFormSchema = z
  .object({
    firstName: z.string().trim().min(2, "Enter a first name."),
    lastName: z.string().trim().min(2, "Enter a last name."),
    email: z.email("Enter an email address like name@example.com."),
    phone: z
      .string()
      .trim()
      .regex(uaePhonePattern, "Enter a UAE number, like +971 50 123 4567."),
    dateOfBirth: z
      .string()
      .min(1, "Enter a date of birth.")
      .refine(
        (value) => isValid(parseISO(value)),
        "Enter a date like 1990-04-21.",
      )
      .refine((value) => {
        const age = differenceInYears(new Date(), parseISO(value));
        return age >= 0 && age <= 120;
      }, "That date of birth is outside the range we can accept."),
    gender: z.enum(patientGenders),
    insurer: z.string(),
    insuranceMemberId: z.string().trim().max(40, "That membership number is too long."),
    allergies: z.string().max(500, "Keep allergies under 500 characters."),
    notes: z.string().max(2000, "Keep notes under 2,000 characters."),
  })
  .refine(
    (values) =>
      values.insurer === SELF_PAY || values.insuranceMemberId.length > 0,
    {
      message: "Add the membership number shown on the insurance card.",
      path: ["insuranceMemberId"],
    },
  );

export type PatientFormValues = z.infer<typeof patientFormSchema>;

export const patientRecordSchema = z.object({
  allergies: z.string().max(500, "Keep allergies under 500 characters."),
  notes: z.string().max(2000, "Keep notes under 2,000 characters."),
});

export type PatientRecordValues = z.infer<typeof patientRecordSchema>;

/** Select value → stored value. */
export function toStoredInsurer(value: string): string | null {
  return value === SELF_PAY ? null : value;
}

/** Stored value → select value. */
export function toInsurerSelectValue(value: string | null): string {
  return value ?? SELF_PAY;
}
