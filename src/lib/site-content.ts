import { cache } from 'react'
import { getPayloadClient } from './payload'
import { landingDefaults } from './landing-defaults'
import { navigation, services } from './navigation'
import type { Landing } from '@/payload-types'

// Per-field fallback: an empty/null field in a saved group falls back to its own default, not
// the whole group — so adding one new CMS field never blanks out its siblings. `content` is
// untyped on purpose: Payload's generated types make every optional field/sub-field nullable
// in shapes a generic merge can't line up with `T` structurally, so the caller's own
// `defaults` argument is the one source of truth for the (non-null) return type.
export function withDefaults<T extends object>(defaults: T, content: unknown): T {
  const source = (content ?? {}) as Record<string, unknown>
  const present = Object.fromEntries(
    Object.entries(source).filter(
      ([, value]) => value !== null && value !== undefined && value !== '',
    ),
  )
  return { ...defaults, ...present } as T
}

const settingsDefaults = {
  address: '9-1, Jalan Puteri 2/7, Bandar Puteri, 47100 Puchong, Selangor Darul Ehsan.',
  email: 'itusaha@itusaha.com',
  phone: '03-8065 3090/92/93',
  fax: '03-8065 3091',
  siteName: 'IT Usaha Engineering',
  legalName: 'IT Usaha Engineering Sdn. Bhd. (432550-U)',
  wordmarkTop: 'IT USAHA',
  wordmarkBottom: 'ENGINEERING',
  seoTitle: 'IT Usaha Engineering',
  seoDescription:
    'IT Usaha Engineering Sdn. Bhd. — your trusted partner in Data Centre and Mechanical & Electrical (M&E) infrastructure across Malaysia.',
  navLinks: navigation,
  servicesMenuLabel: 'Our Services',
  serviceLinks: services,
  footerServiceLinks: [services[1], services[3], services[2], services[0], services[4]],
  contactCtaLabel: 'Contact Us',
  contactCtaHref: '/contact-us',
  footerTagline: 'Engineering trust.\nSince 1997.',
  footerNavHeading: 'Navigation Link',
  footerServicesHeading: 'Our Services',
  footerPoliciesHeading: 'Company Policies',
  footerContactHeading: 'Get in Touch',
  policyLinks: [
    { label: 'Terms & Conditions', href: '/tnc' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
  ],
  copyright: 'Copyright © {year} IT Usaha Engineering Sdn. Bhd. (432550-U) | All rights reserved.',
  disclaimer:
    "Disclaimer: Some images on this website are sourced from Freepik, Unsplash & Flaticon. We strive to adhere to mentioned resource's terms of use and provide proper attribution. If there are any concerns about the usage of these images, please contact us directly. We appreciate the contributions of mentioned resources.",
  legalEyebrow: 'Company policies',
  legalOnThisPage: 'On this page',
  legalContactLine: 'Questions about these pages?',
  heroBannerKicker: 'ITU',
  heroBannerWordmark: 'IT USAHA ENGINEERING',
  carouselEmptyLabel: 'Content will be added soon.',
}

export const getLanding = cache(async () => {
  const payload = await getPayloadClient()
  const saved = await payload.findGlobal({ slug: 'landing' })
  return {
    ...saved,
    hero: withDefaults(landingDefaults.hero, saved.hero),
    whoWeAre: withDefaults(landingDefaults.whoWeAre, saved.whoWeAre),
    facts: withDefaults(landingDefaults.facts, saved.facts),
    services: withDefaults(landingDefaults.services, saved.services),
    whyUs: withDefaults(landingDefaults.whyUs, saved.whyUs),
    certs: withDefaults(landingDefaults.certs, saved.certs),
    clients: withDefaults(landingDefaults.clients, saved.clients),
    projects: withDefaults(landingDefaults.projects, saved.projects),
    ctaBand: withDefaults(landingDefaults.ctaBand, saved.ctaBand),
    seo: withDefaults<NonNullable<Landing['seo']>>(landingDefaults.seo ?? {}, saved.seo),
  }
})

export const getSettings = cache(async () => {
  const payload = await getPayloadClient()
  const saved = await payload.findGlobal({ slug: 'settings', depth: 1 })
  // logo/ogImage/social links have no text-style default value (an upload can only be present
  // or absent, and a blank social link is meant to just hide that icon), so they pass through
  // untouched rather than going through withDefaults.
  return {
    ...withDefaults(settingsDefaults, saved),
    logo: saved.logo,
    ogImage: saved.ogImage,
    linkedin: saved.linkedin,
    instagram: saved.instagram,
    facebook: saved.facebook,
  }
})
