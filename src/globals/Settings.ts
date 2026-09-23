import type { GlobalConfig } from 'payload'
import { area, copy, media } from '@/collections/fields'

const link = (labelDefault: string, hrefDefault: string) => ({
  fields: [copy('label', labelDefault), copy('href', hrefDefault)],
})

// Everything else editable across every page's chrome lives here: brand, nav, footer and the
// handful of shared UI labels that aren't part of any one page global. Unnamed tabs only
// group the admin UI — every field below still saves flat on the "settings" global.
export const Settings: GlobalConfig = {
  slug: 'settings',
  access: { read: () => true },
  admin: { group: 'Pages' },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contact',
          fields: [
            { name: 'address', type: 'textarea', required: true },
            { name: 'email', type: 'text', required: true },
            { name: 'phone', type: 'text', required: true },
            { name: 'fax', type: 'text' },
            { name: 'linkedin', type: 'text' },
            { name: 'instagram', type: 'text' },
            { name: 'facebook', type: 'text' },
          ],
        },
        {
          label: 'Brand & SEO',
          fields: [
            copy('siteName', 'IT Usaha Engineering'),
            copy('legalName', 'IT Usaha Engineering Sdn. Bhd. (432550-U)'),
            media('logo', 'Used as the favicon, header logo and social share fallback'),
            copy('wordmarkTop', 'IT USAHA'),
            copy('wordmarkBottom', 'ENGINEERING'),
            copy('seoTitle', 'IT Usaha Engineering'),
            area(
              'seoDescription',
              true,
              'IT Usaha Engineering Sdn. Bhd. — your trusted partner in Data Centre and Mechanical & Electrical (M&E) infrastructure across Malaysia.',
            ),
            media('ogImage', 'Default social share image when a page sets none of its own'),
          ],
        },
        {
          label: 'Navigation',
          fields: [
            {
              name: 'navLinks',
              type: 'array',
              defaultValue: [
                { label: 'About Us', href: '/about-us' },
                { label: 'Projects', href: '/projects' },
                { label: 'Contact Us', href: '/contact-us' },
                { label: 'Career', href: '/career' },
                { label: 'Events', href: '/events' },
              ],
              ...link('', ''),
            },
            copy('servicesMenuLabel', 'Our Services'),
            {
              name: 'serviceLinks',
              type: 'array',
              defaultValue: [
                { label: 'Facilities Management', href: '/services/facilities-management' },
                {
                  label: 'Data Centre & Critical System',
                  href: '/services/data-centre-critical-system',
                },
                { label: 'Project Management', href: '/services/project-management' },
                {
                  label:
                    'High Tension & Low Voltage Electrical Supply, Fire Protection Services, ACMV, BMS & Security System',
                  href: '/services/high-tension',
                },
                {
                  label: 'DFMA (Design & Fabrication of Modular Assemblies)',
                  href: '/services/dfma',
                },
              ],
              ...link('', ''),
            },
            {
              name: 'footerServiceLinks',
              type: 'array',
              defaultValue: [
                {
                  label: 'Data Centre & Critical System',
                  href: '/services/data-centre-critical-system',
                },
                {
                  label:
                    'High Tension & Low Voltage Electrical Supply, Fire Protection Services, ACMV, BMS & Security System',
                  href: '/services/high-tension',
                },
                { label: 'Project Management', href: '/services/project-management' },
                { label: 'Facilities Management', href: '/services/facilities-management' },
                {
                  label: 'DFMA (Design & Fabrication of Modular Assemblies)',
                  href: '/services/dfma',
                },
              ],
              ...link('', ''),
            },
            copy('contactCtaLabel', 'Contact Us'),
            copy('contactCtaHref', '/contact-us'),
          ],
        },
        {
          label: 'Footer',
          fields: [
            copy('footerTagline', 'Engineering trust.\nSince 1997.'),
            copy('footerNavHeading', 'Navigation Link'),
            copy('footerServicesHeading', 'Our Services'),
            copy('footerPoliciesHeading', 'Company Policies'),
            copy('footerContactHeading', 'Get in Touch'),
            {
              name: 'policyLinks',
              type: 'array',
              defaultValue: [
                { label: 'Terms & Conditions', href: '/tnc' },
                { label: 'Privacy Policy', href: '/privacy-policy' },
              ],
              ...link('', ''),
            },
            copy(
              'copyright',
              'Copyright © {year} IT Usaha Engineering Sdn. Bhd. (432550-U) | All rights reserved.',
            ),
            area(
              'disclaimer',
              true,
              "Disclaimer: Some images on this website are sourced from Freepik, Unsplash & Flaticon. We strive to adhere to mentioned resource's terms of use and provide proper attribution. If there are any concerns about the usage of these images, please contact us directly. We appreciate the contributions of mentioned resources.",
            ),
          ],
        },
        {
          label: 'Shared labels',
          fields: [
            copy('legalEyebrow', 'Company policies'),
            copy('legalOnThisPage', 'On this page'),
            copy('legalContactLine', 'Questions about these pages?'),
            copy('heroBannerKicker', 'ITU'),
            copy('heroBannerWordmark', 'IT USAHA ENGINEERING'),
            copy('carouselEmptyLabel', 'Content will be added soon.'),
          ],
        },
      ],
    },
  ],
}
