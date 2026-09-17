import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/queries'
import { Hero } from '@/components/layout/Hero'
import { Container } from '@/components/ui/Container'
import { ContactForm } from '@/components/forms/ContactForm'

export const metadata: Metadata = { title: 'Contact Us' }

export default async function ContactUsPage() {
  const settings = await getSiteSettings()
  const contact = settings?.contact

  return (
    <>
      <Hero headline="Let's Discuss Your Project" compact />
      <section className="py-16">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2>{settings?.siteName}</h2>
            {contact?.companyNumber && <p className="mt-2 text-small text-text/60">Co. No. {contact.companyNumber}</p>}
            <dl className="mt-6 flex flex-col gap-4 text-body">
              {contact?.address && (
                <div>
                  <dt className="text-small font-semibold text-primary">Address</dt>
                  <dd className="whitespace-pre-line text-text/80">{contact.address}</dd>
                </div>
              )}
              {contact?.email && (
                <div>
                  <dt className="text-small font-semibold text-primary">Email</dt>
                  <dd>
                    <a href={`mailto:${contact.email}`} className="text-accent">
                      {contact.email}
                    </a>
                  </dd>
                </div>
              )}
              {contact?.phone && (
                <div>
                  <dt className="text-small font-semibold text-primary">Telephone</dt>
                  <dd className="text-text/80">{contact.phone}</dd>
                </div>
              )}
              {contact?.fax && (
                <div>
                  <dt className="text-small font-semibold text-primary">Fax</dt>
                  <dd className="text-text/80">{contact.fax}</dd>
                </div>
              )}
            </dl>
            <div className="mt-6 flex gap-4 text-small font-semibold text-accent">
              {settings?.social?.linkedin && <a href={settings.social.linkedin}>LinkedIn</a>}
              {settings?.social?.instagram && <a href={settings.social.instagram}>Instagram</a>}
              {settings?.social?.facebook && <a href={settings.social.facebook}>Facebook</a>}
            </div>
          </div>

          <div className="rounded-lg border border-surface-alt p-8">
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  )
}
