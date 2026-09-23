import type { Field, GlobalConfig } from 'payload'
import { area, copy, media, seo, text } from '@/collections/fields'

const group = 'Our Services'
const bullets = (name: string): Field => ({
  name,
  type: 'array',
  fields: [text('text'), media('icon')],
})
const cards = (name: string): Field => ({
  name,
  type: 'array',
  fields: [text('title'), area('body'), media('image')],
})
const iconCards = (name: string): Field => ({
  name,
  type: 'array',
  fields: [text('title'), area('body'), media('image'), media('icon')],
})

export const ServiceDataCentre: GlobalConfig = {
  slug: 'service-data-centre',
  access: { read: () => true },
  admin: { group },
  fields: [
    text('heading'),
    text('highlight'),
    media('heroImage'),
    copy('eyebrow', 'Our Services'),
    copy('bannerLabel', 'Data Centre & Critical System'),
    area('intro'),
    {
      name: 'turnkey',
      type: 'group',
      fields: [text('title'), area('body'), text('subtitle'), area('subBody'), media('image')],
    },
    {
      name: 'critical',
      type: 'group',
      fields: [text('title'), area('body'), bullets('items'), media('image')],
    },
    {
      name: 'testing',
      type: 'group',
      fields: [
        text('title'),
        area('body'),
        media('image'),
        text('galleryTitle'),
        { name: 'equipment', type: 'array', fields: [media('image'), text('caption', false)] },
      ],
    },
    // Top-level, not nested in `testing` — a new field inside an already-populated group would
    // read back as undefined until re-saved, since the top-level fallback only fills in gaps
    // at the object's own root (see withDefaults in inner-pages.ts).
    copy('equipmentPlaceholderCaption', 'Equipment details coming soon'),
    text('whyHeading'),
    cards('why'),
    seo,
  ],
}

const sectionFields = [
  text('title'),
  area('body'),
  bullets('items'),
  text('note', false),
  media('image'),
]

export const ServiceHighTension: GlobalConfig = {
  slug: 'service-high-tension',
  access: { read: () => true },
  admin: { group },
  fields: [
    text('heading'),
    text('highlight'),
    media('heroImage'),
    copy('eyebrow', 'Our Services'),
    copy('bannerLabel', 'High Tension & Electrical Services'),
    area('intro'),
    { name: 'power', type: 'array', fields: sectionFields },
    { name: 'divider1', type: 'group', fields: [text('heading'), area('body')] },
    { name: 'backup', type: 'array', fields: sectionFields },
    { name: 'divider2', type: 'group', fields: [text('heading'), area('body')] },
    { name: 'protection', type: 'array', fields: sectionFields },
    {
      name: 'feature',
      type: 'group',
      fields: [text('eyebrow'), text('title'), area('body'), media('image')],
    },
    seo,
  ],
}

export const ServiceProjectManagement: GlobalConfig = {
  slug: 'service-project-management',
  access: { read: () => true },
  admin: { group },
  fields: [
    text('heading'),
    text('highlight'),
    media('heroImage'),
    copy('eyebrow', 'Our Services'),
    copy('bannerLabel', 'Project Management'),
    text('servicesHeading'),
    { name: 'services', type: 'array', fields: [text('title'), media('icon')] },
    copy('whyHeading', 'Why Choose Us?'),
    cards('why'),
    seo,
  ],
}

export const ServiceFacilitiesManagement: GlobalConfig = {
  slug: 'service-facilities-management',
  access: { read: () => true },
  admin: { group },
  fields: [
    text('heading'),
    text('highlight'),
    media('heroImage'),
    copy('eyebrow', 'Our Services'),
    copy('bannerLabel', 'Facilities Management'),
    area('intro'),
    {
      name: 'support',
      type: 'group',
      fields: [text('title'), area('body'), bullets('items'), media('image')],
    },
    {
      name: 'maintenance',
      type: 'group',
      fields: [text('title'), area('body'), bullets('items'), media('image')],
    },
    text('whyHeading'),
    cards('why'),
    seo,
  ],
}

export const ServiceDfma: GlobalConfig = {
  slug: 'service-dfma',
  access: { read: () => true },
  admin: { group },
  fields: [
    text('heading'),
    text('highlight'),
    media('heroImage'),
    copy('eyebrow', 'Our Services'),
    copy('bannerLabel', 'DFMA'),
    { name: 'facts', type: 'array', fields: [text('label'), text('value')] },
    {
      name: 'capabilities',
      type: 'group',
      fields: [text('title'), media('image'), iconCards('cards')],
    },
    { name: 'benefits', type: 'group', fields: [text('title'), bullets('items'), media('image')] },
    { name: 'visual', type: 'group', fields: [text('title'), media('image')] },
    copy('whyHeading', 'Why Choose Us?'),
    cards('why'),
    seo,
  ],
}
