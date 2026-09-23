import type { Metadata } from 'next'
import { Spectral, Karla } from 'next/font/google'
import '../globals.css'
import { StageProvider } from '@/three/stage'
import { Scene } from '@/three/Scene'
import { TopNav } from '@/components/TopNav'
import { Footer } from '@/components/Footer'
import { getSettings } from '@/lib/site-content'
import { mediaUrl } from '@/lib/media'

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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const logoUrl = mediaUrl(settings.logo) ?? '/assets/logo.png'
  const ogImageUrl = mediaUrl(settings.ogImage) ?? logoUrl
  return {
    metadataBase: new URL(siteUrl),
    icons: { icon: logoUrl },
    title: { default: settings.seoTitle, template: `%s | ${settings.siteName}` },
    description: settings.seoDescription,
    openGraph: {
      type: 'website',
      siteName: settings.siteName,
      locale: 'en_MY',
      images: [{ url: ogImageUrl }],
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  const logoUrl = mediaUrl(settings.logo) ?? '/assets/logo.png'

  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.legalName,
    url: siteUrl,
    logo: new URL(logoUrl, siteUrl).toString(),
    email: settings.email,
    telephone: settings.phone,
    address: settings.address
      ? { '@type': 'PostalAddress', streetAddress: settings.address }
      : undefined,
    sameAs: [settings.linkedin, settings.instagram, settings.facebook].filter(Boolean),
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
          <TopNav
            logoUrl={logoUrl}
            wordmarkTop={settings.wordmarkTop}
            wordmarkBottom={settings.wordmarkBottom}
            navLinks={settings.navLinks ?? []}
            servicesMenuLabel={settings.servicesMenuLabel}
            serviceLinks={settings.serviceLinks ?? []}
            contactCtaLabel={settings.contactCtaLabel}
            contactCtaHref={settings.contactCtaHref}
          />
          {children}
          <Footer />
        </StageProvider>
      </body>
    </html>
  )
}
