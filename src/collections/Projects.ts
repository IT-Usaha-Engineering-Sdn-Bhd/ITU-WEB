import type { CollectionConfig } from 'payload'
import { publishedRead, seo, slugField } from './fields'

export const Projects: CollectionConfig = {
  slug: 'projects',
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
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'ongoing',
      options: [
        { label: 'Completed', value: 'completed' },
        { label: 'Ongoing', value: 'ongoing' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower numbers show first.' },
    },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'client', type: 'text' },
    {
      name: 'consultants',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true }],
      admin: {
        description:
          'Shown as "Data Center Consultant" (one) or "Data Center Consultants" (multiple).',
      },
    },
    { name: 'scope', type: 'text' },
    { name: 'commencementDate', type: 'date', admin: { date: { pickerAppearance: 'monthOnly' } } },
    {
      name: 'completionDate',
      type: 'date',
      admin: { date: { pickerAppearance: 'monthOnly' } },
      validate: (value, { data }: { data: { status?: string } }) =>
        data?.status === 'completed' && !value
          ? 'Completed projects need a completion date.'
          : true,
    },
    { name: 'body', type: 'richText' },
    { name: 'published', type: 'checkbox', defaultValue: false },
    seo,
  ],
}
