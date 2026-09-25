# ITU-WEB

IT Usaha Engineering's marketing site: Next.js (App Router) · React Three Fiber · Three.js ·
anime.js · TailwindCSS · PayloadCMS · Docker · Google Cloud Run · Cloud SQL (Postgres) ·
Google Cloud Storage.

## Setup

```bash
bun install
cp .env.example .env   # set DATABASE_URI + a non-empty PAYLOAD_SECRET
# Bring up Postgres (see Local Docker), then:
bun run migrate
bun run seed && bun run seed:pages   # optional, first run
bun dev
```

- `/` — homepage: R3F canvas, anime.js reveal, all copy and imagery editable in Payload
- `/admin` — Payload admin (first run prompts you to create an admin user)

Use the compose DB on port **5434** unless you already have a matching local Postgres role
and database on **5432**. Leave `GCS_*` unset for local disk uploads unless you intentionally
target non-production buckets (do not point a local `.env` at production buckets by accident).

## Local Docker

Two supported paths. Credentials `payload` / `payload` and the compose `PAYLOAD_SECRET`
fallback `dev-secret-change-me` are **local-only** — production uses Secret Manager.

| Port             | Role                                       |
| ---------------- | ------------------------------------------ |
| `5432`           | Native Postgres on the host (if installed) |
| `127.0.0.1:5434` | Compose `db` (maps to container `5432`)    |
| `5435`           | Cloud SQL Auth Proxy (see Deploy)          |
| `127.0.0.1:3000` | Compose `app` (full-stack path)            |

**Recommended — host app + compose DB**

```bash
bun run docker:up:db
# .env: DATABASE_URI=postgresql://payload:payload@localhost:5434/payload
bun run migrate
bun run seed && bun run seed:pages   # optional
bun dev
```

**Full stack — migrate then serve in Docker**

```bash
bun run docker:up
# waits for a healthy DB, runs `payload migrate`, then starts the app on 127.0.0.1:3000
```

Compose `app` / `migrate` hardcode `DATABASE_URI` to `postgresql://payload:payload@db:5432/payload`
(they do not use the host `.env` URI). They interpolate `PAYLOAD_SECRET` from the project
`.env` when set. `GCS_*` is not passed into compose — uploads inside the container use local
disk and are ephemeral.

`bun run docker:down` removes containers and keeps the named volume `*-db-data`.  
**Do not** run `docker compose down -v` unless you intend to wipe local CMS data.

## Structure

- `src/payload.config.ts` — Payload config (Postgres adapter + GCS storage adapter)
- `src/collections/` — content collections (`Events`, `Projects`, `Vacancies`, `Enquiries`,
  `JobApplications`, `Resumes`, `Media`, `Users`)
- `src/globals/` — page-level content: `Landing`, `Settings` (brand/nav/footer), `InnerPages`
  (about/contact/policy/events/projects/career pages), `Services` (the five `/services/*` pages)
- `src/three/` — `GlobalCanvas.tsx` (the single persistent R3F canvas), `Scene.tsx`
  (client-only dynamic wrapper)
- `src/app/(site)/` — public routes
- `src/app/(payload)/` — Payload-generated admin + API routes (do not hand-edit)

## Env vars

See `.env.example` for the full list and port / GCS guidance. For local work, set a real
`PAYLOAD_SECRET` and prefer unset `GCS_BUCKET` / `GCS_RESUME_BUCKET` so media stays on disk.

## Editable content

Every page's headers, body copy, captions, button labels, banners and background/hero images
are Payload-driven, either through a page global (`about-us`, `contact-us`, `landing`, the five
`service-*` globals, …) or through **Settings** for chrome that's shared across pages: the logo,
site name, nav and footer links, footer text, and a handful of shared labels (legal-page eyebrow,
banner placeholder kicker/wordmark). A field left empty falls back to a sensible built-in default
per field, not per page — clearing one field never blanks out its neighbours.

Contact form submissions are saved in the `enquiries` collection for authenticated staff to
review. No email adapter is required.

### About, Contact and policy pages

The `/about-us`, `/contact-us`, `/privacy-policy` and `/tnc` routes use Payload globals. After
applying migrations, run `bun run seed:pages` once to populate them from the four matching
Markdown files in `template/backend/`. The seed skips pages that already contain content, so rerunning
it preserves CMS edits. Banner, portrait and milestone images are optional uploads in Payload;
the text seed leaves them empty and the pages show styled placeholders.

### Events, Career and Projects

`/events`, `/career` and `/projects` (plus their `/[slug]` detail pages) use Payload collections
(`events`, `projects`, `vacancies`, `job-applications`, `resumes`) and three page globals
(`events-page`, `projects-page`, `career-page`). `bun run seed:pages` also seeds the career
page's 7 vacancies (from `template/backend/career.md`) and one real project, "TM Nxera, Johor"
(Ongoing) — both skipped on rerun once they exist.

Career applications post to `POST /api/career-applications` (multipart form data, PDF résumé up
to 5MB). Applications and résumés are private: only authenticated staff can read or download
them, matching the `enquiries` pattern above.

**Private résumé bucket.** Résumés need their own GCS bucket, separate from public media:

- `GCS_RESUME_BUCKET` is required whenever `GCS_BUCKET` is set (the config throws otherwise).
- Create the bucket with uniform bucket-level access and public access prevention **on** — never
  grant `allUsers`/`allAuthenticatedUsers`. Downloads are only ever served through Payload's own
  access-controlled `/api/resumes/file/*` route.
- Grant the Cloud Run service account (the same one used for the media bucket)
  `roles/storage.objectAdmin` on this bucket, and set `GCS_RESUME_BUCKET` on both the Cloud Run
  service and the `itu-web-migrate` job alongside `GCS_BUCKET`.

### Our Services pages

The five `/services/*` routes (linked from the "Our Services" nav dropdown, itself editable in
Settings) use Payload globals grouped under "Our Services" in the admin: `service-data-centre`,
`service-high-tension`, `service-project-management`, `service-facilities-management` and
`service-dfma`. `bun run seed:pages` seeds their text from the matching template in `template/backend/`;
rerunning it preserves any CMS edits, same as the other page seeds.

Every banner, section and card image is an optional upload. An empty one renders a styled
placeholder (the same technical-grid/orange-linework look as the rest of the site); uploading an
image replaces it at the same aspect ratio, and clearing the upload brings the placeholder back.
Uploads respect the media collection's focal point for cropping. The Data Centre page's equipment
gallery shows one neutral placeholder with no upload, a static image with one, and the existing
carousel controls once an editor adds a second. The DFMA page's closing visual falls back to an
inline SVG diagram until an image is uploaded.

## SEO

- `src/app/sitemap.ts` and `src/app/robots.ts` are generated from `SERVER_URL`; `/admin` and
  `/api` are disallowed.
- Every page sets its own title/description/canonical/Open Graph via `src/lib/seo.ts`, backed by
  each page's `seo` group in the admin (falling back to the hero/cover image when no dedicated
  OG image is uploaded).
- Site-wide defaults (default title, description, favicon, social share image, organisation
  JSON-LD) live under Settings → Brand & SEO.

---

## Deploy

Docker image + Cloud Run, with migrations run as a separate Cloud Run Job (`payload migrate`
doesn't run during `next build`). For local bring-up, migrate, and `down` vs `down -v`, see
**Local Docker** above.

The image is multi-stage (`deps` → `builder` → `runner`). The final runner still includes
`src/` and `template/backend` so the same Artifact Registry tag can run `next start`,
`payload migrate`, and the seed script overrides used by Cloud Run jobs.

The commands below set up the whole stack from scratch, and match what's actually deployed:
project **`prod-web-itu`**, region **`asia-southeast1`**, Artifact Registry repo **`itu-web`**,
Cloud Run service **`itu-web`**, migration job **`itu-web-migrate`**, Cloud SQL instance
**`itu-web-db`**, runtime service account **`itu-web-run`**, and the GitHub Actions deploy
service account **`github-deployer`**. Swap in your own project ID and, for the custom domain
section, your own domain in place of `itusaha.com`.

### 1. Project and APIs

```bash
gcloud config set project prod-web-itu
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  iamcredentials.googleapis.com \
  compute.googleapis.com \
  storage.googleapis.com
```

### 2. Artifact Registry

```bash
gcloud artifacts repositories create itu-web \
  --repository-format=docker \
  --location=asia-southeast1
```

### 3. Cloud SQL (Postgres)

```bash
gcloud sql instances create itu-web-db \
  --database-version=POSTGRES_18 \
  --tier=db-custom-1-3840 \
  --region=asia-southeast1 \
  --availability-type=ZONAL \
  --storage-auto-increase

gcloud sql databases create payload --instance=itu-web-db

DB_PASSWORD=$(openssl rand -base64 24)
gcloud sql users create payload --instance=itu-web-db --password="$DB_PASSWORD"
echo "payload user password: $DB_PASSWORD"   # save this, it's not stored anywhere else
```

### 4. Secrets

```bash
CONNECTION_NAME=$(gcloud sql instances describe itu-web-db --format='value(connectionName)')

printf 'postgresql://payload:%s@/payload?host=/cloudsql/%s' "$DB_PASSWORD" "$CONNECTION_NAME" \
  | gcloud secrets create DATABASE_URI --data-file=-

openssl rand -base64 32 | gcloud secrets create PAYLOAD_SECRET --data-file=-
```

### 5. GCS buckets

Bucket names must be globally unique — prefixing with the project ID (as below) is the simplest
way to guarantee that.

```bash
for BUCKET in itu-web-media itu-web-resumes; do
  gcloud storage buckets create "gs://prod-web-itu-$BUCKET" \
    --location=asia-southeast1 \
    --uniform-bucket-level-access \
    --public-access-prevention
done
```

### 6. Runtime service account

```bash
gcloud iam service-accounts create itu-web-run --display-name="ITU-WEB Cloud Run runtime"
RUN_SA=itu-web-run@prod-web-itu.iam.gserviceaccount.com

gcloud projects add-iam-policy-binding prod-web-itu \
  --member="serviceAccount:$RUN_SA" --role=roles/cloudsql.client

for SECRET in DATABASE_URI PAYLOAD_SECRET; do
  gcloud secrets add-iam-policy-binding "$SECRET" \
    --member="serviceAccount:$RUN_SA" --role=roles/secretmanager.secretAccessor
done

for BUCKET in itu-web-media itu-web-resumes; do
  gcloud storage buckets add-iam-policy-binding "gs://prod-web-itu-$BUCKET" \
    --member="serviceAccount:$RUN_SA" --role=roles/storage.objectAdmin
done
```

### 7. GitHub Actions deploy service account + Workload Identity Federation

No key files: GitHub authenticates as this service account via short-lived OIDC tokens, scoped
to this one repo.

```bash
gcloud iam service-accounts create github-deployer --display-name="GitHub Actions Deployer"
DEPLOY_SA=github-deployer@prod-web-itu.iam.gserviceaccount.com

gcloud projects add-iam-policy-binding prod-web-itu \
  --member="serviceAccount:$DEPLOY_SA" --role=roles/run.admin
gcloud projects add-iam-policy-binding prod-web-itu \
  --member="serviceAccount:$DEPLOY_SA" --role=roles/cloudbuild.builds.editor
gcloud projects add-iam-policy-binding prod-web-itu \
  --member="serviceAccount:$DEPLOY_SA" --role=roles/artifactregistry.writer

gcloud iam workload-identity-pools create github-pool \
  --location=global --display-name="GitHub Actions"

gcloud iam workload-identity-pools providers create-oidc github-provider \
  --location=global \
  --workload-identity-pool=github-pool \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --attribute-condition="assertion.repository=='IT-Usaha-Engineering-Sdn-Bhd/ITU-WEB'"

PROJECT_NUMBER=$(gcloud projects describe prod-web-itu --format='value(projectNumber)')
gcloud iam service-accounts add-iam-policy-binding "$DEPLOY_SA" \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/attribute.repository/IT-Usaha-Engineering-Sdn-Bhd/ITU-WEB"

# Repo variables the workflow reads (Settings → Secrets and variables → Actions → Variables):
WIF_PROVIDER="projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/providers/github-provider"
gh variable set GCP_WIF_PROVIDER --body "$WIF_PROVIDER" --repo IT-Usaha-Engineering-Sdn-Bhd/ITU-WEB
gh variable set GCP_DEPLOY_SA --body "$DEPLOY_SA" --repo IT-Usaha-Engineering-Sdn-Bhd/ITU-WEB
```

### 8. First image

```bash
gcloud auth configure-docker asia-southeast1-docker.pkg.dev --quiet
docker build -t asia-southeast1-docker.pkg.dev/prod-web-itu/itu-web/app:initial .
docker push asia-southeast1-docker.pkg.dev/prod-web-itu/itu-web/app:initial
```

### 9. Migration job

```bash
gcloud run jobs create itu-web-migrate \
  --project=prod-web-itu --region=asia-southeast1 \
  --image=asia-southeast1-docker.pkg.dev/prod-web-itu/itu-web/app:initial \
  --command=npx --args=payload,migrate \
  --service-account="$RUN_SA" \
  --set-cloudsql-instances="$CONNECTION_NAME" \
  --set-secrets=DATABASE_URI=DATABASE_URI:latest,PAYLOAD_SECRET=PAYLOAD_SECRET:latest \
  --set-env-vars="GCS_BUCKET=prod-web-itu-itu-web-media,GCS_RESUME_BUCKET=prod-web-itu-itu-web-resumes"

gcloud run jobs execute itu-web-migrate --project=prod-web-itu --region=asia-southeast1 --wait
```

### 10. One-time content seed

Run once, right after the first migration, then delete the job — it's not needed again.

```bash
gcloud run jobs create itu-web-seed \
  --project=prod-web-itu --region=asia-southeast1 \
  --image=asia-southeast1-docker.pkg.dev/prod-web-itu/itu-web/app:initial \
  --command=sh --args="-c,bun run seed && bun run seed:pages" \
  --service-account="$RUN_SA" \
  --set-cloudsql-instances="$CONNECTION_NAME" \
  --set-secrets=DATABASE_URI=DATABASE_URI:latest,PAYLOAD_SECRET=PAYLOAD_SECRET:latest

gcloud run jobs execute itu-web-seed --project=prod-web-itu --region=asia-southeast1 --wait
gcloud run jobs delete itu-web-seed --project=prod-web-itu --region=asia-southeast1 --quiet
```

### 11. Cloud Run service

`--ingress internal-and-cloud-load-balancing` means the service is only reachable through the
load balancer set up in step 12 (plus other Google-internal traffic) — not directly at its
`*.run.app` URL — so the Cloud Armor rate limiting below can't be bypassed.

```bash
gcloud run deploy itu-web \
  --project=prod-web-itu --region=asia-southeast1 \
  --image=asia-southeast1-docker.pkg.dev/prod-web-itu/itu-web/app:initial \
  --service-account="$RUN_SA" \
  --allow-unauthenticated \
  --ingress=internal-and-cloud-load-balancing \
  --add-cloudsql-instances="$CONNECTION_NAME" \
  --set-secrets=DATABASE_URI=DATABASE_URI:latest,PAYLOAD_SECRET=PAYLOAD_SECRET:latest \
  --set-env-vars="SERVER_URL=https://itusaha.com,GCS_BUCKET=prod-web-itu-itu-web-media,GCS_RESUME_BUCKET=prod-web-itu-itu-web-resumes,DATABASE_POOL_MAX=10" \
  --max-instances=3 \
  --memory=1Gi
```

### 12. Load balancer, Cloud Armor and the custom domain

Puts a global HTTPS load balancer with a managed SSL cert and a Cloud Armor rate limit in front
of Cloud Run — the same LB serves both `itusaha.com` and `www.itusaha.com`.

```bash
# Static IP
gcloud compute addresses create itu-web-ip --global

# Serverless NEG + backend service
gcloud compute network-endpoint-groups create itu-web-neg \
  --region=asia-southeast1 --network-endpoint-type=serverless \
  --cloud-run-service=itu-web

gcloud compute backend-services create itu-web-backend \
  --global --load-balancing-scheme=EXTERNAL_MANAGED \
  --protocol=HTTPS
gcloud compute backend-services add-backend itu-web-backend \
  --global --network-endpoint-group=itu-web-neg \
  --network-endpoint-group-region=asia-southeast1

# Cloud Armor: rate-limit the two public form endpoints per client IP
gcloud compute security-policies create itu-web-policy \
  --description="Rate limit contact/career form submissions"
gcloud compute security-policies rules create 1000 \
  --security-policy=itu-web-policy \
  --expression="request.path.matches('/api/(contact|career-applications)')" \
  --action=rate-based-ban \
  --rate-limit-threshold-count=10 \
  --rate-limit-threshold-interval-sec=60 \
  --ban-duration-sec=600 \
  --conform-action=allow --exceed-action=deny-429 \
  --enforce-on-key=IP
gcloud compute backend-services update itu-web-backend \
  --global --security-policy=itu-web-policy

# Managed cert for both hostnames
gcloud compute ssl-certificates create itu-web-cert \
  --domains=itusaha.com,www.itusaha.com --global

# HTTPS: URL map (www -> apex redirect), target proxy, forwarding rule
gcloud compute url-maps create itu-web-https-map --default-service=itu-web-backend
gcloud compute url-maps import itu-web-https-map --global <<'EOF'
name: itu-web-https-map
defaultService: projects/prod-web-itu/global/backendServices/itu-web-backend
hostRules:
  - hosts: ["www.itusaha.com"]
    pathMatcher: www-redirect
pathMatchers:
  - name: www-redirect
    defaultUrlRedirect:
      hostRedirect: itusaha.com
      httpsRedirect: true
      stripQuery: false
      redirectResponseCode: MOVED_PERMANENTLY_DEFAULT
EOF
gcloud compute target-https-proxies create itu-web-https-proxy \
  --url-map=itu-web-https-map --ssl-certificates=itu-web-cert
gcloud compute forwarding-rules create itu-web-https-rule \
  --global --address=itu-web-ip --target-https-proxy=itu-web-https-proxy --ports=443

# HTTP -> HTTPS redirect on port 80
gcloud compute url-maps import itu-web-http-map --global <<'EOF'
name: itu-web-http-map
defaultUrlRedirect:
  httpsRedirect: true
  stripQuery: false
  redirectResponseCode: MOVED_PERMANENTLY_DEFAULT
EOF
gcloud compute target-http-proxies create itu-web-http-proxy --url-map=itu-web-http-map
gcloud compute forwarding-rules create itu-web-http-rule \
  --global --address=itu-web-ip --target-http-proxy=itu-web-http-proxy --ports=80
```

Point DNS at the LB's IP, then wait for the managed cert to go `ACTIVE`:

```bash
gcloud compute addresses describe itu-web-ip --global --format='value(address)'
# Create an A record for both @ and www at your DNS provider pointing at that IP.

gcloud compute ssl-certificates describe itu-web-cert --format='value(managed.status)'
# ACTIVE once DNS has propagated and Google has issued the cert (can take up to ~1 hour).
```

### 13. First admin user and subsequent deploys

Once the cert is active, create the first admin user at `https://itusaha.com/admin` — Payload
prompts for this on first run. From then on, pushing to the `production` branch runs
`.github/workflows/deploy-production.yml`, which builds a new image, runs the migration job, and
redeploys the service — no manual `gcloud` needed for routine deploys.

### Connecting to the production database

Cloud SQL has no public IP, so use the [Cloud SQL Auth
Proxy](https://cloud.google.com/sql/docs/postgres/sql-proxy) with your own `gcloud` credentials
(needs `roles/cloudsql.client` on `prod-web-itu`):

```bash
# port 5435 — 5432 is a native Postgres install, 5434 is this repo's docker-compose db
cloud-sql-proxy --port=5435 prod-web-itu:asia-southeast1:itu-web-db
# then, in another shell:
psql "postgresql://payload:$DB_PASSWORD@127.0.0.1:5435/payload"

# or, to (re)run the seed scripts against production:
export DATABASE_URI="postgresql://payload:$DB_PASSWORD@127.0.0.1:5435/payload"
export PAYLOAD_SECRET=$(gcloud secrets versions access latest --secret=PAYLOAD_SECRET)
bun run seed && bun run seed:pages
```

## Build brief

The next build's requirements live in `template/frontend/important.md` and
`template/frontend/landing.md`.
