import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Geist } from 'next/font/google'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { getSiteSettings } from '@/lib/queries'
import '../globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const title = settings?.defaultSeo?.title ?? settings?.siteName ?? 'IT Usaha Engineering'
  const description = settings?.defaultSeo?.description ?? 'Your trusted partner in Data Centre and M&E engineering.'
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'),
    title: { default: title, template: `%s | ${settings?.siteName ?? 'IT Usaha Engineering'}` },
    description,
  }
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings()

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings?.siteName ?? 'IT Usaha Engineering',
    url: process.env.NEXT_PUBLIC_SERVER_URL,
    email: settings?.contact?.email,
    telephone: settings?.contact?.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings?.contact?.address,
    },
  }

  return (
    <html lang="en" className={geist.variable}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-white focus:p-4">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  )
}
