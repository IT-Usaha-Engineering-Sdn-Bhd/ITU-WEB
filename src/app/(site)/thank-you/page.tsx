import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { LinkButton } from '@/components/ui/Button'

export const metadata: Metadata = { title: 'Thank You' }

export default function ThankYouPage() {
  return (
    <section className="py-24">
      <Container className="max-w-xl text-center">
        <h1>Thank You</h1>
        <p className="mt-4 text-lead text-text/80">
          We&apos;ve received your submission. Our team will get back to you shortly.
        </p>
        <div className="mt-8">
          <LinkButton href="/">Back to Home</LinkButton>
        </div>
      </Container>
    </section>
  )
}
