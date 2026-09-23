import Link from 'next/link'
import {
  EnvelopeSimple,
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  MapPin,
  Phone,
  Printer,
  ArrowUpRight,
} from '@phosphor-icons/react/dist/ssr'
import { getSettings } from '@/lib/site-content'
import { FooterGate } from './FooterGate'

export async function Footer() {
  const settings = await getSettings()
  const navLinks = settings.navLinks ?? []
  const footerServiceLinks = settings.footerServiceLinks ?? []
  const policyLinks = settings.policyLinks ?? []
  return (
    <FooterGate>
      <footer className="site-footer">
        <div className="section-shell">
          <div className="footer-brandline">
            <span>
              {settings.wordmarkTop}
              <span>{settings.wordmarkBottom}</span>
            </span>
            <p>
              {settings.footerTagline.split('\n').map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
          </div>
          <div className="footer-grid">
            <div>
              <h3>{settings.footerNavHeading}</h3>
              <ul>
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href ?? '#'}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>{settings.footerServicesHeading}</h3>
              <ul>
                {footerServiceLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href ?? '#'}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>{settings.footerPoliciesHeading}</h3>
              <ul>
                {policyLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href ?? '#'}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>{settings.footerContactHeading}</h3>
              <ul className="contact-list">
                <li>
                  <MapPin size={19} />
                  <span>{settings.address}</span>
                </li>
                <li>
                  <EnvelopeSimple size={19} />
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </li>
                <li>
                  <Phone size={19} />
                  <a href={'tel:' + settings.phone.split('/')[0].replace(/[^+0-9]/g, '')}>
                    {settings.phone}
                  </a>
                </li>
                <li>
                  <Printer size={19} />
                  <span>{settings.fax}</span>
                </li>
              </ul>
              <div className="social-links">
                {[
                  { url: settings.linkedin, label: 'LinkedIn', Icon: LinkedinLogo },
                  { url: settings.instagram, label: 'Instagram', Icon: InstagramLogo },
                  { url: settings.facebook, label: 'Facebook', Icon: FacebookLogo },
                ].map(({ url, label, Icon }) =>
                  url ? (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      className="icon-button"
                    >
                      <Icon size={20} />
                      <ArrowUpRight size={10} />
                    </a>
                  ) : null,
                )}
              </div>
            </div>
          </div>
          <div className="footer-legal">
            <p>{settings.copyright.replace('{year}', String(new Date().getFullYear()))}</p>
            <p>{settings.disclaimer}</p>
          </div>
        </div>
      </footer>
    </FooterGate>
  )
}
