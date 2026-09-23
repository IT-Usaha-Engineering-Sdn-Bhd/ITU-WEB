import type { Field, GlobalConfig } from 'payload'
import { area, media, seo, text } from '@/collections/fields'

const group = 'Our Services'
const bullets = (name: string): Field => ({ name, type: 'array', fields: [text('text')] })
const cards = (name: string): Field => ({
  name,
  type: 'array',
  fields: [text('title'), area('body'), media('image')],
})

export const ServiceDataCentre: GlobalConfig = {
  slug: 'service-data-centre',
  access: { read: () => true },
  admin: { group },
  fields: [
    text('heading'),
    text('highlight'),
    media('heroImage'),
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
    text('servicesHeading'),
    { name: 'services', type: 'array', fields: [text('title')] },
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
    { name: 'facts', type: 'array', fields: [text('label'), text('value')] },
    {
      name: 'capabilities',
      type: 'group',
      fields: [text('title'), media('image'), cards('cards')],
    },
    { name: 'benefits', type: 'group', fields: [text('title'), bullets('items'), media('image')] },
    { name: 'visual', type: 'group', fields: [text('title'), media('image')] },
    seo,
  ],
}
