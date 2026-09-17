import type { Metadata } from 'next'
import { getPolicy } from '@/lib/queries'
import { Container } from '@/components/ui/Container'
import { RichText } from '@/components/ui/RichText'

export const metadata: Metadata = { title: 'Terms & Conditions' }

export default async function TermsConditionsPage() {
  const policy = await getPolicy('terms-conditions')
  return (
    <section className="py-16">
      <Container className="max-w-3xl">
        <h1>{policy?.title ?? 'Terms & Conditions'}</h1>
        <div className="mt-8">
          <RichText data={policy?.content} />
        </div>
      </Container>
    </section>
  )
}
