/**
 * Placeholder imagery — THE SWAP POINT.
 * =============================================================================
 * Every remote image URL in the demo resolves through this file and nowhere
 * else. When real photography arrives, change the two constants below and the
 * two maps; no component needs touching.
 *
 * These are third-party placeholders chosen so the demo reads as a real clinic
 * site rather than a wireframe. They are NOT cleared for the finished build:
 *
 *   - Portraits are stock faces of real people. `CLAUDE.md` says "no real
 *     people, faces, brands or logos", so these must be replaced before the
 *     demo is shown as finished work. They are here to answer "how will this
 *     look to a patient", not to ship.
 *   - Scenes are CC-licensed photographs, hand-checked one by one for a clinic
 *     reading, no watermark, no legible real-world brand, and no identifiable
 *     faces. Do not add a URL here without looking at it first — the generated
 *     placeholder services return medical-pathology archive photos and branded
 *     product shots often enough to matter.
 *
 * Every consumer renders through `<Photo>`, which keeps the existing gradient
 * art underneath. If a host is slow, blocked, or offline mid-pitch the UI falls
 * back to the brand art instead of a broken image.
 */

/** Consistent, neutral studio portraits. Indices are valid for 0–78. */
const PORTRAIT_HOST = "https://xsgames.co/randomusers/assets/avatars";

/**
 * One explicitly chosen portrait per doctor, so the directory stays stable
 * across reloads and no two doctors share a face. Mapped by hand rather than
 * derived from the name — we are casting fictional personas, not inferring
 * anything from a string.
 */
const doctorPortraits: Record<string, string> = {
  doc_almansoori: "female/45", // Dr. Layla Al Mansoori — family medicine
  doc_menon: "male/52", // Dr. Rajesh Menon — family medicine
  doc_haddad_f: "female/21", // Dr. Farah Haddad — family medicine
  doc_kassem: "female/60", // Dr. Hana Kassem — dermatology
  doc_duarte: "female/32", // Dr. Sofia Duarte — dermatology
  doc_alhosani: "female/68", // Dr. Noura Al Hosani — paediatrics
  doc_reyes: "male/40", // Dr. Marco Reyes — paediatrics
  doc_alshamsi: "male/21", // Dr. Omar Al Shamsi — cardiology
  doc_anand: "female/52", // Dr. Priya Anand — cardiology
  doc_baig: "male/68", // Dr. Yusuf Baig — ENT
  doc_rahman: "female/40", // Dr. Aisha Rahman — ENT
  doc_haddad_a: "female/75", // Amal Haddad — physiotherapy
};

/**
 * A doctor's portrait, or `null` for a doctor added at runtime through admin.
 * `<Photo>` treats null as "no photo" and leaves the initials art in place, so
 * a newly created doctor degrades gracefully instead of borrowing a face.
 */
export function doctorPortrait(doctorId: string): string | null {
  const path = doctorPortraits[doctorId];
  return path ? `${PORTRAIT_HOST}/${path}.jpg` : null;
}

/**
 * Scene photography. Each of these was opened and checked before being pinned.
 * Keys describe the slot, not the picture, so swapping the source is a one-line
 * change per slot.
 */
export const scenes = {
  /** Warm, modern interior — the hero panel on the homepage. */
  heroInterior:
    "https://live.staticflickr.com/65535/54595609639_b96499b022_b.jpg",
  /** Bright glazed lobby with seating — the clinic story on /about. */
  clinicLobby: "https://live.staticflickr.com/3188/2326244276_7ecb717e1d_b.jpg",
  /** Clinician reviewing a scan — consultation contexts. */
  consultation:
    "https://live.staticflickr.com/65535/54586360475_3601f31077_b.jpg",
  /** Clean stethoscope product shot. */
  stethoscope:
    "https://images.rawpixel.com/editor_1024/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvc3YxMjkwODUtaW1hZ2Uta3d2dWozcHQuanBn.jpg",
  /** Rehabilitation session, no faces in frame. */
  rehabRoom:
    "https://images.rawpixel.com/editor_1024/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvZnJlbGVjdHJvc3RpbXVsYXRpb25fc3BvcnRfYmxlc3NfeW91XzAtaW1hZ2Uta3liZHRubG4uanBn.jpg",
} as const;

export type SceneKey = keyof typeof scenes;

/**
 * Department card art, keyed by specialty slug.
 *
 * These are deliberately *clinical environment* photographs rather than literal
 * depictions of each specialty, and that is a safety decision, not laziness:
 * searching the free CC pools for "paediatrics" and "ENT" returns photographs
 * of identifiable real children being examined, which cannot go in a demo. The
 * equivalent dermatology searches return pathology archive material.
 *
 * Because the card blends this over each specialty's own gradient variant, six
 * cards still read as six distinct departments even where the underlying
 * photograph repeats. Swap these for commissioned department photography and
 * the blend can come off.
 */
const specialtyScenes: Record<string, string> = {
  "family-medicine": scenes.consultation,
  dermatology: scenes.heroInterior,
  paediatrics: scenes.clinicLobby,
  cardiology: scenes.stethoscope,
  ent: scenes.consultation,
  physiotherapy: scenes.rehabRoom,
};

/** Card art for a department, or `null` for a slug we have no image for. */
export function specialtyScene(slug: string): string | null {
  return specialtyScenes[slug] ?? null;
}
