import { cache } from 'react'
import { getPayloadClient } from './payload'
import { landingDefaults } from './landing-defaults'
import type { Landing } from '@/payload-types'

function withDefaults<T extends object>(defaults: T, content: Partial<T> | null | undefined): T {
  const present = Object.fromEntries(
    Object.entries(content ?? {}).filter(([, value]) => value !== null && value !== undefined),
  )
  return { ...defaults, ...present }
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
  const saved = await payload.findGlobal({ slug: 'settings' })
  return {
    ...saved,
    address:
      saved.address || '9-1, Jalan Puteri 2/7, Bandar Puteri, 47100 Puchong, Selangor Darul Ehsan.',
    email: saved.email || 'itusaha@itusaha.com',
    phone: saved.phone || '03-8065 3090/92/93',
    fax: saved.fax || '03-8065 3091',
  }
})
