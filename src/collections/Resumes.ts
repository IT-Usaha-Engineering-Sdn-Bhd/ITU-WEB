import type { CollectionConfig } from 'payload'

// Private: only staff can read/download. Applicants upload through the career-applications
// API route (server-side, overrideAccess), never directly through this collection.
export const Resumes: CollectionConfig = {
  slug: 'resumes', admin: { group: 'Contact' },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },
  upload: {
    mimeTypes: ['application/pdf'],
    staticDir: 'private/resumes',
  },
  fields: [],
  // ponytail: 5MB limit is enforced by the career-applications API route (isPdf), not here —
  // Payload's upload config has no size cap option. Add a beforeChange hook if admin-side
  // manual uploads through this collection need the same limit.
}
