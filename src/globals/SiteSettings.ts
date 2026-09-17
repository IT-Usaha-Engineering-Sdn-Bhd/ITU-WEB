import type { GlobalConfig } from 'payload'
import { revalidateGlobalHook } from '@/lib/revalidateHook'

export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  hooks: { afterChange: [revalidateGlobalHook] },
  fields: [
    { name: 'siteName', type: 'text', defaultValue: 'IT Usaha Engineering' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'logoInverted', type: 'upload', relationTo: 'media' },
    { name: 'favicon', type: 'upload', relationTo: 'media' },
    {
      name: 'defaultSeo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'companyName', type: 'text', defaultValue: 'IT Usaha Engineering Sdn. Bhd.' },
        { name: 'companyNumber', type: 'text', defaultValue: '199701017053 (432550-U)' },
        { name: 'address', type: 'textarea', defaultValue: '9-1, Jalan Puteri 2/7, Bandar Puteri, 47100 Puchong, Selangor Darul Ehsan' },
        { name: 'email', type: 'email', defaultValue: 'itusaha@itusaha.com' },
        { name: 'phone', type: 'text', defaultValue: '03-8065 3090/92/93' },
        { name: 'fax', type: 'text', defaultValue: '03-8065 3091' },
        { name: 'mapLat', type: 'number' },
        { name: 'mapLng', type: 'number' },
      ],
    },
    {
      name: 'social',
      type: 'group',
      fields: [
        { name: 'linkedin', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'facebook', type: 'text' },
      ],
    },
    {
      name: 'notificationEmails',
      type: 'group',
      label: 'Form notification addresses',
      fields: [
        { name: 'contactTo', type: 'email' },
        { name: 'careerTo', type: 'email' },
      ],
    },
    { name: 'legalDisclaimer', type: 'textarea', admin: { description: 'e.g. third-party asset credit line in the footer.' } },
  ],
}
