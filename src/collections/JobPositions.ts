import type { CollectionConfig } from 'payload'
import { slugField, statusField } from '@/lib/fields'
import { revalidateHook } from '@/lib/revalidateHook'

export const JobPositions: CollectionConfig = {
  slug: 'jobPositions',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'department', 'location', 'status'] },
  access: { read: () => true },
  hooks: { afterChange: [revalidateHook] },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    { name: 'department', type: 'text' },
    { name: 'location', type: 'text' },
    {
      name: 'employmentType',
      type: 'select',
      defaultValue: 'full-time',
      options: ['full-time', 'part-time', 'contract'],
    },
    {
      name: 'responsibilities',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'requirements',
      type: 'array',
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'closingDate', type: 'date' },
    statusField,
  ],
}
