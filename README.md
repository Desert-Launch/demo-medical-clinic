# Andalus Medical Center

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
