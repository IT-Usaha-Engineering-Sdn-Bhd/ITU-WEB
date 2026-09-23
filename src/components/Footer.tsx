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
import { navigation, services } from '@/lib/navigation'
import { FooterGate } from './FooterGate'

export async function Footer() {
  const settings = await getSettings()
  const footerServices = [services[1], services[3], services[2], services[0], services[4]]
  return (
    <FooterGate>
      <footer className="site-footer">
        <div className="section-shell">
          <div className="footer-brandline">
            <span>
              IT USAHA<span>ENGINEERING</span>
            </span>
            <p>
              Engineering trust.
              <br />
              Since 1997.
            </p>
          </div>
          <div className="footer-grid">
            <div>
              <h3>Navigation Link</h3>
              <ul>
                {navigation.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Our Services</h3>
              <ul>
                {footerServices.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Company Policies</h3>
              <ul>
                <li>
                  <Link href="/tnc">Terms &amp; Conditions</Link>
                </li>
                <li>
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3>Get in Touch</h3>
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
            <p>
              Copyright &copy; {new Date().getFullYear()} IT Usaha Engineering Sdn. Bhd. (432550-U)
              | All rights reserved.
            </p>
            <p>
              Disclaimer: Some images on this website are sourced from Freepik, Unsplash &amp;
              Flaticon. We strive to adhere to mentioned resource&apos;s terms of use and provide
              proper attribution. If there are any concerns about the usage of these images, please
              contact us directly. We appreciate the contributions of mentioned resources.
            </p>
          </div>
        </div>
      </footer>
    </FooterGate>
  )
}
