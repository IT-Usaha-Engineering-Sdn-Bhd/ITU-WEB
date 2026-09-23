import { cache } from 'react'
import { getPayloadClient } from './payload'
import defaults from './page-defaults.json'
import type { AboutUs, CareerPage, ContactUs, EventsPage, PrivacyPolicy, ProjectsPage, TermsAndCondition } from '@/payload-types'

export const getAboutUs = cache(async () => {
  const saved = await (await getPayloadClient()).findGlobal({ slug: 'about-us' })
  return saved.headline ? saved : defaults.aboutUs as AboutUs
})

export const getContactUs = cache(async () => {
  const saved = await (await getPayloadClient()).findGlobal({ slug: 'contact-us' })
  return saved.headline ? saved : defaults.contactUs as ContactUs
})

export const getPrivacyPolicy = cache(async () => {
  const saved = await (await getPayloadClient()).findGlobal({ slug: 'privacy-policy' })
  return saved.heading ? saved : defaults.privacyPolicy as PrivacyPolicy
})

export const getTerms = cache(async () => {
  const saved = await (await getPayloadClient()).findGlobal({ slug: 'terms-and-conditions' })
  return saved.heading ? saved : defaults.termsAndConditions as TermsAndCondition
})

export const getEventsPage = cache(async () => {
  const saved = await (await getPayloadClient()).findGlobal({ slug: 'events-page' })
  return saved.heading ? saved : defaults.eventsPage as EventsPage
})

export const getProjectsPage = cache(async () => {
  const saved = await (await getPayloadClient()).findGlobal({ slug: 'projects-page' })
  return saved.heading ? saved : defaults.projectsPage as ProjectsPage
})

export const getCareerPage = cache(async () => {
  const saved = await (await getPayloadClient()).findGlobal({ slug: 'career-page' })
  return saved.heading ? saved : defaults.careerPage as CareerPage
})
