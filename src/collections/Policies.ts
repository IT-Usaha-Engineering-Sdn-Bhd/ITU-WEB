import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Policies: CollectionConfig = {
  slug: 'policies',
  admin: { useAsTitle: 'title' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'type',
      type: 'select',
      required: true,
      unique: true,
      options: [
        { label: 'Terms & Conditions', value: 'terms-conditions' },
        { label: 'Privacy Policy', value: 'privacy-policy' },
      ],
    },
    { name: 'content', type: 'richText', editor: lexicalEditor() },
    { name: 'effectiveDate', type: 'date' },
    { name: 'version', type: 'text' },
  ],
}
