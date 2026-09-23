import { cache } from 'react'
import type { Metadata } from 'next'
import { getPayloadClient } from './payload'
import { mediaUrl } from './media'
import defaults from './page-defaults.json'
import type {
  AboutUs,
  CareerPage,
  ContactUs,
  EventsPage,
  Media,
  PrivacyPolicy,
  ProjectsPage,
  ServiceDataCentre,
  ServiceDfma,
  ServiceFacilitiesManagement,
  ServiceHighTension,
  ServiceProjectManagement,
  TermsAndCondition,
} from '@/payload-types'

export const getAboutUs = cache(async () => {
  const saved = await (await getPayloadClient()).findGlobal({ slug: 'about-us' })
  return saved.headline ? saved : (defaults.aboutUs as AboutUs)
})

export const getContactUs = cache(async () => {
  const saved = await (await getPayloadClient()).findGlobal({ slug: 'contact-us' })
  return saved.headline ? saved : (defaults.contactUs as ContactUs)
})

export const getPrivacyPolicy = cache(async () => {
  const saved = await (await getPayloadClient()).findGlobal({ slug: 'privacy-policy' })
  return saved.heading ? saved : (defaults.privacyPolicy as PrivacyPolicy)
})

export const getTerms = cache(async () => {
  const saved = await (await getPayloadClient()).findGlobal({ slug: 'terms-and-conditions' })
  return saved.heading ? saved : (defaults.termsAndConditions as TermsAndCondition)
})

export const getEventsPage = cache(async () => {
  const saved = await (await getPayloadClient()).findGlobal({ slug: 'events-page' })
  return saved.heading ? saved : (defaults.eventsPage as EventsPage)
})

export const getProjectsPage = cache(async () => {
  const saved = await (await getPayloadClient()).findGlobal({ slug: 'projects-page' })
  return saved.heading ? saved : (defaults.projectsPage as ProjectsPage)
})

export const getCareerPage = cache(async () => {
  const saved = await (await getPayloadClient()).findGlobal({ slug: 'career-page' })
  return saved.heading ? saved : (defaults.careerPage as CareerPage)
})

export const getServiceDataCentre = cache(async () => {
  const saved = await (
    await getPayloadClient()
  ).findGlobal({ slug: 'service-data-centre', depth: 1 })
  return saved.heading ? saved : (defaults.serviceDataCentre as unknown as ServiceDataCentre)
})

export const getServiceHighTension = cache(async () => {
  const saved = await (
    await getPayloadClient()
  ).findGlobal({ slug: 'service-high-tension', depth: 1 })
  return saved.heading ? saved : (defaults.serviceHighTension as unknown as ServiceHighTension)
})

export const getServiceProjectManagement = cache(async () => {
  const saved = await (
    await getPayloadClient()
  ).findGlobal({ slug: 'service-project-management', depth: 1 })
  return saved.heading
    ? saved
    : (defaults.serviceProjectManagement as unknown as ServiceProjectManagement)
})

export const getServiceFacilitiesManagement = cache(async () => {
  const saved = await (
    await getPayloadClient()
  ).findGlobal({ slug: 'service-facilities-management', depth: 1 })
  return saved.heading
    ? saved
    : (defaults.serviceFacilitiesManagement as unknown as ServiceFacilitiesManagement)
})

export const getServiceDfma = cache(async () => {
  const saved = await (await getPayloadClient()).findGlobal({ slug: 'service-dfma', depth: 1 })
  return saved.heading ? saved : (defaults.serviceDfma as unknown as ServiceDfma)
})

// Shared generateMetadata for the five service pages: seo fields, falling back to the hero
// image for the OG image when no dedicated ogImage upload is set.
type ServiceSeoSource = {
  seo?: {
    title?: string | null
    description?: string | null
    ogImage?: number | Media | null
  } | null
  heroImage?: number | Media | null
}
export function serviceMetadata(
  data: ServiceSeoSource,
  fallbackTitle: string,
  path: string,
): Metadata {
  const image = mediaUrl(data.seo?.ogImage) ?? mediaUrl(data.heroImage)
  return {
    title: data.seo?.title || fallbackTitle,
    description: data.seo?.description,
    alternates: { canonical: path },
    openGraph: { images: image ? [{ url: image }] : undefined },
  }
}
