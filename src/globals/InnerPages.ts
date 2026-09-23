import type { GlobalConfig } from 'payload'
import { area, media, seo, text } from '@/collections/fields'

export const AboutUs: GlobalConfig = {
  slug: 'about-us',
  access: { read: () => true },
  admin: { group: 'Pages' },
  fields: [
    text('headline'),
    text('highlight'),
    media('heroImage'),
    text('backgroundHeading'),
    area('background'),
    area('vision'),
    area('mission'),
    text('leadershipHeading'),
    area('leadershipIntro'),
    {
      name: 'leaders',
      type: 'array',
      fields: [
        text('name'),
        text('role'),
        area('bio'),
        media('portrait', 'Professional profile photo'),
      ],
    },
    text('milestonesHeading'),
    area('milestonesIntro'),
    {
      name: 'milestones',
      type: 'array',
      fields: [text('year'), area('body'), media('image', 'Milestone photo')],
    },
    seo,
  ],
}

export const ContactUs: GlobalConfig = {
  slug: 'contact-us',
  access: { read: () => true },
  admin: { group: 'Pages' },
  fields: [
    text('headline'),
    text('companyName'),
    text('companyNumber'),
    text('formTitle'),
    area('formDescription'),
    media('heroImage'),
    seo,
  ],
}

const policyFields = [
  text('heading'),
  {
    name: 'sections',
    type: 'array',
    fields: [
      text('title'),
      area('intro', false),
      { name: 'items', type: 'array', fields: [area('text')] },
      area('body', false),
    ],
  },
  seo,
] as GlobalConfig['fields']

export const PrivacyPolicy: GlobalConfig = {
  slug: 'privacy-policy',
  access: { read: () => true },
  admin: { group: 'Pages' },
  fields: policyFields,
}

export const TermsAndConditions: GlobalConfig = {
  slug: 'terms-and-conditions',
  access: { read: () => true },
  admin: { group: 'Pages' },
  fields: policyFields,
}

export const EventsPage: GlobalConfig = {
  slug: 'events-page',
  access: { read: () => true },
  admin: { group: 'Pages' },
  fields: [text('heading'), text('highlight'), media('heroImage'), seo],
}

export const ProjectsPage: GlobalConfig = {
  slug: 'projects-page',
  access: { read: () => true },
  admin: { group: 'Pages' },
  fields: [text('heading'), text('highlight'), media('heroImage'), seo],
}

export const CareerPage: GlobalConfig = {
  slug: 'career-page',
  access: { read: () => true },
  admin: { group: 'Pages' },
  fields: [
    text('heading'),
    text('highlight'),
    media('heroImage'),
    text('applyHeading'),
    area('applyBody'),
    seo,
  ],
}
