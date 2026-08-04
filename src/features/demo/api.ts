import { resetDatabase, sleep } from "@/lib/store";

/** Puts the in-memory store back to its seeded state. */
export async function resetDemoData(): Promise<void> {
  await sleep(320);
  resetDatabase();
}
