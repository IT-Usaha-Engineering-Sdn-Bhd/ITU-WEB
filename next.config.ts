import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_HOST

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: 'https', hostname: supabaseHost, pathname: '/storage/v1/object/public/**' }]
      : [],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
