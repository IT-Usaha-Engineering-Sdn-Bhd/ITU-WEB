import type { Metadata } from 'next'
import { getPrivacyPolicy } from '@/lib/inner-pages'
import { LegalPage } from '@/components/inner/LegalPage'
import { mediaUrl } from '@/lib/media'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPrivacyPolicy()
  const image = mediaUrl(data.seo?.ogImage)
  return { title: data.seo?.title || data.heading, description: data.seo?.description, alternates: { canonical: '/privacy-policy' }, openGraph: { images: image ? [{ url: image }] : undefined } }
}

export default async function PrivacyPolicyPage() {
  const data = await getPrivacyPolicy()
  return <LegalPage heading={data.heading} sections={data.sections ?? []} />
}
