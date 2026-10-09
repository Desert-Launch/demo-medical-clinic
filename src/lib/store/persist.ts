/**
 * Keeps the demo's data in this browser.
 *
 * The store is still a plain module-level object and every read and write in
 * `db.ts` stays synchronous. This file only snapshots it to localStorage after
 * each write and hands the snapshot back the next time the module is
 * evaluated, so a booking or an order made on the public site is waiting on
 * the dashboard after a refresh or in a new tab. A dashboard already open in
 * another tab is told about the write and refetches (see `onStoreChange`).
 *
 * A snapshot lasts for the day it was seeded on. The seed is written around
 * "today" — this morning's orders, the fortnight either side of now — so a
 * copy from yesterday would open on a stale day. A new day, an unreadable
 * copy or a snapshot from an older `version` starts from a fresh seed.
 * Nothing leaves the browser; on the server this is a no-op and the store is
 * the seed, as before.
 *
 * Identical in every demo. What differs (the seed, the version, the shape
 * check) is passed in by `db.ts`.
 */
import { DEMO } from "@/lib/demo-site";

interface Snapshot<T> {
  version: number;
  /** Local calendar day the data was seeded on, `YYYY-M-D`. */
  day: string;
  data: T;
}

const KEY = `desert-launch-demo:${DEMO.slug}`;
const CHANGE_EVENT = "desert-launch-demo:change";

function today(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

/** localStorage, or null on the server, in a private window that refuses it,
 *  or anywhere else it throws. The demo then runs in memory, as it used to. */
function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export interface PersistedStore<T> {
  /** Today's saved copy if there is a usable one, otherwise a fresh seed. */
  load(): T;
  /** Call after every write. */
  save(data: T): void;
  /** A fresh seed, saved — "Reset demo data". */
  reset(): T;
  /** Another tab saved: swap the in-memory data for its copy. */
  onExternalChange(apply: (data: T) => void): void;
}

export function persistedStore<T>(options: {
  /** Bump whenever the shape of the stored data changes. */
  version: number;
  seed: () => T;
  /** Cheap shape check, so a hand-edited or truncated copy is dropped. */
  isValid: (data: unknown) => boolean;
}): PersistedStore<T> {
  const { version, seed, isValid } = options;
  let day = today();

  function read(raw: string | null): Snapshot<T> | null {
    if (!raw) return null;
    try {
      const snapshot = JSON.parse(raw) as Partial<Snapshot<T>>;
      if (snapshot.version !== version || snapshot.day !== today()) return null;
      if (!isValid(snapshot.data)) return null;
      return snapshot as Snapshot<T>;
    } catch {
      return null;
    }
  }

  function write(data: T): void {
    const store = storage();
    if (!store) return;
    try {
      store.setItem(KEY, JSON.stringify({ version, day, data } satisfies Snapshot<T>));
    } catch {
      // Quota or a locked-down browser: keep working in memory.
    }
  }

  function fresh(): T {
    day = today();
    const data = seed();
    write(data);
    return data;
  }

  return {
    load() {
      const saved = read(storage()?.getItem(KEY) ?? null);
      if (!saved) return fresh();
      day = saved.day;
      return saved.data;
    },
    save: write,
    reset: fresh,
    onExternalChange(apply) {
      if (typeof window === "undefined") return;
      window.addEventListener("storage", (event) => {
        if (event.key !== KEY) return;
        const saved = read(event.newValue);
        if (!saved) return;
        day = saved.day;
        apply(saved.data);
        window.dispatchEvent(new Event(CHANGE_EVENT));
      });
    },
  };
}

/** Runs `listener` after another tab changes the data. The providers use it
 *  to invalidate every query, so an open dashboard shows a new booking
 *  without a refresh. Returns the unsubscribe. */
export function onStoreChange(listener: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, listener);
  return () => window.removeEventListener(CHANGE_EVENT, listener);
}

/** Drops the saved copy so the next load starts from a fresh seed. The way
 *  out an error page offers: a refresh alone no longer resets the demo, and
 *  the dashboard's reset button may be on the page that is failing. */
export function clearSavedData(): void {
  try {
    storage()?.removeItem(KEY);
  } catch {
    // Nothing saved, or storage refused: a reload starts fresh either way.
  }
}
