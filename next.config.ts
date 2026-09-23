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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Belt-and-braces alongside robots.ts — a crawler that ignores robots.txt still sees this.
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      { source: '/api/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
