/**
 * Public surface of the demo store. Feature `api.ts` modules import from here;
 * nothing else in the app may reach into `db.ts` directly. Every write is saved
 * in this browser for the day (see `persist.ts`).
 */
export * from "@/lib/store/db";
export { createId, createReference, sleep } from "@/lib/store/ids";
