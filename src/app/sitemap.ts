import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { siteUrl } from '@/lib/seo'

// Payload's local API doesn't participate in Next's fetch revalidation, so this always runs
// fresh — see the same note on (site)/layout.tsx.
export const dynamic = 'force-dynamic'

const STATIC_ROUTES = [
  '/',
  '/about-us',
  '/contact-us',
  '/career',
  '/events',
  '/projects',
  '/privacy-policy',
  '/tnc',
  '/services/data-centre-critical-system',
  '/services/dfma',
  '/services/facilities-management',
  '/services/high-tension',
  '/services/project-management',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const [events, projects] = await Promise.all([
    payload.find({
      collection: 'events',
      depth: 0,
      limit: 1000,
      where: { published: { equals: true } },
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'projects',
      depth: 0,
      limit: 1000,
      where: { published: { equals: true } },
      select: { slug: true, updatedAt: true },
    }),
  ])

  const staticEntries = STATIC_ROUTES.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }))
  const eventEntries = events.docs.map((doc) => ({
    url: `${siteUrl}/events/${doc.slug}`,
    lastModified: new Date(doc.updatedAt),
  }))
  const projectEntries = projects.docs.map((doc) => ({
    url: `${siteUrl}/projects/${doc.slug}`,
    lastModified: new Date(doc.updatedAt),
  }))

  return [...staticEntries, ...eventEntries, ...projectEntries]
}
