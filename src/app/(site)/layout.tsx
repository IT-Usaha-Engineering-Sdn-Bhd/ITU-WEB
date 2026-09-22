import type { Metadata } from 'next'
import { Manrope, Work_Sans } from 'next/font/google'
import '../globals.css'
import { StageProvider } from '@/three/stage'
import { Scene } from '@/three/Scene'
import { Backdrop } from '@/components/Backdrop'
import { TopNav } from '@/components/TopNav'
import { Footer } from '@/components/Footer'
import { getSettings } from '@/lib/site-content'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })
const workSans = Work_Sans({ subsets: ['latin'], variable: '--font-work-sans', display: 'swap' })

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

// Payload's local API does not participate in Next's fetch revalidation.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: { icon: '/assets/logo.png' },
  title: { default: 'IT Usaha Engineering', template: '%s | IT Usaha Engineering' },
  description:
    'IT Usaha Engineering Sdn. Bhd. — your trusted partner in Data Centre and Mechanical & Electrical (M&E) infrastructure across Malaysia.',
  openGraph: {
    type: 'website',
    siteName: 'IT Usaha Engineering',
    locale: 'en_MY',
  },
  twitter: { card: 'summary_large_image' },
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'IT Usaha Engineering Sdn. Bhd.',
    url: siteUrl,
    email: settings?.email,
    telephone: settings?.phone,
    address: settings?.address ? { '@type': 'PostalAddress', streetAddress: settings.address } : undefined,
    sameAs: [settings?.linkedin, settings?.instagram, settings?.facebook].filter(Boolean),
  }

  return (
    <html lang="en" className={`${manrope.variable} ${workSans.variable}`}>
      <body className="bg-base text-bone">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd).replace(/</g, '\\u003c') }}
        />
        <StageProvider>
          <Backdrop />
          <Scene />
          <TopNav />
          {children}
          <Footer />
        </StageProvider>
      </body>
    </html>
  )
}
