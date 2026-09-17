# ITU-WEB

IT Usaha Engineering official website — a rebuild of [itusahaengineering.com](https://itusahaengineering.com/) on **Next.js 15 + Payload CMS 3 + Tailwind CSS v4**, deployed on **Vercel**.

Visual target: 100% parity with the live site's layout, spacing, type scale, and colours (measured from its Elementor kit, not guessed — see the design tokens in `src/app/globals.css`). Every image slot renders through `<Placeholder />` until real assets are uploaded in `/admin` — nothing is hotlinked from the old site.

Full architecture and content-migration plan: [`IT Usaha Engineering–Style Website.md`](<IT Usaha Engineering–Style Website.md>).

## Stack

- Next.js 15 (App Router, TypeScript, `trailingSlash: true` to match the old site's URLs)
- Payload CMS 3 embedded in the same app, admin at `/admin`
- Postgres (Supabase) via `@payloadcms/db-postgres`
- Supabase Storage (S3-compatible) via `@payloadcms/storage-s3`
- Tailwind CSS v4 (CSS-first `@theme`, no config file)
- Bun as the package manager/runner

## Getting started

```bash
bun install
cp .env.example .env   # fill in DATABASE_URI, PAYLOAD_SECRET, S3_*, etc.
bunx payload generate:types
bun run seed            # idempotent — populates services, projects, milestones, events, jobs, nav, home page
bun run dev
```

Admin: http://localhost:3000/admin — log in with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` (defaults: `admin@itusaha.com` / `change-me-now` — change this before deploying anywhere reachable).

## Scripts

| Command | What it does |
|---|---|
| `bun run dev` | Next dev server + Payload admin, schema auto-pushed to the DB |
| `bun run build` | Production build (requires a real Postgres connection to prerender project/service/event pages) |
| `bun run seed` | Idempotent content seed from the audit doc — safe to re-run |
| `bunx payload generate:types` | Regenerate `src/payload-types.ts` after any collection/global change |
| `bun run lint` | ESLint |

## Notes

- Contact and career forms write to Payload (`inquiries`, `jobApplications`) with Zod validation, a honeypot, and in-process rate limiting. Email notifications no-op until `RESEND_API_KEY` is set.
- CVs upload to a private `documents` collection (not the public `media` library) — never publicly readable.
- Publishing any collection/global calls `revalidateTag('content')` in-process, so content goes live without a redeploy.
