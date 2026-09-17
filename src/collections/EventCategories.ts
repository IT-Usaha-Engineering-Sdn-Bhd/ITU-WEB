import type { CollectionConfig } from 'payload'
import { orderField, slugField, statusField } from '@/lib/fields'

export const EventCategories: CollectionConfig = {
  slug: 'eventCategories',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('name'),
    { name: 'description', type: 'textarea' },
    orderField,
    statusField,
  ],
}
