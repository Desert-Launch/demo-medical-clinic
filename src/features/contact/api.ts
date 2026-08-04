import type { ContactFormValues } from "@/features/contact/schema";
import { createReference, sleep } from "@/lib/store";

const WRITE_LATENCY_MS = 320;

export interface ContactReceipt {
  reference: string;
  /** Business-hours promise shown on the success card. */
  respondWithin: string;
}

/**
 * Nothing is sent anywhere — the demo has no mail server. The reference is real
 * enough for a walkthrough, and the message is intentionally not stored.
 */
export async function submitContactMessage(
  values: ContactFormValues,
): Promise<ContactReceipt> {
  await sleep(WRITE_LATENCY_MS);
  void values;
  return {
    reference: createReference(),
    respondWithin: "one working day",
  };
}
