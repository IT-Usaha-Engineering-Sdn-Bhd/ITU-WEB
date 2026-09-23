import { cache } from 'react'
import { getPayloadClient } from './payload'
import type { EventCategory, ProjectStatus } from './listing-utils'

const PAGE_SIZE = 12

export async function getEvents({ category, page }: { category: EventCategory; page: number }) {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'events',
    depth: 1,
    limit: PAGE_SIZE,
    page,
    where: { published: { equals: true }, category: { equals: category } },
    sort: '-eventDate',
  })
}

export const getEvent = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'events',
    depth: 1,
    limit: 1,
    where: { slug: { equals: slug }, published: { equals: true } },
  })
  return result.docs[0] ?? null
})

export async function getProjects({ status, page }: { status: ProjectStatus; page: number }) {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'projects',
    depth: 1,
    limit: PAGE_SIZE,
    page,
    where: { published: { equals: true }, status: { equals: status } },
    sort: ['order', '-commencementDate'],
  })
}

export const getProject = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'projects',
    depth: 1,
    limit: 1,
    where: { slug: { equals: slug }, published: { equals: true } },
  })
  return result.docs[0] ?? null
})

// All vacancies for the accordion list — open and closed both show, so applicants can see
// what's been filled. The application form itself only offers the open ones.
export const getVacancies = cache(async () => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'vacancies',
    depth: 0,
    limit: 100,
    sort: 'order',
  })
  return result.docs
})

export async function findOpenVacancy(key: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'vacancies',
    depth: 0,
    limit: 1,
    where: { key: { equals: key }, open: { equals: true } },
  })
  return result.docs[0] ?? null
}
