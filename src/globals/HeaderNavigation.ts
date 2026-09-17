import type { GlobalConfig } from 'payload'
import { revalidateGlobalHook } from '@/lib/revalidateHook'

export const HeaderNavigation: GlobalConfig = {
  slug: 'headerNavigation',
  hooks: { afterChange: [revalidateGlobalHook] },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
        {
          name: 'children',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
    },
    { name: 'ctaLabel', type: 'text', defaultValue: 'Contact Us' },
    { name: 'ctaHref', type: 'text', defaultValue: '/contact-us/' },
  ],
}
