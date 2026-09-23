import type { CollectionConfig } from 'payload'

export const Vacancies: CollectionConfig = {
  slug: 'vacancies', admin: { group: 'Content', useAsTitle: 'title' },
  access: {
    read: () => true, // the page filters `open` itself; closed vacancies aren't sensitive
    create: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'key', type: 'text', required: true, unique: true, index: true,
      admin: { description: 'Stable identifier — do not change once applications reference it.' } },
    { name: 'order', type: 'number', defaultValue: 0 },
    { name: 'open', type: 'checkbox', defaultValue: true },
    { name: 'sections', type: 'array', fields: [
      { name: 'heading', type: 'text', admin: { description: 'Subsection heading, e.g. "Human Resources".' } },
      { name: 'label', type: 'text', required: true, admin: { description: 'e.g. "Responsibilities" or "Requirements".' } },
      { name: 'intro', type: 'textarea' },
      { name: 'items', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    ] },
  ],
}
