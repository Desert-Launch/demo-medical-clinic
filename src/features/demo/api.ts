import { resetDatabase, sleep } from "@/lib/store";

/** Puts the store, and the copy saved in this browser, back to its seeded state. */
export async function resetDemoData(): Promise<void> {
  await sleep(320);
  resetDatabase();
}
