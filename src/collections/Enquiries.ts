import type { CollectionConfig } from 'payload'

export const Enquiries: CollectionConfig = {
  slug: 'enquiries', admin: { group: 'Contact', useAsTitle: 'email' },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },
  fields: [
    { name: 'name', type: 'text', required: true }, { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true }, { name: 'companyName', type: 'text' },
    { name: 'companyAddress', type: 'textarea' }, { name: 'message', type: 'textarea', required: true },
    { name: 'status', type: 'select', required: true, defaultValue: 'new',
      options: [{ label: 'New', value: 'new' }, { label: 'In progress', value: 'in-progress' }, { label: 'Closed', value: 'closed' }],
      access: { create: () => false, update: ({ req }) => Boolean(req.user) },
    },
  ],
}
