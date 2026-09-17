import type { CollectionConfig } from 'payload'

/**
 * Private upload store for career-application CVs — separate from `media` because
 * CVs must never be publicly readable (media.read is public; CVs carry PII/PDPA
 * exposure) and aren't image files needing focal points, alt text, or resizing.
 */
export const Documents: CollectionConfig = {
  slug: 'documents',
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  upload: {
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
  fields: [{ name: 'label', type: 'text' }],
}
