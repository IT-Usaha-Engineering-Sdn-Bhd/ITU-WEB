import type { CollectionConfig } from 'payload'
import { publishedRead, seo, slugField } from './fields'

// Order matches the template's six category tabs — the frontend renders them in this order.
export const EVENT_CATEGORIES = [
  { label: 'Company Award Ceremony', value: 'company-award-ceremony' },
  { label: 'Annual Dinner', value: 'annual-dinner' },
  { label: 'Team Building', value: 'team-building' },
  { label: 'Recreational', value: 'recreational' },
  { label: 'Company Trip', value: 'company-trip' },
  { label: 'CSR Activities', value: 'csr-activities' },
] as const

export const Events: CollectionConfig = {
  slug: 'events',
  admin: { group: 'Content', useAsTitle: 'title' },
  access: {
    read: publishedRead,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField,
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: EVENT_CATEGORIES[0].value,
      options: EVENT_CATEGORIES.map((c) => ({ ...c })),
    },
    {
      name: 'eventDate',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    {
      name: 'gallery',
      type: 'array',
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      admin: { description: 'Any standard YouTube URL (watch, youtu.be, shorts).' },
    },
    { name: 'published', type: 'checkbox', defaultValue: false },
    seo,
  ],
}
