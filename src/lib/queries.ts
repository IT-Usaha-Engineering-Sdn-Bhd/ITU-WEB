import { unstable_cache } from 'next/cache'
import type { Where } from 'payload'
import { getPayloadClient } from '@/lib/payload'

/** Every read goes through this so the single revalidateTag('content') hook invalidates everything. */
function cached<T>(key: string, fn: () => Promise<T>) {
  return unstable_cache(fn, [key], { tags: ['content'] })()
}

export const getSiteSettings = () => cached('siteSettings', async () => (await getPayloadClient()).findGlobal({ slug: 'siteSettings' }))

export const getHeaderNavigation = () => cached('headerNavigation', async () => (await getPayloadClient()).findGlobal({ slug: 'headerNavigation' }))

export const getFooterNavigation = () => cached('footerNavigation', async () => (await getPayloadClient()).findGlobal({ slug: 'footerNavigation' }))

export const getHomePage = () => cached('homePage', async () => (await getPayloadClient()).findGlobal({ slug: 'homePage' }))

export const getServices = () =>
  cached('services', async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'services', where: { status: { equals: 'published' } }, sort: 'order', limit: 50 })
    return res.docs
  })

export const getServiceBySlug = (slug: string) =>
  cached(`service:${slug}`, async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'services', where: { slug: { equals: slug }, status: { equals: 'published' } }, limit: 1 })
    return res.docs[0] ?? null
  })

export const getProjects = (projectStatus?: 'ongoing' | 'completed') =>
  cached(`projects:${projectStatus ?? 'all'}`, async () => {
    const payload = await getPayloadClient()
    const where: Where = projectStatus
      ? { and: [{ status: { equals: 'published' } }, { projectStatus: { equals: projectStatus } }] }
      : { status: { equals: 'published' } }
    const res = await payload.find({ collection: 'projects', where, sort: '-completionDate', limit: 100 })
    return res.docs
  })

export const getProjectBySlug = (slug: string) =>
  cached(`project:${slug}`, async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'projects', where: { slug: { equals: slug }, status: { equals: 'published' } }, limit: 1 })
    return res.docs[0] ?? null
  })

export const getMilestones = () =>
  cached('milestones', async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'milestones', where: { status: { equals: 'published' } }, sort: 'order', limit: 100 })
    return res.docs
  })

export const getEventCategories = () =>
  cached('eventCategories', async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'eventCategories', where: { status: { equals: 'published' } }, sort: 'order', limit: 50 })
    return res.docs
  })

export const getEvents = (categorySlug?: string) =>
  cached(`events:${categorySlug ?? 'all'}`, async () => {
    const payload = await getPayloadClient()
    let where: Where = { status: { equals: 'published' } }
    if (categorySlug) {
      const cat = await payload.find({ collection: 'eventCategories', where: { slug: { equals: categorySlug } }, limit: 1 })
      if (!cat.docs[0]) return []
      where = { and: [where, { category: { equals: cat.docs[0].id } }] }
    }
    const res = await payload.find({ collection: 'events', where, sort: '-eventDate', limit: 100, depth: 1 })
    return res.docs
  })

export const getEventBySlug = (slug: string) =>
  cached(`event:${slug}`, async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'events', where: { slug: { equals: slug }, status: { equals: 'published' } }, limit: 1, depth: 1 })
    return res.docs[0] ?? null
  })

export const getJobPositions = () =>
  cached('jobPositions', async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'jobPositions', where: { status: { equals: 'published' } }, sort: '-createdAt', limit: 50 })
    return res.docs
  })

export const getJobPositionBySlug = (slug: string) =>
  cached(`jobPosition:${slug}`, async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'jobPositions', where: { slug: { equals: slug }, status: { equals: 'published' } }, limit: 1 })
    return res.docs[0] ?? null
  })

export const getPolicy = (type: 'terms-conditions' | 'privacy-policy') =>
  cached(`policy:${type}`, async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'policies', where: { type: { equals: type } }, limit: 1 })
    return res.docs[0] ?? null
  })

export const getPageBySlug = (slug: string) =>
  cached(`page:${slug}`, async () => {
    const payload = await getPayloadClient()
    const res = await payload.find({ collection: 'pages', where: { slug: { equals: slug }, status: { equals: 'published' } }, limit: 1, depth: 2 })
    return res.docs[0] ?? null
  })
