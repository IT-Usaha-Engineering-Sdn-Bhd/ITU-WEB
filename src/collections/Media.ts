import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  upload: {
    imageSizes: [
      { name: 'thumbnail', width: 400, height: undefined, position: 'centre' },
      { name: 'card', width: 800, height: undefined, position: 'centre' },
      { name: 'hero', width: 1920, height: undefined, position: 'centre' },
    ],
    mimeTypes: ['image/*'],
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
    { name: 'caption', type: 'text' },
    { name: 'credit', type: 'text' },
    { name: 'licenseUrl', type: 'text', label: 'License URL' },
    { name: 'sourceUrl', type: 'text', label: 'Source URL' },
    {
      name: 'focalPoint',
      type: 'select',
      defaultValue: 'center',
      options: [
        'top-left', 'top', 'top-right',
        'left', 'center', 'right',
        'bottom-left', 'bottom', 'bottom-right',
      ],
    },
    { name: 'tags', type: 'text', hasMany: true },
  ],
}
