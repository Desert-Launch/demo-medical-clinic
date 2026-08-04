import { z } from "zod";

import { uaePhonePattern } from "@/features/patients/schema";

export const contactTopics = [
  "Booking or rescheduling",
  "Insurance and billing",
  "Test results",
  "Feedback or complaint",
  "Something else",
] as const;

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: z.email("Enter an email address like name@example.com."),
  phone: z
    .string()
    .trim()
    .regex(uaePhonePattern, "Enter a UAE number, like +971 50 123 4567."),
  topic: z.enum(contactTopics),
  message: z
    .string()
    .trim()
    .min(12, "Give us a little more to work with — a sentence is plenty.")
    .max(1500, "Keep the message under 1,500 characters."),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
