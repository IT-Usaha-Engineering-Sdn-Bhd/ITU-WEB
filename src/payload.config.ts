import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Supabase Storage's S3-compatible endpoint for the `media` bucket.
const s3Plugins = process.env.S3_ENDPOINT
  ? [
      s3Storage({
        collections: { media: true },
        bucket: process.env.S3_BUCKET_MEDIA ?? 'itu-web-media',
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
  : []

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: '— ITU CMS' },
  },
  editor: lexicalEditor(),
  collections: [Users, Media],
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    // Supavisor pooler, never the direct db.*.supabase.co host — the pooler is IPv4 on every
    // plan, the direct host is IPv6-only without the paid add-on. See .env.example.
    //
    // The connection string must carry `?sslmode=no-verify`, not `require`: `pg` re-parses
    // `connectionString` and that overrides any `ssl` object set here (see
    // pg/lib/connection-parameters.js — `Object.assign({}, config, parse(connectionString))`),
    // and pg-connection-string only maps `no-verify` to `rejectUnauthorized: false`; `require`
    // just warns and leaves strict verification on, which fails against the pooler's cert with
    // "self-signed certificate in certificate chain". Setting `ssl` here would be inert.
    pool: {
      connectionString: process.env.DATABASE_URI ?? '',
      // max:1 is load-bearing on Vercel — each serverless instance gets its own pool, and a
      // higher max there exhausts the pooler under load. Locally there's no such constraint.
      // `VERCEL` is auto-set by the Vercel runtime, so this only ever widens locally.
      max: process.env.VERCEL ? 1 : Number(process.env.DATABASE_POOL_MAX) || 10,
    },
    push: process.env.NODE_ENV === 'development',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [...s3Plugins],
})
