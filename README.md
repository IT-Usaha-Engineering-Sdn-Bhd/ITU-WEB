# ITU-WEB

Blank starter: Next.js · React Three Fiber · Three.js · anime.js · TailwindCSS · PayloadCMS ·
Docker · Google Cloud Run · Cloud SQL (Postgres) · Google Cloud Storage.

## Setup

```bash
bun install
cp .env.example .env   # fill in DATABASE_URI + PAYLOAD_SECRET
bun dev
```

- `/` — homepage: R3F canvas, anime.js reveal, Payload media count
- `/admin` — Payload admin (first run prompts you to create an admin user)

## Structure

- `src/payload.config.ts` — Payload config (Postgres adapter + GCS storage adapter)
- `src/collections/` — `Users`, `Media`
- `src/three/` — `GlobalCanvas.tsx` (R3F scene), `Scene.tsx` (client-only dynamic wrapper)
- `src/components/Reveal.tsx` — anime.js proof-of-wiring
- `src/app/(site)/` — public routes
- `src/app/(payload)/` — Payload-generated admin + API routes (do not hand-edit)

## Env vars

See `.env.example` for the full list.

## Deploy

Docker image + Cloud Run, migrations run as a separate Cloud Run Job (`payload migrate`
doesn't run during `next build` anymore). Locally: `docker compose up`. For GCP setup and the
full `gcloud` command list, see the deploy plan.

## About, Contact and policy pages

The `/about-us`, `/contact-us`, `/privacy-policy` and `/tnc` routes use Payload globals.
After applying migrations, run `bun run seed:pages` once to populate them from the four
matching Markdown files in `template/`. The seed skips pages that already contain content,
so rerunning it preserves CMS edits. Banner, portrait and milestone images are optional
uploads in Payload; the text seed leaves them empty and the pages show styled placeholders.

Contact form submissions are saved in the `enquiries` collection for authenticated staff
to review. No email adapter is required. For deployment, run the page seed as an explicit
one-time job after the migration and before publishing links to the new pages.

## Events, Career and Projects

`/events`, `/career` and `/projects` (plus their `/[slug]` detail pages) use Payload
collections (`events`, `projects`, `vacancies`, `job-applications`, `resumes`) and three
page globals (`events-page`, `projects-page`, `career-page`). `bun run seed:pages` also
seeds the career page's 7 vacancies (from `template/career.md`) and one real project,
"TM Nxera, Johor" (Ongoing) — both skipped on rerun once they exist.

Career applications post to `POST /api/career-applications` (multipart form data, PDF résumé
up to 5MB). Applications and résumés are private: only authenticated staff can read or
download them, matching the `enquiries` pattern above.

**Private résumé bucket.** Résumés need their own GCS bucket, separate from public media:

- `GCS_RESUME_BUCKET` is required whenever `GCS_BUCKET` is set (the config throws otherwise).
- Create the bucket with uniform bucket-level access and public access prevention **on** —
  never grant `allUsers`/`allAuthenticatedUsers`. Downloads are only ever served through
  Payload's own access-controlled `/api/resumes/file/*` route.
- Grant the Cloud Run service account (the same one used for the media bucket) `roles/storage.objectAdmin`
  on this bucket, and set `GCS_RESUME_BUCKET` on both the Cloud Run service and the
  `itu-web-migrate` job alongside `GCS_BUCKET`.

## Our Services pages

The five `/services/*` routes (linked from the "Our Services" nav dropdown) use Payload
globals grouped under "Our Services" in the admin: `service-data-centre`,
`service-high-tension`, `service-project-management`, `service-facilities-management` and
`service-dfma`. `bun run seed:pages` seeds their text from the matching template in
`template/`; rerunning it preserves any CMS edits, same as the other page seeds.

Every banner, section and card image is an optional upload. An empty one renders a styled
placeholder (the same technical-grid/orange-linework look as the rest of the site); uploading
an image replaces it at the same aspect ratio, and clearing the upload brings the placeholder
back. Uploads respect the media collection's focal point for cropping. The Data Centre page's
equipment gallery shows one neutral placeholder with no upload, a static image with one, and
the existing carousel controls once an editor adds a second. The DFMA page's closing visual
falls back to an inline SVG diagram until an image is uploaded.

## Build brief

The next build's requirements live in `template/important.md` and `template/landing.md`.
