import type { Metadata } from 'next'
import { getPrivacyPolicy } from '@/lib/inner-pages'
import { getSettings } from '@/lib/site-content'
import { pageMetadata } from '@/lib/seo'
import { LegalPage } from '@/components/inner/LegalPage'

export async function generateMetadata(): Promise<Metadata> {
  const [data, settings] = await Promise.all([getPrivacyPolicy(), getSettings()])
  return pageMetadata(data, data.heading, '/privacy-policy', settings.siteName)
}

export default async function PrivacyPolicyPage() {
  const [data, settings] = await Promise.all([getPrivacyPolicy(), getSettings()])
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
