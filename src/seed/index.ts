import 'dotenv/config'
import { getPayload, type Payload, type Where } from 'payload'
import config from '@/payload.config'
import { richText } from './lexical'
import { services, projects, milestones, eventCategories, events, jobPositions } from './data'

/** Idempotent upsert keyed on a unique field — safe to re-run. */
async function upsert(
  payload: Payload,
  collection: Parameters<Payload['find']>[0]['collection'],
  where: Where,
  data: Record<string, unknown>,
) {
  const existing = await payload.find({ collection, where, limit: 1 })
  if (existing.docs[0]) {
    return payload.update({ collection, id: existing.docs[0].id, data })
  }
  return payload.create({ collection, data })
}

async function run() {
  const payload = await getPayload({ config })

  // --- admin user ---
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@itusaha.com'
  const existingUser = await payload.find({ collection: 'users', where: { email: { equals: adminEmail } }, limit: 1 })
  if (!existingUser.docs[0]) {
    await payload.create({
      collection: 'users',
      data: { email: adminEmail, password: process.env.SEED_ADMIN_PASSWORD ?? 'change-me-now', roles: ['admin'] },
    })
    console.log(`Created admin user ${adminEmail}`)
  }

  // --- services ---
  for (const s of services) {
    await upsert(payload, 'services', { slug: { equals: s.slug } }, {
      title: s.title,
      slug: s.slug,
      shortDescription: s.shortDescription,
      order: s.order,
      status: 'published',
    })
  }
  console.log(`Seeded ${services.length} services`)

  // --- projects ---
  for (const p of projects) {
    await upsert(payload, 'projects', { slug: { equals: p.slug } }, {
      title: p.title,
      slug: p.slug,
      projectStatus: p.projectStatus,
      location: p.location,
      commencementDate: p.commencementDate,
      completionDate: p.completionDate,
      status: 'published',
    })
  }
  console.log(`Seeded ${projects.length} projects`)

  // --- milestones ---
  for (const m of milestones) {
    await upsert(payload, 'milestones', { year: { equals: m.year } }, {
      year: m.year,
      title: m.title,
      description: m.description,
      order: m.order,
      status: 'published',
    })
  }
  console.log(`Seeded ${milestones.length} milestones`)

  // --- event categories ---
  const categoryIds = new Map<string, number | string>()
  for (const [i, c] of eventCategories.entries()) {
    const doc = await upsert(payload, 'eventCategories', { slug: { equals: c.slug } }, {
      name: c.name,
      slug: c.slug,
      order: i,
      status: 'published',
    })
    categoryIds.set(c.slug, doc.id)
  }
  console.log(`Seeded ${eventCategories.length} event categories`)

  // --- events ---
  for (const e of events) {
    const categoryId = categoryIds.get(e.category)
    await upsert(payload, 'events', { slug: { equals: e.slug } }, {
      title: e.title,
      slug: e.slug,
      category: categoryId,
      eventDate: e.eventDate,
      status: 'published',
    })
  }
  console.log(`Seeded ${events.length} events`)

  // --- job positions ---
  for (const j of jobPositions) {
    await upsert(payload, 'jobPositions', { slug: { equals: j.slug } }, {
      title: j.title,
      slug: j.slug,
      location: j.location,
      status: 'published',
    })
  }
  console.log(`Seeded ${jobPositions.length} job positions`)

  // --- policies ---
  await upsert(payload, 'policies', { type: { equals: 'terms-conditions' } }, {
    title: 'Terms & Conditions',
    type: 'terms-conditions',
    content: richText(['These Terms & Conditions are placeholder copy pending lawyer-approved text from IT Usaha Engineering.']),
  })
  await upsert(payload, 'policies', { type: { equals: 'privacy-policy' } }, {
    title: 'Privacy Policy',
    type: 'privacy-policy',
    content: richText(['This Privacy Policy is placeholder copy pending lawyer-approved text from IT Usaha Engineering.']),
  })
  console.log('Seeded policies')

  // --- about-us page ---
  await upsert(payload, 'pages', { slug: { equals: 'about-us' } }, {
    title: 'About Us',
    slug: 'about-us',
    heroTitle: 'About IT Usaha Engineering',
    intro: richText([
      'We are an integrated engineering company specializing in Data Centre and other Mission Critical facility. Since 1997, we have built a strong track record in mechanical and electrical engineering, turnkey contracting, project management, consultancy, commissioning management, design review, and checker services.',
    ]),
    leadership: [
      { name: 'Jeffrey Low Wei Keong', role: 'Director' },
      { name: 'Leong Choon Keong', role: 'Director' },
      { name: 'Ng Kim Han', role: 'Director' },
    ],
    status: 'published',
  })
  console.log('Seeded About Us page')

  // --- site settings ---
  await payload.updateGlobal({
    slug: 'siteSettings',
    data: {
      siteName: 'IT Usaha Engineering',
      contact: {
        companyName: 'IT Usaha Engineering Sdn. Bhd.',
        companyNumber: '199701017053 (432550-U)',
        address: '9-1, Jalan Puteri 2/7, Bandar Puteri, 47100 Puchong, Selangor Darul Ehsan',
        email: 'itusaha@itusaha.com',
        phone: '03-8065 3090/92/93',
        fax: '03-8065 3091',
      },
      legalDisclaimer: 'Some imagery on this site is used for placeholder purposes only and will be replaced with licensed or company-owned assets.',
    },
  })

  // --- header/footer nav ---
  const serviceDocs = await payload.find({ collection: 'services', limit: 50, sort: 'order' })
  await payload.updateGlobal({
    slug: 'headerNavigation',
    data: {
      items: [
        { label: 'About Us', href: '/about-us/' },
        {
          label: 'Services',
          href: '/our-service/data-centre-critical-system/',
          children: serviceDocs.docs.map((s) => ({ label: s.title, href: `/our-service/${s.slug}/` })),
        },
        {
          label: 'Projects',
          href: '/projects/',
          children: [
            { label: 'Completed Projects', href: '/project-status/completed-projects/' },
            { label: 'Ongoing Projects', href: '/project-status/ongoing-projects/' },
          ],
        },
        { label: 'Events', href: '/events/' },
        { label: 'Career', href: '/career/' },
      ],
      ctaLabel: 'Contact Us',
      ctaHref: '/contact-us/',
    },
  })

  await payload.updateGlobal({
    slug: 'footerNavigation',
    data: {
      serviceLinks: serviceDocs.docs.map((s) => ({ label: s.title, href: `/our-service/${s.slug}/` })),
      policyLinks: [
        { label: 'Terms & Conditions', href: '/terms-conditions/' },
        { label: 'Privacy Policy', href: '/privacy-policy/' },
      ],
      copyrightText: 'Copyright © {year} IT Usaha Engineering Sdn. Bhd. (432550-U) | All rights reserved.',
    },
  })

  // --- home page ---
  await payload.updateGlobal({
    slug: 'homePage',
    data: {
      meSolutions: {
        services: serviceDocs.docs.slice(0, 4).map((s) => ({ service: s.id })),
      },
    },
  })

  console.log('Seeded globals')
  console.log('Seed complete.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
