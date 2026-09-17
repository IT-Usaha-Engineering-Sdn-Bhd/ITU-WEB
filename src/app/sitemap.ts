import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

const BASE = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

const staticRoutes = [
  '/',
  '/about-us/',
  '/projects/',
  '/project-status/completed-projects/',
  '/project-status/ongoing-projects/',
  '/events/',
  '/career/',
  '/contact-us/',
  '/terms-conditions/',
  '/privacy-policy/',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()

  const [services, projects, events] = await Promise.all([
    payload.find({ collection: 'services', where: { status: { equals: 'published' } }, limit: 50 }),
    payload.find({ collection: 'projects', where: { status: { equals: 'published' } }, limit: 100 }),
    payload.find({ collection: 'events', where: { status: { equals: 'published' } }, limit: 100 }),
  ])

  const entries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({ url: `${BASE}${path}` }))
  services.docs.forEach((s) => entries.push({ url: `${BASE}/our-service/${s.slug}/` }))
  projects.docs.forEach((p) => entries.push({ url: `${BASE}/project/${p.slug}/` }))
  events.docs.forEach((e) => entries.push({ url: `${BASE}/event/${e.slug}/` }))

  return entries
}
