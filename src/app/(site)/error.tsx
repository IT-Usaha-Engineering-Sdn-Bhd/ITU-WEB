'use client'
import Link from 'next/link'

export default function SiteError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main id="main-content" className="inner-page">
      <section className="section-shell inner-hero">
        <p className="eyebrow">Unable to load this page</p>
        <h1 className="section-heading">Please try again</h1>
        <p className="section-body" role="alert">
          Something went wrong while loading this content.
        </p>
        <div className="error-actions">
          <button type="button" className="button button-accent" onClick={reset}>
            Retry
          </button>
          <Link href="/" className="button button-outline">
            Return home
          </Link>
        </div>
      </section>
    </main>
  )
}
