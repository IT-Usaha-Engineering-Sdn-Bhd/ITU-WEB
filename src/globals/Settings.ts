import type { GlobalConfig } from 'payload'

// Footer contact details — the values that actually change over time. Nav structure, footer
// link lists, copyright and disclaimer text stay hardcoded; they're fixed IA, not content.
export const Settings: GlobalConfig = {
  slug: 'settings',
  access: { read: () => true },
  admin: { group: 'Pages' },
  fields: [
    { name: 'address', type: 'textarea', required: true },
    { name: 'email', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'fax', type: 'text' },
    { name: 'linkedin', type: 'text' },
    { name: 'instagram', type: 'text' },
    { name: 'facebook', type: 'text' },
  ],
}
