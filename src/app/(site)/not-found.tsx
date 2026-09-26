import Link from 'next/link'
import { ThemeInitializer } from '@/components/ThemeInitializer'

export default function NotFound() {
  return (
    <>
      {/* Next's root 404 fallback can omit the layout head; initialize before its content too. */}
      <ThemeInitializer />
      <main id="main-content" className="inner-page">
        <section className="section-shell inner-hero">
          <p className="eyebrow">404</p>
          <h1 className="section-heading">Page not found</h1>
          <p className="section-body">The page may have moved or the address may be incorrect.</p>
          <Link href="/" className="button button-accent">
            Return home
          </Link>
        </section>
      </main>
    </>
  )
}
