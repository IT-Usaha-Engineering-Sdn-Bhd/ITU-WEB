import type { GlobalConfig } from 'payload'

const media = (name: string, required = false) =>
  ({ name, type: 'upload', relationTo: 'media', required }) as const

export const Landing: GlobalConfig = {
  slug: 'landing',
  access: { read: () => true },
  admin: { group: 'Pages' },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'punchline', type: 'text', required: true },
        { name: 'learnMoreLabel', type: 'text', required: true, defaultValue: 'Continue' },
      ],
    },
    {
      name: 'whoWeAre',
      type: 'group',
      fields: [
        { name: 'header', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
        { name: 'ctaLabel', type: 'text', required: true },
        { name: 'ctaHref', type: 'text', required: true },
      ],
    },
    {
      name: 'facts',
      type: 'group',
      fields: [
        { name: 'header', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
        {
          name: 'stats',
          type: 'array',
          minRows: 1,
          fields: [
            { name: 'value', type: 'number', required: true },
            { name: 'suffix', type: 'text' },
            { name: 'label', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'services',
      type: 'group',
      fields: [
        { name: 'header', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
        {
          name: 'items',
          type: 'array',
          minRows: 1,
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'tagline', type: 'text' },
            { name: 'body', type: 'textarea', required: true },
            media('image'),
          ],
        },
      ],
    },
    {
      name: 'whyUs',
      type: 'group',
      fields: [
        { name: 'header', type: 'text', required: true },
        {
          name: 'cards',
          type: 'array',
          minRows: 1,
          fields: [
            // Custom-uploaded icon image (png/jpg) — set by hand in the admin, not seeded.
            media('icon'),
            { name: 'title', type: 'text', required: true },
            { name: 'body', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      name: 'certs',
      type: 'group',
      fields: [
        { name: 'header', type: 'text', required: true },
        {
          name: 'items',
          type: 'array',
          minRows: 1,
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'description', type: 'text' },
            media('certificate'),
          ],
        },
      ],
    },
    {
      name: 'clients',
      type: 'group',
      fields: [
        { name: 'header', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
        {
          name: 'logos',
          type: 'array',
          fields: [
            media('logo', true),
            { name: 'name', type: 'text' },
            { name: 'url', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'projects',
      type: 'group',
      fields: [
        { name: 'header', type: 'text', required: true },
        { name: 'body', type: 'textarea', required: true },
        { name: 'ctaLabel', type: 'text', required: true },
        { name: 'ctaHref', type: 'text', required: true },
        media('backgroundImage'),
      ],
    },
    {
      name: 'ctaBand',
      type: 'group',
      fields: [
        { name: 'header', type: 'text', required: true },
        { name: 'ctaLabel', type: 'text', required: true },
        { name: 'ctaHref', type: 'text', required: true },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        media('ogImage'),
      ],
    },
  ],
}
