import type { CollectionConfig } from 'payload'

/** Contact form sink. Written only via the /api/contact route (server-side, validated). */
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'email', 'interest', 'createdAt'] },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'company', type: 'text' },
    { name: 'interest', type: 'text', label: 'Service / project interest' },
    { name: 'message', type: 'textarea', required: true },
    { name: 'attachment', type: 'upload', relationTo: 'media' },
    { name: 'consentAt', type: 'date' },
    { name: 'sourceUrl', type: 'text' },
    { name: 'ipHash', type: 'text' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: ['new', 'in-progress', 'closed'],
    },
    { name: 'internalNotes', type: 'textarea' },
  ],
}
