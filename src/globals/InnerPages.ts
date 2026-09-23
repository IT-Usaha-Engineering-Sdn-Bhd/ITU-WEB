import type { Field, GlobalConfig } from 'payload'

const seo: Field = { name: 'seo', type: 'group', fields: [
  { name: 'title', type: 'text' }, { name: 'description', type: 'textarea' },
  { name: 'ogImage', type: 'upload', relationTo: 'media' },
] }

const media = (name: string, label?: string) => ({ name, type: 'upload', relationTo: 'media', label }) as const
const text = (name: string, required = true) => ({ name, type: 'text', required }) as const
const area = (name: string, required = true) => ({ name, type: 'textarea', required }) as const

export const AboutUs: GlobalConfig = {
  slug: 'about-us', access: { read: () => true }, admin: { group: 'Pages' },
  fields: [text('headline'), text('highlight'), media('heroImage'), text('backgroundHeading'), area('background'),
    area('vision'), area('mission'), text('leadershipHeading'), area('leadershipIntro'),
    { name: 'leaders', type: 'array', fields: [text('name'), text('role'), area('bio'), media('portrait', 'Professional profile photo')] },
    text('milestonesHeading'), area('milestonesIntro'),
    { name: 'milestones', type: 'array', fields: [text('year'), area('body'), media('image', 'Milestone photo')] }, seo],
}

export const ContactUs: GlobalConfig = {
  slug: 'contact-us', access: { read: () => true }, admin: { group: 'Pages' },
  fields: [text('headline'), text('companyName'), text('companyNumber'), text('formTitle'), area('formDescription'), media('heroImage'), seo],
}

const policyFields = [text('heading'), { name: 'sections', type: 'array', fields: [
  text('title'), area('intro', false), { name: 'items', type: 'array', fields: [area('text')] }, area('body', false),
] }, seo] as GlobalConfig['fields']

export const PrivacyPolicy: GlobalConfig = {
  slug: 'privacy-policy', access: { read: () => true }, admin: { group: 'Pages' }, fields: policyFields,
}

export const TermsAndConditions: GlobalConfig = {
  slug: 'terms-and-conditions', access: { read: () => true }, admin: { group: 'Pages' }, fields: policyFields,
}
