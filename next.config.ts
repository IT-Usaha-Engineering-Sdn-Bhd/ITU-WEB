import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_HOST

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: 'https', hostname: supabaseHost, pathname: '/storage/v1/object/public/**' }]
      : [],
    formats: ['image/avif', 'image/webp'],
  },
  // three / @react-three/* are deliberately NOT in serverExternalPackages — they must
  // never reach the server graph at all.
  // Do NOT hand-set serverExternalPackages: withPayload() already merges Payload's own
  // required externals, and overriding the key here can replace rather than merge them.
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
