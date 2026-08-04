/**
 * Public surface of the in-memory demo store. Feature `api.ts` modules import
 * from here; nothing else in the app may reach into `db.ts` directly.
 */
export * from "@/lib/store/db";
export { createId, createReference, sleep } from "@/lib/store/ids";
