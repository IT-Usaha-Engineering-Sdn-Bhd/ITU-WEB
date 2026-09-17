import type { Field } from 'payload'

/** Reused on every public-facing collection. `slugify` on the client keeps it editable. */
export const slugField = (source = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: { position: 'sidebar', description: `Auto-generated from ${source}, editable.` },
})

export const seoFields: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  admin: { position: 'sidebar' },
  fields: [
    { name: 'title', type: 'text', admin: { description: 'Required for a good search snippet.' } },
    { name: 'description', type: 'textarea' },
    { name: 'ogImage', type: 'upload', relationTo: 'media' },
  ],
}

export const statusField: Field = {
  name: 'status',
  type: 'select',
  defaultValue: 'draft',
  options: ['draft', 'published'],
  admin: { position: 'sidebar' },
}

export const orderField: Field = {
  name: 'order',
  type: 'number',
  defaultValue: 0,
  admin: { position: 'sidebar', description: 'Lower numbers appear first.' },
}
