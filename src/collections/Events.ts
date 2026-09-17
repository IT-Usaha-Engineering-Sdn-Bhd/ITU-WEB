import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoFields, slugField, statusField } from '@/lib/fields'
import { revalidateHook } from '@/lib/revalidateHook'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'eventDate', 'status'] },
  access: { read: () => true },
  versions: { drafts: true },
  hooks: { afterChange: [revalidateHook] },
  defaultSort: '-eventDate',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    { name: 'category', type: 'relationship', relationTo: 'eventCategories', required: true },
    { name: 'eventDate', type: 'date' },
    { name: 'excerpt', type: 'textarea' },
    { name: 'content', type: 'richText', editor: lexicalEditor() },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'gallery', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }] },
    { name: 'videoUrl', type: 'text', label: 'Video / external media URL' },
    statusField,
    seoFields,
  ],
}
