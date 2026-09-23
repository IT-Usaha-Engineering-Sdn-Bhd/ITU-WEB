// Seeds text content only, verbatim from template/frontend/landing.md — icons and images are picked by
// hand in the Payload admin afterwards.
import 'dotenv/config'
import { getPayloadClient } from '@/lib/payload'
import type { Landing } from '@/payload-types'

const landing: Omit<Landing, 'id' | 'updatedAt' | 'createdAt' | 'globalType'> = {
  hero: {
    punchline: 'Your Trusted Partner in Data Centre',
    learnMoreLabel: 'Explore our expertise',
    welcomeLabel: 'Welcome to IT Usaha Engineering',
    commissionLabel: 'COMMISSION',
  },
  whoWeAre: {
    eyebrow: 'Built on expertise. Driven by trust.',
    header: 'Who We Are',
    body: 'We are an integrated engineering company specializing in Data Centre and other Mission Critical facility. Since 1997, we have built a strong track record in mechanical and electrical engineering, turnkey contracting, project management, consultancy, commissioning management, design review, and checker services.\n\nSupported by a highly dedicated and experienced team of management professionals, engineers, supervisors, technicians, and skilled workers, we possess the expertise and capability to deliver comprehensive, end-to-end engineering solutions to our valued partners and clients.',
    ctaLabel: 'About Us',
    ctaHref: '/about-us',
    modelCaptionTitle: 'DATA CENTRE',
    modelCaptionSubtitle: 'Structure / Systems',
  },
  facts: {
    eyebrow: 'A track record that delivers',
    header: 'Credential Facts',
    body: "With decades of expertise, IT Usaha Engineering stands as a reliable leader in Malaysia's Data Centre and MEP industry.",
    stats: [
      { value: 100, suffix: '', label: 'Data Centres Delivered Nationwide' },
      { value: 100, suffix: '', label: 'Professional Staffs' },
      { value: 500, suffix: '+', label: 'Successful Projects Completed' },
    ],
  },
  services: {
    eyebrow: 'Expertise, connected.',
    header: 'Comprehensive M&E Solutions for Critical Infrastructure',
    body: 'IT Usaha Engineering offers a full spectrum of Mechanical & Electrical (M&E) services, from preliminary design up to HT and LV, BMS, security system, and facilities management.',
    placeholderLabel: 'Service imagery coming soon',
    items: [
      {
        title: 'Facilities Management',
        tagline: 'Reliable. Secure. Always On.',
        body: 'We offer a comprehensive suite of services tailored to the specific needs of Data Centres, covering electrical, mechanical, civil, and environmental systems, ensuring compliance with industry standards such as TIA-942, Uptime Institute, and ISO certifications.',
      },
      {
        title: 'Data Centre & Critical System',
        body: 'Design, install, and maintain Critical MEP infrastructure system – including incoming electrical power supply, ACMV, fire protection, BMS, security system and facilities management – for high-performing Data Centres.',
      },
      {
        title: 'Project Management',
        body: 'Comprehensive and well-coordinated project execution services tailored for infrastructure and electrical works. IT Usaha oversees every phase from planning, scheduling, and procurement to site supervision and quality control, ensuring seamless delivery that meets technical standards, timelines, and client expectations.',
      },
      {
        title:
          'High Tension & Low Voltage Electrical Supply, Fire Protection Services, ACMV, BMS & Security System',
        body: 'Well coordinated safe and efficient power delivery installation and commissioning from cable landing station to 132kV substation down to BMS and security system of Data centre.',
      },
      {
        title: 'DFMA (Design & Fabrication of Modular Assemblies)',
        body: 'Placeholder',
      },
    ],
  },
  whyUs: {
    eyebrow: 'Confidence at every stage',
    header: 'Why Choose Us',
    cards: [
      {
        title: 'Decades of Proven Experience',
        body: 'IT Usaha has delivered many reputable data centres and numerous large-scale M&E infrastructure projects across Malaysia.',
      },
      {
        title: 'Technically Sound & Resource-Ready',
        body: 'Our in-house design-and-build team, supported by 500 skilled personnel and reliable subcontractors, ensures every project is handled with precision and agility.',
      },
      {
        title: 'Strong Financial Backing',
        body: 'With over millions of paid-up capital and bank credit, we are financially equipped to handle large-scale projects.',
      },
      {
        title: 'Strong Vendor Partnerships',
        body: 'We work closely with global brands like ABB, Schneider, ASCO, and Vertiv, ensuring our systems are inline with latest updates powered by reliable, high-quality components.',
      },
      {
        title: '24/7/365 Support & Maintenance',
        body: 'We offer round-the-clock FM (Facility Maintenance) services, ensuring that systems remain reliable and efficient throughout their lifecycle.',
      },
      {
        title: 'Trusted by Suppliers',
        body: "We've proven strong supplier credit facilities, reflecting strong industry trust and solid relationships.",
      },
      {
        title: 'Uncompromising Safety & Quality',
        body: "We've achieved zero workplace accidents in over 9 million man-hours. Our safety standards, emergency protocols, and QA/QC systems meet international benchmarks.",
      },
      {
        title: 'Sustainability Focus',
        body: 'We incorporate green engineering principles into all our projects, helping clients achieve their energy and sustainability targets.',
      },
    ],
  },
  certs: {
    eyebrow: 'Quality without compromise',
    header: 'Engineered to Meet Industry Standards',
    slideEyebrow: 'Industry standards',
    placeholderLabel: 'Certificate image coming soon',
    items: [
      { name: 'ISO 45001', description: 'Occupational Health & Safety Management System' },
      { name: 'ISO 50001', description: 'Energy Management System' },
      { name: 'ISO 9001', description: 'Quality Management System' },
      { name: 'ISO 14001', description: 'Environmental Management Systems' },
      { name: 'ISO 27001', description: 'Information Security Management System' },
    ],
  },
  clients: {
    eyebrow: 'Partnerships built to last',
    header: 'Our Clients',
    body: 'Since 1997, IT Usaha Engineering is committed to providing top-quality electrical and mechanical solutions, and has gained trustworthiness by renowned clients over the years.',
    placeholderLabel: 'Client logo coming soon',
    logos: [],
  },
  projects: {
    eyebrow: 'Precision, put into practice',
    header: 'Our Projects',
    body: 'Explore our portfolio of mission-critical engineering projects across Malaysia. From high-performance Data Centres to complex M&E systems, each project reflects our commitment to quality, safety, and precision.',
    ctaLabel: 'View Projects',
    ctaHref: '/projects',
  },
  ctaBand: {
    header: "Looking for reliable Data Centre and M&E Solutions? We're ready to help",
    ctaLabel: 'Contact Us',
    ctaHref: '/contact-us',
  },
  seo: {
    title: 'IT Usaha Engineering — Your Trusted Partner in Data Centre',
    description:
      'Integrated M&E engineering company delivering Data Centre and Mission Critical infrastructure across Malaysia since 1997.',
  },
}

async function main() {
  const payload = await getPayloadClient()
  await payload.updateGlobal({ slug: 'landing', data: landing })
  console.log('Seeded landing global text content.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
