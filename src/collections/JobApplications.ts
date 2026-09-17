import type { CollectionConfig } from 'payload'

/** Career form sink. Written only via the /api/apply route. CV retention date is enforced on write. */
export const JobApplications: CollectionConfig = {
  slug: 'jobApplications',
  admin: { useAsTitle: 'applicantName', defaultColumns: ['applicantName', 'position', 'createdAt'] },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'applicantName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'position', type: 'relationship', relationTo: 'jobPositions' },
    { name: 'coverMessage', type: 'textarea' },
    { name: 'cv', type: 'upload', relationTo: 'documents', required: true },
    { name: 'consentAt', type: 'date' },
    {
      name: 'processingStatus',
      type: 'select',
      defaultValue: 'new',
      options: ['new', 'reviewing', 'interviewing', 'rejected', 'hired'],
    },
    { name: 'retentionDate', type: 'date', admin: { description: 'CV auto-eligible for deletion after this date.' } },
  ],
}
