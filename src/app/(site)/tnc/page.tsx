import type { Metadata } from 'next'
import { getTerms } from '@/lib/inner-pages'
import { LegalPage } from '@/components/inner/LegalPage'
import { mediaUrl } from '@/lib/media'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getTerms()
  const image = mediaUrl(data.seo?.ogImage)
  return {
    title: data.seo?.title || data.heading,
    description: data.seo?.description,
    alternates: { canonical: '/tnc' },
    openGraph: { images: image ? [{ url: image }] : undefined },
  }
}

export default async function TermsPage() {
  const data = await getTerms()
  return <LegalPage heading={data.heading} sections={data.sections ?? []} />
}
