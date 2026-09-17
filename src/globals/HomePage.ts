import type { GlobalConfig } from 'payload'
import { revalidateGlobalHook } from '@/lib/revalidateHook'

const visibilityToggle = { name: 'visible', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } } as const

export const HomePage: GlobalConfig = {
  slug: 'homePage',
  hooks: { afterChange: [revalidateGlobalHook] },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        visibilityToggle,
        { name: 'headline', type: 'text', defaultValue: 'YOUR TRUSTED PARTNER IN DATA CENTRE' },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
        { name: 'ctaLabel', type: 'text', defaultValue: 'Learn More' },
        { name: 'ctaHref', type: 'text', defaultValue: '/about-us/' },
      ],
    },
    {
      name: 'whoWeAre',
      type: 'group',
      label: 'Who We Are',
      fields: [
        visibilityToggle,
        { name: 'heading', type: 'text', defaultValue: 'Who We Are' },
        {
          name: 'body',
          type: 'textarea',
          defaultValue:
            'We are an integrated engineering company specializing in Data Centre and other Mission Critical facility. Since 1997, we have built a strong track record in mechanical and electrical engineering, turnkey contracting, project management, consultancy, commissioning management, design review, and checker services.',
        },
        { name: 'ctaLabel', type: 'text', defaultValue: 'Learn About Us' },
        { name: 'ctaHref', type: 'text', defaultValue: '/about-us/' },
      ],
    },
    {
      name: 'credentialFacts',
      type: 'group',
      label: 'Credential Facts',
      fields: [
        visibilityToggle,
        {
          name: 'counters',
          type: 'array',
          minRows: 1,
          maxRows: 4,
          defaultValue: [
            { label: 'Data Centres Delivered Nationwide', value: 0 },
            { label: 'Professional Staffs', value: 0 },
            { label: 'Successful Projects Completed', value: 0, suffix: '+' },
          ],
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'number', required: true, admin: { description: 'TODO: client to supply approved figure — placeholder is 0.' } },
            { name: 'suffix', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'meSolutions',
      type: 'group',
      label: 'Comprehensive M&E Solutions',
      fields: [
        visibilityToggle,
        { name: 'heading', type: 'text', defaultValue: 'Comprehensive M&E Solutions' },
        { name: 'intro', type: 'textarea' },
        {
          name: 'services',
          type: 'array',
          admin: { description: 'Links into the services collection by slug.' },
          fields: [
            { name: 'service', type: 'relationship', relationTo: 'services' },
          ],
        },
      ],
    },
    {
      name: 'whyChooseUs',
      type: 'group',
      label: 'Why Choose Us',
      fields: [
        visibilityToggle,
        { name: 'heading', type: 'text', defaultValue: 'Why Choose Us' },
        {
          name: 'reasons',
          type: 'array',
          minRows: 1,
          maxRows: 8,
          defaultValue: [
            { title: 'Decades of Proven Experience' },
            { title: 'Technically Sound & Resource-Ready' },
            { title: 'Strong Financial Backing' },
            { title: 'Strong Vendor Partnerships' },
            { title: '24/7/365 Support & Maintenance' },
            { title: 'Trusted by Suppliers' },
            { title: 'Uncompromising Safety & Quality' },
            { title: 'Sustainability Focus' },
          ],
          fields: [
            { name: 'icon', type: 'text' },
            { name: 'title', type: 'text', required: true },
            { name: 'body', type: 'textarea' },
          ],
        },
      ],
    },
    {
      name: 'standards',
      type: 'group',
      label: 'Industry Standards',
      fields: [
        visibilityToggle,
        { name: 'heading', type: 'text', defaultValue: 'Industry Standards' },
        {
          name: 'items',
          type: 'array',
          defaultValue: [
            { code: 'ISO 9001', name: 'Quality Management System' },
            { code: 'ISO 14001', name: 'Environmental Management Systems' },
            { code: 'ISO 27001', name: 'Information Security Management System' },
            { code: 'ISO 45001', name: 'Occupational Health & Safety Management System' },
            { code: 'ISO 50001', name: 'Energy Management System' },
          ],
          fields: [
            { name: 'code', type: 'text', required: true },
            { name: 'name', type: 'text', required: true },
            { name: 'badge', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
    {
      name: 'clients',
      type: 'group',
      label: 'Our Clients',
      fields: [
        visibilityToggle,
        { name: 'heading', type: 'text', defaultValue: 'Our Clients' },
        {
          name: 'logos',
          type: 'array',
          defaultValue: [{ name: 'AIMS' }, { name: 'UM' }, { name: 'AT' }, { name: 'TIME' }, { name: 'VADS' }, { name: '4S' }, { name: 'MB' }, { name: 'TMB' }],
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'logo', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
    {
      name: 'projectsIntro',
      type: 'group',
      label: 'Our Projects',
      fields: [
        visibilityToggle,
        { name: 'heading', type: 'text', defaultValue: 'Our Projects' },
        { name: 'body', type: 'textarea' },
      ],
    },
    {
      name: 'finalCta',
      type: 'group',
      fields: [
        visibilityToggle,
        { name: 'heading', type: 'text', defaultValue: 'Looking for reliable Data Centre and M&E Solutions? We’re ready to help' },
        { name: 'buttonLabel', type: 'text', defaultValue: 'Contact Us' },
        { name: 'buttonHref', type: 'text', defaultValue: '/contact-us/' },
      ],
    },
  ],
}
