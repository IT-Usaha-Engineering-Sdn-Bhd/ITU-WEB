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

## Build brief

The next build's requirements live in `template/important.md` and `template/landing.md`.
