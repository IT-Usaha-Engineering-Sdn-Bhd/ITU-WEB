import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { contentBlocks } from '@/blocks/config'
import { seoFields, slugField, statusField } from '@/lib/fields'
import { revalidateHook } from '@/lib/revalidateHook'

/** Used for About Us — hero + intro copy + reusable blocks, milestones/leadership rendered separately. */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  versions: { drafts: true },
  hooks: { afterChange: [revalidateHook] },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    { name: 'heroTitle', type: 'text' },
    { name: 'intro', type: 'richText', editor: lexicalEditor() },
    {
      name: 'leadership',
      type: 'array',
      admin: { description: 'Rendered as leadership cards, e.g. on About Us.' },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text' },
        { name: 'bio', type: 'textarea' },
        { name: 'portrait', type: 'upload', relationTo: 'media' },
      ],
    },
    { name: 'content', type: 'blocks', blocks: contentBlocks },
    statusField,
    seoFields,
  ],
}
