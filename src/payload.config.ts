import { postgresAdapter } from '@payloadcms/db-postgres'
import { gcsStorage } from '@payloadcms/storage-gcs'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Landing } from '@/globals/Landing'
import { Settings } from '@/globals/Settings'
import {
  AboutUs,
  CareerPage,
  ContactUs,
  EventsPage,
  PrivacyPolicy,
  ProjectsPage,
  TermsAndConditions,
} from '@/globals/InnerPages'
import {
  ServiceDataCentre,
  ServiceDfma,
  ServiceFacilitiesManagement,
  ServiceHighTension,
  ServiceProjectManagement,
} from '@/globals/Services'
import { Enquiries } from '@/collections/Enquiries'
import { Events } from '@/collections/Events'
import { Projects } from '@/collections/Projects'
import { Vacancies } from '@/collections/Vacancies'
import { JobApplications } from '@/collections/JobApplications'
import { Resumes } from '@/collections/Resumes'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Unset GCS_BUCKET (e.g. local dev) falls back to Payload's local-disk uploads.
// `options: {}` relies on Application Default Credentials — the Cloud Run service account
// in production, `gcloud auth application-default login` locally — no key file to manage.
// Résumés always need their own private bucket in production: if media is on GCS, résumés
// must be too, since Cloud Run's disk isn't persistent and isn't private.
if (process.env.GCS_BUCKET && !process.env.GCS_RESUME_BUCKET) {
  throw new Error(
    'GCS_RESUME_BUCKET must be set alongside GCS_BUCKET (résumés need their own private bucket).',
  )
}
const gcsPlugins = process.env.GCS_BUCKET
  ? [
      gcsStorage({ collections: { media: true }, bucket: process.env.GCS_BUCKET, options: {} }),
      gcsStorage({
        collections: { resumes: true },
        bucket: process.env.GCS_RESUME_BUCKET!,
        options: {},
      }),
    ]
  : []

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: '— ITU CMS' },
  },
  editor: lexicalEditor(),
  collections: [Users, Media, Enquiries, Events, Projects, Vacancies, JobApplications, Resumes],
  globals: [
    Landing,
    Settings,
    AboutUs,
    ContactUs,
    PrivacyPolicy,
    TermsAndConditions,
    EventsPage,
    ProjectsPage,
    CareerPage,
    ServiceDataCentre,
    ServiceHighTension,
    ServiceProjectManagement,
    ServiceFacilitiesManagement,
    ServiceDfma,
  ],
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI ?? '',
      // Each Cloud Run instance gets its own pool — keep this below Cloud SQL's connection
      // limit divided by --max-instances. See the gcloud run deploy command for the pairing.
      max: Number(process.env.DATABASE_POOL_MAX) || 10,
    },
    push: process.env.NODE_ENV === 'development',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [...gcsPlugins],
})
