import type { Metadata } from 'next'
import { EnvelopeSimple, MapPin, Phone, Printer } from '@phosphor-icons/react/dist/ssr'
import { getContactUs } from '@/lib/inner-pages'
import { getSettings } from '@/lib/site-content'
import { mediaUrl } from '@/lib/media'
import { ContactForm } from '@/components/inner/ContactForm'
import { HeroBanner } from '@/components/inner/HeroBanner'

export async function generateMetadata(): Promise<Metadata> {
  const data = await getContactUs()
  const image = mediaUrl(data.seo?.ogImage)
  return { title: data.seo?.title || 'Contact Us', description: data.seo?.description,
    alternates: { canonical: '/contact-us' }, openGraph: { images: image ? [{ url: image }] : undefined } }
}

export default async function ContactPage() {
  const [data, settings] = await Promise.all([getContactUs(), getSettings()])
  return <main id="main-content" className="inner-page contact-page">
    <section className="section-shell inner-hero"><p className="eyebrow">Get in touch</p><h1 className="section-heading">{data.headline}</h1></section>
    <HeroBanner image={data.heroImage} label="Contact Us" />
    <section className="section-shell contact-grid"><div className="contact-details"><p className="eyebrow">Our office</p><h2>{data.companyName}</h2><p className="company-number">{data.companyNumber}</p>
      <ul><li><MapPin /><span>{settings.address}</span></li><li><EnvelopeSimple /><a href={`mailto:${settings.email}`}>{settings.email}</a></li><li><Phone /><a href={`tel:${settings.phone.split('/')[0].replace(/[^+0-9]/g, '')}`}>{settings.phone}</a></li>{settings.fax && <li><Printer /><span>{settings.fax}</span></li>}</ul>
    </div><ContactForm title={data.formTitle} description={data.formDescription} /></section>
  </main>
}
