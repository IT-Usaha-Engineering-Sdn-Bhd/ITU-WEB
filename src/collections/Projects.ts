import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoFields, slugField, statusField } from '@/lib/fields'
import { revalidateHook } from '@/lib/revalidateHook'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'projectStatus', 'location', 'status'] },
  access: { read: () => true },
  versions: { drafts: true },
  hooks: { afterChange: [revalidateHook] },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'projectStatus',
      type: 'select',
      required: true,
      options: [
        { label: 'Ongoing', value: 'ongoing' },
        { label: 'Completed', value: 'completed' },
      ],
      admin: { description: 'Drives /project-status/completed-projects/ vs /ongoing-projects/' },
    },
    { name: 'location', type: 'text' },
    { name: 'client', type: 'text' },
    {
      name: 'consultants',
      type: 'array',
      admin: { description: 'Zero, one, or many — render conditionally, never show an empty label.' },
      fields: [{ name: 'name', type: 'text', required: true }],
    },
    { name: 'commencementDate', type: 'date', admin: { date: { pickerAppearance: 'monthOnly' } } },
    { name: 'completionDate', type: 'date', admin: { date: { pickerAppearance: 'monthOnly' } } },
    { name: 'summary', type: 'textarea' },
    { name: 'scopeOfWorks', type: 'richText', editor: lexicalEditor() },
    {
      name: 'metrics',
      type: 'array',
      label: 'Capacity / delivery metrics',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'gallery', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }] },
    statusField,
    seoFields,
  ],
}
