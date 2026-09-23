import type { Metadata } from 'next'
import { Spectral, Karla } from 'next/font/google'
import '../globals.css'
import { StageProvider } from '@/three/stage'
import { Scene } from '@/three/Scene'
import { TopNav } from '@/components/TopNav'
import { Footer } from '@/components/Footer'
import { getSettings } from '@/lib/site-content'

const spectral = Spectral({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-spectral',
  display: 'swap',
})
const karla = Karla({ subsets: ['latin'], variable: '--font-karla', display: 'swap' })

const siteUrl = process.env.SERVER_URL ?? 'http://localhost:3000'

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
    address: settings?.address
      ? { '@type': 'PostalAddress', streetAddress: settings.address }
      : undefined,
    sameAs: [settings?.linkedin, settings?.instagram, settings?.facebook].filter(Boolean),
  }

  return (
    <html lang="en" className={`${spectral.variable} ${karla.variable}`}>
      <body className="bg-base text-bone">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd).replace(/</g, '\\u003c') }}
        />
        <StageProvider>
          <Scene />
          <TopNav />
          {children}
          <Footer />
        </StageProvider>
      </body>
    </html>
  )
}
