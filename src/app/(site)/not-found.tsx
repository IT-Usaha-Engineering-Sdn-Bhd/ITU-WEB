import { Container } from '@/components/ui/Container'
import { LinkButton } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <section className="py-24">
      <Container className="max-w-xl text-center">
        <h1>Page Not Found</h1>
        <p className="mt-4 text-lead text-text/80">The page you&apos;re looking for doesn&apos;t exist or may have moved.</p>
        <div className="mt-8">
          <LinkButton href="/">Back to Home</LinkButton>
        </div>
      </Container>
    </section>
  )
}
