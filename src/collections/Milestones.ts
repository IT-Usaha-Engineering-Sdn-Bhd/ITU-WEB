import type { CollectionConfig } from 'payload'
import { orderField, statusField } from '@/lib/fields'
import { revalidateHook } from '@/lib/revalidateHook'

export const Milestones: CollectionConfig = {
  slug: 'milestones',
  admin: { useAsTitle: 'title', defaultColumns: ['year', 'title', 'order'] },
  access: { read: () => true },
  hooks: { afterChange: [revalidateHook] },
  defaultSort: 'order',
  fields: [
    {
      name: 'year',
      type: 'text',
      required: true,
      admin: { description: 'A year or range, e.g. "2015-2017" or "2025-and-beyond" — not a number.' },
    },
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    orderField,
    statusField,
  ],
}
