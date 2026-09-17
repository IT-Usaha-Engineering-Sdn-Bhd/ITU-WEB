import type { GlobalConfig } from 'payload'
import { revalidateGlobalHook } from '@/lib/revalidateHook'

export const FooterNavigation: GlobalConfig = {
  slug: 'footerNavigation',
  hooks: { afterChange: [revalidateGlobalHook] },
  fields: [
    {
      name: 'serviceLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'policyLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    { name: 'copyrightText', type: 'text', defaultValue: 'Copyright © {year} IT Usaha Engineering Sdn. Bhd. (432550-U) | All rights reserved.' },
  ],
}
