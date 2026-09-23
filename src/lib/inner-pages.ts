import { cache } from 'react'
import { getPayloadClient } from './payload'
import defaults from './page-defaults.json'
import type { AboutUs, ContactUs, PrivacyPolicy, TermsAndCondition } from '@/payload-types'

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
