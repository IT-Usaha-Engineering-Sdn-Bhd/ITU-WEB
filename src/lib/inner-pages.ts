import { cache } from 'react'
import { getPayloadClient } from './payload'
import { withDefaults } from './site-content'
import defaults from './page-defaults.json'
import type {
  AboutUs,
  CareerPage,
  ContactUs,
  EventsPage,
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
  const saved = await (await getPayloadClient()).findGlobal({ slug: 'about-us', depth: 1 })
  return saved.headline
    ? withDefaults(defaults.aboutUs as AboutUs, saved)
    : (defaults.aboutUs as AboutUs)
})

export const getContactUs = cache(async () => {
  const saved = await (await getPayloadClient()).findGlobal({ slug: 'contact-us', depth: 1 })
  if (!saved.headline) return defaults.contactUs as ContactUs
  const merged = withDefaults(defaults.contactUs as ContactUs, saved)
  return { ...merged, form: withDefaults(defaults.contactUs.form, saved.form) }
})

export const getPrivacyPolicy = cache(async () => {
  const saved = await (await getPayloadClient()).findGlobal({ slug: 'privacy-policy' })
  return saved.heading
    ? withDefaults(defaults.privacyPolicy as PrivacyPolicy, saved)
    : (defaults.privacyPolicy as PrivacyPolicy)
})

export const getTerms = cache(async () => {
  const saved = await (await getPayloadClient()).findGlobal({ slug: 'terms-and-conditions' })
  return saved.heading
    ? withDefaults(defaults.termsAndConditions as TermsAndCondition, saved)
    : (defaults.termsAndConditions as TermsAndCondition)
})

export const getEventsPage = cache(async () => {
  const saved = await (await getPayloadClient()).findGlobal({ slug: 'events-page', depth: 1 })
  return saved.heading
    ? withDefaults(defaults.eventsPage as EventsPage, saved)
    : (defaults.eventsPage as EventsPage)
})

export const getProjectsPage = cache(async () => {
  const saved = await (await getPayloadClient()).findGlobal({ slug: 'projects-page', depth: 1 })
  if (!saved.heading) return defaults.projectsPage as ProjectsPage
  const merged = withDefaults(defaults.projectsPage as ProjectsPage, saved)
  return { ...merged, detailCta: withDefaults(defaults.projectsPage.detailCta, saved.detailCta) }
})

export const getCareerPage = cache(async () => {
  const saved = await (await getPayloadClient()).findGlobal({ slug: 'career-page', depth: 1 })
  if (!saved.heading) return defaults.careerPage as CareerPage
  const merged = withDefaults(defaults.careerPage as CareerPage, saved)
  return { ...merged, form: withDefaults(defaults.careerPage.form, saved.form) }
})

export const getServiceDataCentre = cache(async () => {
  const saved = await (
    await getPayloadClient()
  ).findGlobal({ slug: 'service-data-centre', depth: 1 })
  const base = defaults.serviceDataCentre as unknown as ServiceDataCentre
  return saved.heading ? withDefaults(base, saved) : base
})

export const getServiceHighTension = cache(async () => {
  const saved = await (
    await getPayloadClient()
  ).findGlobal({ slug: 'service-high-tension', depth: 1 })
  const base = defaults.serviceHighTension as unknown as ServiceHighTension
  return saved.heading ? withDefaults(base, saved) : base
})

export const getServiceProjectManagement = cache(async () => {
  const saved = await (
    await getPayloadClient()
  ).findGlobal({ slug: 'service-project-management', depth: 1 })
  const base = defaults.serviceProjectManagement as unknown as ServiceProjectManagement
  return saved.heading ? withDefaults(base, saved) : base
})

export const getServiceFacilitiesManagement = cache(async () => {
  const saved = await (
    await getPayloadClient()
  ).findGlobal({ slug: 'service-facilities-management', depth: 1 })
  const base = defaults.serviceFacilitiesManagement as unknown as ServiceFacilitiesManagement
  return saved.heading ? withDefaults(base, saved) : base
})

export const getServiceDfma = cache(async () => {
  const saved = await (await getPayloadClient()).findGlobal({ slug: 'service-dfma', depth: 1 })
  const base = defaults.serviceDfma as unknown as ServiceDfma
  return saved.heading ? withDefaults(base, saved) : base
})
