import { notFound } from 'next/navigation'

// Route otherwise-unmatched public URLs through the site's existing 404 boundary.
// Specific Payload/admin/API routes continue to take precedence.
export default function MissingPublicPage() {
  notFound()
}
