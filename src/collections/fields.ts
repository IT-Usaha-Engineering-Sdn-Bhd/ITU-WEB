import type { Field } from 'payload'

// Shared across events/projects: unique slug, auto-filled from title when left blank.
export const slugField: Field = {
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: { description: 'Auto-filled from the title when left blank.' },
  hooks: {
    beforeValidate: [
      ({ value, data }) =>
        value ||
        data?.title
          ?.toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, ''),
    ],
  },
}

// Anonymous visitors only see published docs; logged-in users (the admin UI) see everything.
export const publishedRead = ({ req }: { req: { user: unknown } }) =>
  req.user ? true : { published: { equals: true } }

export const seo: Field = {
  name: 'seo',
  type: 'group',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'ogImage', type: 'upload', relationTo: 'media' },
  ],
}

// Shared field-builder shorthand, used across the Pages and Our Services globals.
export const media = (name: string, label?: string) =>
  ({ name, type: 'upload', relationTo: 'media', label }) as const
export const text = (name: string, required = true, defaultValue?: string) =>
  ({ name, type: 'text', required, defaultValue }) as const
export const area = (name: string, required = true, defaultValue?: string) =>
  ({ name, type: 'textarea', required, defaultValue }) as const
// A page-chrome label: required with a code-side default, so its Payload type is a plain
// non-null string and adding the column to an existing table backfills instead of failing.
export const copy = (name: string, defaultValue: string) =>
  ({ name, type: 'text', required: true, defaultValue }) as const
