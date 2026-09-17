import type { CollectionConfig } from 'payload'
import { contentBlocks } from '@/blocks/config'
import { orderField, seoFields, slugField, statusField } from '@/lib/fields'
import { revalidateHook } from '@/lib/revalidateHook'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', 'status'] },
  access: { read: () => true },
  versions: { drafts: true },
  hooks: { afterChange: [revalidateHook] },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    { name: 'shortDescription', type: 'textarea' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'icon', type: 'text', admin: { description: 'Icon name for the service card on Home.' } },
    { name: 'content', type: 'blocks', blocks: contentBlocks },
    orderField,
    statusField,
    seoFields,
  ],
}
