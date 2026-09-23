import type { Metadata } from 'next'
import { EnvelopeSimple, MapPin, Phone, Printer } from '@phosphor-icons/react/dist/ssr'
import { getContactUs } from '@/lib/inner-pages'
import { getSettings } from '@/lib/site-content'
import { pageMetadata } from '@/lib/seo'
import { ContactForm } from '@/components/inner/ContactForm'
import { HeroBanner } from '@/components/inner/HeroBanner'

export async function generateMetadata(): Promise<Metadata> {
  const [data, settings] = await Promise.all([getContactUs(), getSettings()])
  return pageMetadata(data, 'Contact Us', '/contact-us', settings.siteName)
}

export default async function ContactPage() {
  const [data, settings] = await Promise.all([getContactUs(), getSettings()])
  return (
    <main id="main-content" className="inner-page contact-page">
      <section className="section-shell inner-hero">
        <p className="eyebrow">{data.heroEyebrow}</p>
        <h1 className="section-heading">{data.headline}</h1>
      </section>
      <HeroBanner
        image={data.heroImage}
        label={data.bannerLabel}
        kicker={settings.heroBannerKicker}
        wordmark={settings.heroBannerWordmark}
      />
      <section className="section-shell contact-grid">
        <div className="contact-details">
          <p className="eyebrow">{data.officeEyebrow}</p>
          <h2>{data.companyName}</h2>
          <p className="company-number">{data.companyNumber}</p>
          <ul>
            <li>
              <MapPin />
              <span>{settings.address}</span>
            </li>
            <li>
              <EnvelopeSimple />
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </li>
            <li>
              <Phone />
              <a href={`tel:${settings.phone.split('/')[0].replace(/[^+0-9]/g, '')}`}>
                {settings.phone}
              </a>
            </li>
            {settings.fax && (
              <li>
                <Printer />
                <span>{settings.fax}</span>
              </li>
            )}
          </ul>
        </div>
        <ContactForm
          eyebrow={data.formEyebrow}
          title={data.formTitle}
          description={data.formDescription}
          labels={data.form}
        />
      </section>
    </main>
  )
}
