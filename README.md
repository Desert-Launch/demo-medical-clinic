# Demo Medical Clinic

A frontend-only demo of a multi-specialty outpatient clinic in Abu Dhabi: a
public marketing site, a five-step booking flow, and a staff dashboard with full
CRUD over appointments and patients.

Everything is fictional — the clinic, the doctors, the patients and the
insurers. There is no backend, no database and no auth server.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

| Script              | What it does                 |
| ------------------- | ---------------------------- |
| `npm run build`     | Production build (Turbopack) |
| `npm run start`     | Serve the production build   |
| `npm run lint`      | ESLint over the whole repo   |
| `npm run typecheck` | `tsc --noEmit`, strict mode  |

`lint` and `typecheck` both pass clean.

## Where the data lives

`src/lib/store/` is the demo's "backend": a module-level singleton holding every
specialty, doctor, patient and appointment.

- `seed.ts` builds the dataset — 6 specialties, 12 doctors, 30 patients and
  around 50 appointments spread across the past and next two weeks. Appointment
  times are derived from each doctor's real shift pattern, so no two bookings
  ever collide.
- `db.ts` is the whole read/write surface: filtered lists, joins, slot
  availability, CRUD, and the dashboard aggregates.
- `index.ts` is the only entry point anything outside `lib/store` may import.

Writes persist **for the browser session only**. A hard refresh re-seeds, because
the store is plain module state — no `localStorage`, no network.

### Resetting the demo data

Bottom of the admin sidebar → **Reset demo data**. It puts the store back to its
seeded state and drops every cached query. Refreshing the page does the same
thing.

## Architecture

The app is feature-sliced and the dependencies run one way only:

```
app/  →  features/  →  lib/store
             ↓
        components/
```

`app/` holds routes and nothing else — no business logic. Each folder under
`features/` owns one domain and exposes it through an `index.ts` barrel:
`schema.ts` (zod, with the TypeScript types inferred from it), `api.ts` (async
functions over the store, each with a small deliberate latency so loading and
skeleton states are real), `hooks/` (TanStack Query wrappers) and `components/`.
UI never reaches into the store directly — it goes through a hook, which calls
`api.ts`, which calls the store. Mutations invalidate query keys, so a booking
taken on the public site shows up in the dashboard without a refresh.

Cross-cutting client state (the "signed-in" staff member) lives in a small
Zustand store at `src/lib/state/session-store.ts`. Design values live as CSS
variables in `src/styles/tokens.css` and are mapped into the Tailwind theme in
`src/app/globals.css`; no component hardcodes a colour.

## Things worth demoing

- **`/book`** — the five-step wizard. Booked slots are struck through and
  derived live from the store; "first available" resolves across the whole
  department. Deep links work: `/book?specialty=cardiology`,
  `/book?doctor=doc_alshamsi`.
- **`/admin/appointments`** — filter by status, department, doctor, date range
  or free text; create, reschedule, reassign, change status, delete. Cancelling
  updates the table immediately and **fails roughly one attempt in ten on
  purpose**, so the optimistic rollback and its error toast are demonstrable.
- **`/admin/patients`** — click a row for the record drawer: allergies and notes
  are editable and persist, with the full visit history underneath.
- Book something on the public site, then open the dashboard from the
  confirmation screen — it is already there.

## Motion

Motion runs off one vocabulary rather than per-component decisions. The four
speed tiers and three easing curves live with the rest of the design values in
`src/styles/tokens.css`; `src/lib/motion.ts` restates them in the seconds-and-
bezier-array form Framer needs, and is the only place the two representations
sit side by side.

What actually moves, and why:

| Where | What | Why |
| --- | --- | --- |
| Hero, section openers, card grids | Reveal on first sight, children staggered | Leads the eye down the page in reading order |
| Trust figures, dashboard stats | Count up once, on first sight | The numbers are the trust argument |
| Cards and rows | Rise ≤4px to meet the pointer | Affordance — this thing is live |
| Buttons and chips | 120ms give under the press | Feedback on the slowest device in the room |
| Header nav | One active marker travels between links | Moving between sections reads as continuous |
| Booking wizard | Steps slide in the direction of travel; the rail's connector fills | A wizard, not four unrelated pages |
| Slot picker | A single lozenge travels between the day and time you pick | The signature moment |
| Confirmations | The mark lands with a slight overshoot | Silence after "submit" is what makes a form feel broken |

Three components own every entrance — `Reveal`, `RevealGroup` and `RevealItem`
in `src/components/shared/reveal.tsx`. Nothing animates in except through them,
and each fires once and never replays on scroll-back.

Everything animates `transform` and `opacity` only, so it stays on the
compositor and costs no layout. Where a card both reveals and lifts, the two
sit on different elements — one transform, one owner.

`prefers-reduced-motion: reduce` **disables** it rather than shortening it: the
reveal components render plain wrappers, the count-up prints its final value,
and the hover displacement is dropped while the shadow that signals "this is
interactive" stays. The `@media` block at the bottom of `src/app/globals.css`
catches Framer's inline styles too.

Below the `sm` breakpoint the header's "Book appointment" is dropped for room,
so a booking bar (`src/components/layout/book-bar.tsx`) slides up once the hero
has gone past — book, or phone the desk, inside thumb reach for the rest of the
page. It never appears on `/book` itself.

## Placeholder imagery — must be replaced before this ships

The demo pulls photography from third-party placeholder hosts so the layouts
read like a real clinic site rather than a wireframe. Every URL resolves through
`src/lib/images.ts`; that file and the `images.remotePatterns` entry in
`next.config.ts` are the only two places these hosts appear.

**This is a deliberate deviation from the "no real people, faces, brands or
logos" rule in `CLAUDE.md`,** made so the client can judge the layout with real
faces in it. Two things follow from that:

- **Doctor portraits are stock photographs of real people** (`xsgames.co`). They
  must be swapped for commissioned or licensed images before this is presented
  as finished work.
- **The portraits do not match the personas.** The placeholder pool is mostly
  Western faces, so an Abu Dhabi clinic's Arabic-named consultants are cast
  wrong. Casting is a per-doctor map at the top of `src/lib/images.ts`, so it is
  a one-file fix once real photography exists.

Scene photographs (`live.staticflickr.com`) are CC-licensed and were each opened
and checked for a clinic reading, no watermark, no legible real-world brand and
no identifiable faces. **Do not add a URL to `images.ts` without looking at it
first** — the keyword-based placeholder services return medical-pathology
archive photographs and branded product shots often enough to matter.

**Department cards use clinical-environment photographs, not literal depictions
of each specialty, and that is a safety decision.** Searching the free CC image
pools for "paediatrics" or "ENT" reliably returns photographs of identifiable
real children being examined; the dermatology equivalents return 19th-century
pathology archive material. Neither belongs in a demo shown to a prospect. Each
card blends its photograph into that department's own gradient variant
(`opacity-45 mix-blend-luminosity` in `specialty-card.tsx`), so six cards still
read as six departments even where the underlying photograph repeats. Raise that
opacity if you want the photography to carry more; drop the blend entirely once
real department photography exists.

Every photo renders through `<Photo>` (`src/components/shared/photo.tsx`), which
sits on top of the existing gradient art. If a host is slow, blocked, or the
laptop is offline mid-pitch, the image removes itself and the brand art with the
doctor's initials shows instead — verified by blocking the image host and
confirming all twelve directory cards fall back cleanly.
