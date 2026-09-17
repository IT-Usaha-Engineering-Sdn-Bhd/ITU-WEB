import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Media } from '@/collections/Media'
import { Documents } from '@/collections/Documents'
import { Users } from '@/collections/Users'
import { Pages } from '@/collections/Pages'
import { Services } from '@/collections/Services'
import { Projects } from '@/collections/Projects'
import { Milestones } from '@/collections/Milestones'
import { Events } from '@/collections/Events'
import { EventCategories } from '@/collections/EventCategories'
import { JobPositions } from '@/collections/JobPositions'
import { Policies } from '@/collections/Policies'
import { Inquiries } from '@/collections/Inquiries'
import { JobApplications } from '@/collections/JobApplications'

import { SiteSettings } from '@/globals/SiteSettings'
import { HeaderNavigation } from '@/globals/HeaderNavigation'
import { FooterNavigation } from '@/globals/FooterNavigation'
import { HomePage } from '@/globals/HomePage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: '— IT Usaha Engineering CMS' },
  },
  editor: lexicalEditor(),
  collections: [
    Users,
    Media,
    Documents,
    Pages,
    Services,
    Projects,
    Milestones,
    Events,
    EventCategories,
    JobPositions,
    Policies,
    Inquiries,
    JobApplications,
  ],
  globals: [SiteSettings, HeaderNavigation, FooterNavigation, HomePage],
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI ?? '' },
  }),
  sharp,
  plugins:
    process.env.S3_BUCKET
      ? [
          s3Storage({
            collections: { media: true },
            bucket: process.env.S3_BUCKET,
            config: {
              endpoint: process.env.S3_ENDPOINT,
              region: process.env.S3_REGION,
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
              },
              forcePathStyle: true,
            },
          }),
        ]
      : [],
})
