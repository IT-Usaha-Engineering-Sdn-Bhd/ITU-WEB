# ITU-WEB

Blank starter: Next.js · React Three Fiber · Three.js · anime.js · TailwindCSS · PayloadCMS ·
Supabase (Postgres + Storage) · Vercel.

## Setup

```bash
bun install
cp .env.example .env   # fill in Supabase credentials + PAYLOAD_SECRET
bun dev
```

- `/` — homepage: R3F canvas, anime.js reveal, Payload media count
- `/admin` — Payload admin (first run prompts you to create an admin user)

## Structure

- `src/payload.config.ts` — Payload config (Postgres adapter + S3 storage adapter for Supabase)
- `src/collections/` — `Users`, `Media`
- `src/three/` — `GlobalCanvas.tsx` (R3F scene), `Scene.tsx` (client-only dynamic wrapper)
- `src/components/Reveal.tsx` — anime.js proof-of-wiring
- `src/app/(site)/` — public routes
- `src/app/(payload)/` — Payload-generated admin + API routes (do not hand-edit)

## Env vars

See `.env.example` for the full list and comments on non-obvious values (pooler port, sslmode).

## Build brief

The next build's requirements live in `template/important.md` and `template/landing.md`.
