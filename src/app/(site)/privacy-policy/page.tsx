import type { Metadata } from 'next'
import { getPolicy } from '@/lib/queries'
import { Container } from '@/components/ui/Container'
import { RichText } from '@/components/ui/RichText'

export const metadata: Metadata = { title: 'Privacy Policy' }

export default async function PrivacyPolicyPage() {
  const policy = await getPolicy('privacy-policy')
  return (
    <section className="py-16">
      <Container className="max-w-3xl">
        <h1>{policy?.title ?? 'Privacy Policy'}</h1>
        <div className="mt-8">
          <RichText data={policy?.content} />
        </div>
      </Container>
    </section>
  )
}
