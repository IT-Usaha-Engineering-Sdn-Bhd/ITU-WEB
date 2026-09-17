import { LinkButton } from '@/components/ui/Button'

export function ContactCta({
  heading,
  body,
  buttonLabel = 'Contact Us',
  buttonHref = '/contact-us/',
}: {
  heading: string
  body?: string | null
  buttonLabel?: string | null
  buttonHref?: string | null
}) {
  return (
    <section className="bg-primary py-16 text-white">
      <div className="site-container flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-2xl text-white">{heading}</h2>
        {body && <p className="max-w-xl text-lead text-white/80">{body}</p>}
        <LinkButton href={buttonHref ?? '/contact-us/'}>{buttonLabel ?? 'Contact Us'}</LinkButton>
      </div>
    </section>
  )
}
