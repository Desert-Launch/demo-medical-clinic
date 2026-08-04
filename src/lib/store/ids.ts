/** Identifier helpers for the in-memory store. */

export function createId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 12)}`;
}

const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * Patient-facing booking reference, e.g. `AMC-7QK4M`. Ambiguous characters
 * (0/O, 1/I) are left out so it survives being read down a phone line.
 */
export function createReference(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  let code = "";
  for (const byte of bytes) {
    code += REFERENCE_ALPHABET[byte % REFERENCE_ALPHABET.length];
  }
  return `AMC-${code}`;
}

/** Simulated network latency, so loading and skeleton states are demoable. */
export function sleep(ms = 120): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
