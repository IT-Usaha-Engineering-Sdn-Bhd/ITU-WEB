import type { Metadata } from 'next'
import { getTerms } from '@/lib/inner-pages'
import { getSettings } from '@/lib/site-content'
import { pageMetadata } from '@/lib/seo'
import { LegalPage } from '@/components/inner/LegalPage'

export async function generateMetadata(): Promise<Metadata> {
  const [data, settings] = await Promise.all([getTerms(), getSettings()])
  return pageMetadata(data, data.heading, '/tnc', settings.siteName)
}

export default async function TermsPage() {
  const [data, settings] = await Promise.all([getTerms(), getSettings()])
  return (
    <LegalPage
      heading={data.heading}
      sections={data.sections ?? []}
      email={settings.email}
      eyebrow={settings.legalEyebrow}
      onThisPage={settings.legalOnThisPage}
      contactLine={settings.legalContactLine}
    />
  )
}
