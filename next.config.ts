import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Media is served same-origin through /api/media/file/* (Payload's own proxy route), so
  // next/image needs no remotePatterns entry regardless of storage backend.
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // three / @react-three/* are deliberately NOT in serverExternalPackages — they must
  // never reach the server graph at all.
  // Do NOT hand-set serverExternalPackages: withPayload() already merges Payload's own
  // required externals, and overriding the key here can replace rather than merge them.
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
