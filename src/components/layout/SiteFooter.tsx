import Link from 'next/link'
import { getFooterNavigation, getSiteSettings } from '@/lib/queries'

export async function SiteFooter() {
  const [footer, settings] = await Promise.all([getFooterNavigation(), getSiteSettings()])
  const contact = settings?.contact
  const social = settings?.social
  const year = new Date().getFullYear()
  const copyright = (footer?.copyrightText ?? '').replace('{year}', String(year))

  return (
    <footer className="bg-primary text-white">
      <div className="site-container grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-h5 text-white">{settings?.siteName}</p>
          <p className="mt-4 whitespace-pre-line text-small text-white/70">{contact?.address}</p>
        </div>

        <div>
          <p className="mb-4 font-semibold uppercase tracking-wide text-small text-white/60">Services</p>
          <ul className="flex flex-col gap-2 text-small">
            {(footer?.serviceLinks ?? []).map((l) => (
              <li key={l.id ?? l.href}>
                <Link href={l.href} className="text-white/80 hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 font-semibold uppercase tracking-wide text-small text-white/60">Legal</p>
          <ul className="flex flex-col gap-2 text-small">
            {(footer?.policyLinks ?? []).map((l) => (
              <li key={l.id ?? l.href}>
                <Link href={l.href} className="text-white/80 hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 font-semibold uppercase tracking-wide text-small text-white/60">Contact</p>
          <ul className="flex flex-col gap-2 text-small text-white/80">
            {contact?.email && <li><a href={`mailto:${contact.email}`} className="hover:text-accent">{contact.email}</a></li>}
            {contact?.phone && <li><a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-accent">{contact.phone}</a></li>}
            {contact?.fax && <li>Fax: {contact.fax}</li>}
          </ul>
          <div className="mt-4 flex gap-4 text-small">
            {social?.linkedin && <a href={social.linkedin} className="text-white/70 hover:text-accent" aria-label="LinkedIn">LinkedIn</a>}
            {social?.instagram && <a href={social.instagram} className="text-white/70 hover:text-accent" aria-label="Instagram">Instagram</a>}
            {social?.facebook && <a href={social.facebook} className="text-white/70 hover:text-accent" aria-label="Facebook">Facebook</a>}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="site-container flex flex-col gap-2 text-small text-white/60 md:flex-row md:items-center md:justify-between">
          <p>{copyright}</p>
          {settings?.legalDisclaimer && <p className="max-w-xl">{settings.legalDisclaimer}</p>}
        </div>
      </div>
    </footer>
  )
}
