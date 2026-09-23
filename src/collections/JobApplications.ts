import type { CollectionConfig } from 'payload'

export const JobApplications: CollectionConfig = {
  slug: 'job-applications',
  admin: { group: 'Contact', useAsTitle: 'name' },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false, // written only by the career-applications API route, overrideAccess
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'vacancy', type: 'relationship', relationTo: 'vacancies', required: true },
    {
      name: 'vacancyTitle',
      type: 'text',
      required: true,
      admin: { description: 'Snapshot of the vacancy title at submission time.' },
    },
    { name: 'introduction', type: 'textarea', required: true },
    { name: 'resume', type: 'upload', relationTo: 'resumes', required: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In Review', value: 'in-review' },
        { label: 'Closed', value: 'closed' },
      ],
      access: { create: () => false, update: ({ req }) => Boolean(req.user) },
    },
  ],
}
