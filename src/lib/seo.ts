import type { Metadata } from 'next'
import { mediaUrl } from './media'
import type { Media } from '@/payload-types'

const siteUrl = process.env.SERVER_URL ?? 'http://localhost:3000'

type SeoSource = {
  seo?: {
    title?: string | null
    description?: string | null
    ogImage?: number | Media | null
  } | null
  heroImage?: number | Media | null
  cover?: number | Media | null
}

// Shared generateMetadata for every inner/service/detail page: title, description, canonical
// and a full openGraph (siteName/type/locale included — Next replaces, not merges, a child
// page's openGraph, so leaving those out here would silently drop them). Falls back to
// heroImage/cover for the share image when no dedicated ogImage upload is set.
export function pageMetadata(
  data: SeoSource,
  fallbackTitle: string,
  path: string,
  siteName: string,
): Metadata {
  const image = mediaUrl(data.seo?.ogImage) ?? mediaUrl(data.heroImage) ?? mediaUrl(data.cover)
  const title = data.seo?.title || fallbackTitle
  const description = data.seo?.description ?? undefined
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName,
      locale: 'en_MY',
      title,
      description,
      url: path,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: { card: 'summary_large_image' },
  }
}

export { siteUrl }
