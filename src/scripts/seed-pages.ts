import 'dotenv/config'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const source = (name: string) =>
  readFileSync(path.join(root, 'template', name), 'utf8')
    .replace(/\r\n/g, '\n')
    .trim()
const match = (value: string, pattern: RegExp) => {
  const found = value.match(pattern)?.[1]?.trim()
  if (!found) throw new Error(`Template does not match ${pattern}`)
  return found
}

export function parseAbout(value: string) {
  const headline = match(value, /^Left align header: (.+)$/m)
  const background = match(value, /- Right side body: ([\s\S]*?)\n\nParallex hero banner/m)
  const leaders = [...value.matchAll(/^[123]\. (.+?) - (.+)\n  - ([^\n]+)/gm)].map((row) => ({
    name: row[1].trim(),
    role: row[2].trim(),
    bio: row[3].trim(),
  }))
  const milestones = [...value.matchAll(/^  - (\d{4}(?:-\d{4})?|Today and Beyond): (.+)$/gm)].map(
    (row) => ({ year: row[1].trim(), body: row[2].trim() }),
  )
  if (leaders.length !== 3 || milestones.length !== 14)
    throw new Error('About template leadership or milestones changed')
  return {
    headline,
    highlight: match(value, /- Span highlighted text: (.+)/),
    heroEyebrow: 'About IT Usaha',
    bannerLabel: 'About Us',
    backgroundHeading: match(value, /- Left side header: (.+)/),
    background,
    visionEyebrow: '01 / Vision',
    visionHeading: 'Our Vision',
    vision: match(value, /- Our Vision: (.+)/),
    missionEyebrow: '02 / Mission',
    missionHeading: 'Our Mission',
    mission: match(value, /- Our Mission: (.+)/),
    leadershipEyebrow: 'People',
    leadershipHeading: 'Our Leadership',
    leadershipIntro: match(value, /Center body: (Meet[^\n]+)/),
    leaders,
    milestonesEyebrow: 'Our journey',
    milestonesHeading: 'Company Milestones',
    milestonesIntro: match(value, /Center body: (Since 1997[^\n]+)/),
    milestones,
    seo: {
      title: 'About Us',
      description: 'Learn about IT Usaha Engineering, our leadership and milestones since 1997.',
    },
  }
}

export function parseContact(value: string) {
  return {
    headline: match(value, /Left align header: (.+)/),
    heroEyebrow: 'Get in touch',
    bannerLabel: 'Contact Us',
    officeEyebrow: 'Our office',
    companyName: match(value, /Left side header: (.+)/),
    companyNumber: match(value, /Left side body: (Company No\.: .+)/),
    formEyebrow: 'Start a conversation',
    formTitle: match(value, /- Form title: (.+)/),
    formDescription: match(value, /- Form description: (.+)/),
    form: {
      nameLabel: 'Name',
      emailLabel: 'Email Address',
      phoneLabel: 'Contact No.',
      companyNameLabel: 'Company Name',
      companyAddressLabel: 'Company Address',
      messageLabel: 'Message',
      privacyLine: 'Your details are handled according to our',
      successMessage: 'Thank you. Your enquiry has been received.',
      errorFallback: 'Your message could not be sent. Please try again.',
      submitLabel: 'Submit Now',
      submittingLabel: 'Submitting…',
    },
    seo: {
      title: 'Contact Us',
      description: 'Discuss your data centre or critical system project with IT Usaha Engineering.',
    },
  }
}

export function parsePolicy(value: string) {
  const [heading, ...parts] = value.split(/\n(?=\d+\. )/)
  return {
    heading: heading.trim(),
    sections: parts.map((part) => {
      const [titleLine, ...lines] = part.trim().split('\n')
      const content = lines.join('\n').trim().split(/\n\n/).filter(Boolean)
      const title = titleLine.replace(/^\d+\. /, '').trim()
      if (content.length > 1)
        return {
          title,
          intro: content[0].trim(),
          items: content.slice(1).map((text) => ({ text: text.trim() })),
        }
      return { title, body: (content[0] ?? '').trim() }
    }),
    seo: {
      title: heading.trim(),
      description: `${heading.trim()} for the IT Usaha Engineering website.`,
    },
  }
}

// A simple page heading with no CMS-authored "Span highlighted text" line (unlike about-us) —
// accent the last word, same visual treatment, no extra template instruction needed.
function lastWordHighlight(heading: string) {
  return heading.split(' ').at(-1) ?? heading
}

export function parseDataCentre(value: string) {
  const heading = match(value, /^Left align header: (.+)$/m)
  const intro = match(value, /^Left align body: (.+)$/m).replace(
    'has complete many',
    'has completed many',
  )

  const turnkey = {
    title: match(value, /Right side title: (Turnkey[^\n]+)/),
    body: match(value, /Right side title: Turnkey[^\n]+\nRight side body: (.+)/),
    subtitle: match(value, /Right side subtitle: (Computational[^\n]+)/),
    subBody: match(value, /Right side subtitle: Computational[^\n]+\nRight side body: (.+)/),
  }
  const critical = {
    title: match(value, /Left side title: (Critical[^\n]+)/),
    body: match(value, /Left side title: Critical[^\n]+\nLeft side body: (.+)/),
    items: [...value.matchAll(/^ {2}- (.+)$/gm)].map((row) => ({ text: row[1].trim() })),
  }
  if (critical.items.length !== 4)
    throw new Error('Data centre critical infrastructure items changed')
  const testing = {
    title: match(value, /Right side title: (DC Testing[^\n]+)/),
    body: match(value, /Right side title: DC Testing[^\n]+\nRight side body: (.+)/),
    galleryTitle: match(value, /Right side subtitle: (Commissioning Equipment)/),
    equipment: [] as { image?: number | null; caption?: string }[],
  }

  const whyLines = match(value, /\[Image\] - \[Image\]\n([\s\S]+)$/)
    .split('\n')
    .filter(Boolean)
  const why = whyLines.map((line) => {
    const row = line.match(/^(.+?) - (.+)$/)
    if (!row) throw new Error(`Data centre "why choose us" line did not parse: ${line}`)
    return { title: row[1].trim(), body: row[2].trim() }
  })
  if (why.length !== 2) throw new Error('Data centre "why choose us" count changed')

  return {
    heading,
    highlight: lastWordHighlight(heading),
    eyebrow: 'Our Services',
    bannerLabel: 'Data Centre & Critical System',
    intro,
    turnkey,
    critical,
    testing,
    equipmentPlaceholderCaption: 'Equipment details coming soon',
    whyHeading: match(value, /Center header: (Why Choose Us\?)/),
    why,
    seo: {
      title: 'Data Centre & Critical System',
      description:
        'Turnkey data centre design, build, operate, and testing & commissioning services by IT Usaha Engineering.',
    },
  }
}

// The "Left side title: Lightning Protection" body and its "Icons point forms" list are
// separated by a blank line in the template (an extra lead-in sentence sits between them),
// unlike every other section here — collapse that one gap so block-splitting still treats
// it as a single section.
function parseHighTensionSection(block: string) {
  const title = match(block, /(?:Left|Right) side title: (.+)/)
  const body = match(block, /(?:Left|Right) side body: (.+)/)
  const items = [...block.matchAll(/^ {2}- (.+)$/gm)].map((row) => ({ text: row[1].trim() }))
  const beforeIcons = block.match(/\n([^\n]+)\nIcons point forms:/)?.[1]?.trim()
  const note = beforeIcons && !/^(?:Left|Right) side body: /.test(beforeIcons) ? beforeIcons : ''
  return { title, body, items, note }
}

export function parseHighTension(raw: string) {
  const value = raw.replace(
    /(Left side title: Lightning Protection\nLeft side body: [^\n]+)\n\n(Our lightning protection systems[^\n]+:\nIcons point forms:)/,
    '$1\n$2',
  )
  const heading = match(value, /^Left align header: (.+)$/m)
  const intro = match(value, /^Left align body: (.+)$/m)

  const blocks = value.split(/\n\n+/).map((block) => block.trim())
  const byTitle = (needle: string) =>
    parseHighTensionSection(
      blocks.find((block) => block.includes(needle)) ??
        (() => {
          throw new Error(`High tension section not found: ${needle}`)
        })(),
    )

  const power = [
    byTitle('title: High Tension (HT) Power Systems'),
    byTitle('title: Switchgear & Transformer Solutions'),
    byTitle('title: MV & LV Distribution'),
  ]
  const backup = [
    byTitle('title: Generator Sets (Genset)'),
    byTitle('title: ACMV Installation Services'),
  ]
  const protection = [
    byTitle('title: BMS and Security System'),
    { ...byTitle('title: Fire Protection system'), title: 'Fire Protection System' },
    byTitle('title: Lightning Protection'),
  ]
  if (power.some((section) => section.items.length !== 4))
    throw new Error('High tension power section items changed')
  if (backup[0].items.length !== 4 || backup[1].items.length !== 5)
    throw new Error('High tension backup section items changed')
  if (protection[2].items.length !== 4)
    throw new Error('High tension lightning protection items changed')

  return {
    heading,
    highlight: lastWordHighlight(heading),
    eyebrow: 'Our Services',
    bannerLabel: 'High Tension & Electrical Services',
    intro,
    power,
    divider1: {
      heading: match(value, /Divider Center Header: (Electrical Works[^\n]+)/),
      body: match(
        value,
        /Divider Center Header: Electrical Works[^\n]+\nDivider Center Body: (.+)/,
      ),
    },
    backup,
    divider2: {
      heading: match(value, /Divider Center Header: (Lighting Electrical[^\n]+)/),
      body: match(
        value,
        /Divider Center Header: Lighting Electrical[^\n]+\nDivider Center Body: (.+)/,
      ),
    },
    protection,
    feature: {
      eyebrow: match(value, /Center header: (Why Choose Us\?)/),
      title: match(value, /Right side title: (Safety\. Reliability\. Compliance\.)/),
      body: match(
        value,
        /Right side title: Safety\. Reliability\. Compliance\.\nRight side body: (.+)/,
      ),
    },
    seo: {
      title: 'High Tension & Electrical Services',
      description:
        'HT/LV power, switchgear, generators, ACMV, BMS, fire protection and lightning protection services.',
    },
  }
}

export function parseProjectManagement(raw: string) {
  const heading = 'Project Management'
  const services = [...raw.matchAll(/^\d+\. (.+)$/gm)].map((row) => ({ title: row[1].trim() }))
  if (services.length !== 12) throw new Error('Project management services count changed')
  return {
    heading,
    highlight: lastWordHighlight(heading),
    eyebrow: 'Our Services',
    bannerLabel: 'Project Management',
    servicesHeading: match(raw, /Center title: (.+)/),
    services,
    whyHeading: 'Why Choose Us?',
    seo: {
      title: 'Project Management',
      description:
        'End-to-end project management consultancy (PMC) services by IT Usaha Engineering.',
    },
  }
}

export function parseFacilities(raw: string) {
  const heading = match(raw, /^Left align header: (.+)$/m)
  const intro = match(raw, /^Left align body: (.+)$/m).replace(
    'data centres we stay',
    'data centres — we stay',
  )

  const supportBlock = match(raw, /Right side grid card with icons:\n([\s\S]+?)\n\nLeft side title/)
  const support = {
    title: match(raw, /Right side title: (24\/7\/365[^\n]+)/),
    body: match(raw, /Right side title: 24\/7\/365[^\n]+\nRight side body: (.+)/),
    items: [...supportBlock.matchAll(/^\d+\. (.+)$/gm)].map((row) => ({ text: row[1].trim() })),
  }
  if (support.items.length !== 6) throw new Error('Facilities support items count changed')

  const maintenanceBlock = match(
    raw,
    /Left side grid card with icons:\n([\s\S]+?)\nRight side image/,
  )
  const maintenance = {
    title: match(raw, /Left side title: (Critical System[^\n]+)/),
    body: match(raw, /Left side title: Critical System[^\n]+\nLeft side body: (.+)/),
    items: [...maintenanceBlock.matchAll(/^\d+\. (.+)$/gm)].map((row) => ({ text: row[1].trim() })),
  }
  if (maintenance.items.length !== 5) throw new Error('Facilities maintenance items count changed')

  const whyLines = match(raw, /\[Image\] - \[Image\]\n([\s\S]+)$/)
    .split('\n')
    .filter(Boolean)
  const why = whyLines.map((line) => {
    const row = line.match(/^(.+?) - (.+)$/)
    if (!row) throw new Error(`Facilities "why choose us" line did not parse: ${line}`)
    return { title: row[1].trim(), body: row[2].trim() }
  })
  if (why.length !== 2) throw new Error('Facilities "why choose us" count changed')

  return {
    heading,
    highlight: lastWordHighlight(heading),
    eyebrow: 'Our Services',
    bannerLabel: 'Facilities Management',
    intro,
    support,
    maintenance,
    whyHeading: match(raw, /Center header: (Why Choose Us\?)/),
    why,
    seo: {
      title: 'Facilities Management',
      description: '24/7/365 facilities management for mission-critical data centre environments.',
    },
  }
}

export function parseDfma(raw: string) {
  const heading = match(raw, /^Left align header: (.+)$/m)
  const facts = [...raw.matchAll(/^- (.+?): (.+)$/gm)].map((row) => ({
    label: row[1].trim(),
    value: row[2].trim().replace('m^2', 'm²'),
  }))
  if (facts.length !== 2) throw new Error('DFMA facts count changed')

  const capBlock = match(
    raw,
    /Right side body: Grid card with icons and title and body\n([\s\S]+?)\n\nLeft side title/,
  )
  const capabilityCards = [...capBlock.matchAll(/^\d+\. (.+?) - (.+)$/gm)].map((row) => ({
    title: row[1].trim(),
    body: row[2].trim(),
  }))
  if (capabilityCards.length !== 4) throw new Error('DFMA capabilities count changed')

  const benBlock = match(
    raw,
    /Left side body: Grid card with icons and title\n([\s\S]+?)\nRight side image/,
  )
  const benefitItems = [...benBlock.matchAll(/^\d+\. (.+)$/gm)].map((row) => ({
    text: row[1].trim(),
  }))
  if (benefitItems.length !== 3) throw new Error('DFMA benefits count changed')

  return {
    heading,
    highlight: 'Modular Assemblies',
    eyebrow: 'Our Services',
    bannerLabel: 'DFMA',
    facts,
    capabilities: {
      title: match(raw, /Right side title: (Key Capabilities)/),
      cards: capabilityCards,
    },
    benefits: { title: match(raw, /Left side title: (Benefits)/), items: benefitItems },
    visual: { title: 'Modular Assembly' },
    whyHeading: 'Why Choose Us?',
    seo: {
      title: 'DFMA',
      description:
        'Design & Fabrication of Modular Assemblies (DFMA) services by IT Usaha Engineering.',
    },
  }
}

export function parseEventsPage(value: string) {
  const heading = match(value, /^Left align header: (.+)$/m)
  return {
    heading,
    highlight: lastWordHighlight(heading),
    eyebrow: 'Events',
    bannerLabel: 'Events',
    emptyTitle: 'More events in this category are on the way',
    emptyMeta: 'Coming soon',
    viewLabel: 'View Event',
    seo: { title: 'Events', description: "See what's happening at IT Usaha Engineering." },
  }
}

export function parseProjectsPage(value: string) {
  const heading = match(value, /^Left align header: (.+)$/m)
  return {
    heading,
    highlight: lastWordHighlight(heading),
    eyebrow: 'Projects',
    bannerLabel: 'Projects',
    emptyTitle: 'More projects in this status are on the way',
    emptyMeta: 'Coming soon',
    detailsLabel: 'Project Details',
    completedLabel: 'Completed',
    ongoingLabel: 'Ongoing',
    clientLabel: 'Client',
    consultantLabel: 'Data Center Consultant',
    consultantsLabel: 'Data Center Consultants',
    scopeLabel: 'Scope of Works',
    commencementLabel: 'Commencement Date',
    completionLabel: 'Completion Date',
    presentLabel: 'Present',
    detailCta: {
      heading:
        'Have a project in mind? We’re here to help you plan, build, and maintain it with confidence',
      ctaLabel: 'Contact Us',
      ctaHref: '/contact-us',
    },
    seo: {
      title: 'Projects',
      description: 'Data centres and MEP projects delivered by IT Usaha Engineering.',
    },
  }
}

// Splits one vacancy's body into sections. A paragraph (blank-line separated) either opens
// with a heading line followed by a "Label:" line (e.g. "Administration\nResponsibilities:"),
// or opens directly with the "Label:" line. Within its body, a line ending in ":" (e.g. the
// Internship's "Design & Build for Data Centre include of:") is the section's intro, not a
// bullet item.
function parseVacancySections(body: string) {
  return body.split(/\n\s*\n/).map((block) => {
    const lines = block
      .trim()
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    const hasHeading = lines.length > 1 && lines[1].endsWith(':') && !lines[0].endsWith(':')
    const heading = hasHeading ? lines[0] : undefined
    const label = (hasHeading ? lines[1] : lines[0]).replace(/:$/, '')
    const rest = lines.slice(hasHeading ? 2 : 1)
    const hasIntro = rest.length > 0 && rest[0].endsWith(':')
    return {
      heading,
      label,
      intro: hasIntro ? rest[0] : undefined,
      items: (hasIntro ? rest.slice(1) : rest).map((text) => ({ text })),
    }
  })
}

export function parseCareer(value: string) {
  const heading = match(value, /^Left align header: (.+)$/m)
  const vacancyBlock = match(value, /Accordian:\n([\s\S]+?)\n\nLeft side header: Apply Now/)
  const vacancies = vacancyBlock.split(/\n(?=\d+\. )/).map((chunk) => {
    const [, order, title, body] = chunk.match(/^(\d+)\. (.+?)\n\n([\s\S]+)$/) ?? []
    if (!title) throw new Error(`Career template vacancy did not parse: ${chunk.slice(0, 40)}`)
    return {
      title: title.trim(),
      order: Number(order),
      key: title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
      open: true,
      sections: parseVacancySections(body),
    }
  })
  if (vacancies.length !== 7) throw new Error('Career template vacancy count changed')
  return {
    heading,
    highlight: lastWordHighlight(heading),
    eyebrow: 'Career',
    bannerLabel: 'Career',
    positionsHeading: 'Available Positions',
    applyHeading: match(value, /Left side header: (Apply Now)/),
    applyBody: match(value, /Left side body: (.+)/),
    form: {
      nameLabel: 'Name',
      emailLabel: 'Email Address',
      phoneLabel: 'Contact No.',
      vacancyLabel: 'Position Applying For',
      selectPlaceholder: 'Select a position',
      introductionLabel: 'Brief Introduction',
      resumeLabel: 'Upload Résumé (PDF, up to 5MB)',
      closedLabel: 'Closed',
      applyButtonLabel: 'Apply for this position',
      noOpeningsMessage: 'There are no open positions right now. Please check back soon.',
      privacyLine: 'Your details are handled according to our',
      successMessage: 'Thank you. Your application has been received.',
      errorFallback: 'Your application could not be sent. Please try again.',
      submitLabel: 'Submit Now',
      submittingLabel: 'Submitting…',
      nameRequired: 'Enter your name.',
      emailInvalid: 'Enter a valid email address.',
      phoneRequired: 'Enter a contact number.',
      vacancyRequired: 'Select a position.',
      introductionRequired: 'Tell us a little about yourself.',
      resumeRequired: 'Attach your résumé.',
      resumeMustBePdf: 'Résumé must be a PDF.',
      resumeTooLarge: 'Résumé must be under 5MB.',
    },
    seo: { title: 'Career', description: 'Explore open positions at IT Usaha Engineering.' },
    vacancies,
  }
}

// The one real project the plan asks to seed, with valid Lexical content (a level-2 heading,
// a paragraph and a bullet list) — see the plan's "Seed valid Lexical content" section.
export const tmNxeraProject = {
  title: 'TM Nxera, Johor',
  slug: 'tm-nxera-johor',
  status: 'ongoing' as const,
  order: 0,
  client: 'ST Dynamo DC Sdn Bhd',
  consultants: [{ name: 'Squire Mech Pte Ltd' }],
  scope: 'Mechanical & Electrical System',
  commencementDate: '2025-09-01T00:00:00.000Z',
  completionDate: '2026-09-01T00:00:00.000Z',
  published: true,
  body: {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      direction: 'ltr' as const,
      version: 1,
      children: [
        {
          type: 'heading',
          tag: 'h2',
          format: '',
          indent: 0,
          direction: 'ltr',
          version: 1,
          children: [
            {
              type: 'text',
              format: 0,
              detail: 0,
              mode: 'normal',
              style: '',
              text: 'Block 1',
              version: 1,
            },
          ],
        },
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          direction: 'ltr',
          version: 1,
          children: [
            {
              type: 'text',
              format: 0,
              detail: 0,
              mode: 'normal',
              style: '',
              text: 'To supply & install, testing commissioning & maintenance of mechanical and electrical system to DC fit out works',
              version: 1,
            },
          ],
        },
        {
          type: 'list',
          tag: 'ul',
          listType: 'bullet',
          start: 1,
          format: '',
          indent: 0,
          direction: 'ltr',
          version: 1,
          children: [
            {
              type: 'listitem',
              value: 1,
              format: '',
              indent: 0,
              direction: 'ltr',
              version: 1,
              children: [
                {
                  type: 'text',
                  format: 0,
                  detail: 0,
                  mode: 'normal',
                  style: '',
                  text: 'IT Load Capacity: 16MW',
                  version: 1,
                },
              ],
            },
          ],
        },
      ],
    },
  },
}

export const defaults = {
  aboutUs: parseAbout(source('about-us.md')),
  contactUs: parseContact(source('contact-us.md')),
  privacyPolicy: parsePolicy(source('privacypolicy.md')),
  termsAndConditions: parsePolicy(source('tnc.md')),
  eventsPage: parseEventsPage(source('event.md')),
  projectsPage: parseProjectsPage(source('projects.md')),
  careerPage: parseCareer(source('career.md')),
  serviceDataCentre: parseDataCentre(source('data-centre-critical-system.md')),
  serviceHighTension: parseHighTension(source('high-tension.md')),
  serviceProjectManagement: parseProjectManagement(source('project-management.md')),
  serviceFacilitiesManagement: parseFacilities(source('facilities-management.md')),
  serviceDfma: parseDfma(source('dfma.md')),
}

async function main() {
  if (process.argv.includes('--write-defaults')) {
    // Vacancies are seeded as their own collection documents, not part of the career-page
    // global — keep them out of the page-defaults fallback file.
    const careerPage = Object.fromEntries(
      Object.entries(defaults.careerPage).filter(([key]) => key !== 'vacancies'),
    )
    writeFileSync(
      path.join(root, 'src/lib/page-defaults.json'),
      `${JSON.stringify({ ...defaults, careerPage }, null, 2)}\n`,
    )
    return
  }
  const { getPayloadClient } = await import('../lib/payload')
  const payload = await getPayloadClient()
  const entries = [
    ['about-us', defaults.aboutUs, 'headline'],
    ['contact-us', defaults.contactUs, 'headline'],
    ['privacy-policy', defaults.privacyPolicy, 'heading'],
    ['terms-and-conditions', defaults.termsAndConditions, 'heading'],
    ['events-page', defaults.eventsPage, 'heading'],
    ['projects-page', defaults.projectsPage, 'heading'],
    ['career-page', defaults.careerPage, 'heading'],
    ['service-data-centre', defaults.serviceDataCentre, 'heading'],
    ['service-high-tension', defaults.serviceHighTension, 'heading'],
    ['service-project-management', defaults.serviceProjectManagement, 'heading'],
    ['service-facilities-management', defaults.serviceFacilitiesManagement, 'heading'],
    ['service-dfma', defaults.serviceDfma, 'heading'],
  ] as const
  for (const [slug, data, marker] of entries) {
    const saved = await payload.findGlobal({ slug })
    if (
      (marker === 'headline' && 'headline' in saved && saved.headline) ||
      (marker === 'heading' && 'heading' in saved && saved.heading)
    ) {
      console.log(`Skipped ${slug}: already populated.`)
      continue
    }
    await payload.updateGlobal({ slug, data })
    console.log(`Seeded ${slug}.`)
  }

  for (const vacancy of defaults.careerPage.vacancies) {
    const existing = await payload.find({
      collection: 'vacancies',
      where: { key: { equals: vacancy.key } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      console.log(`Skipped vacancy ${vacancy.key}: already exists.`)
      continue
    }
    await payload.create({ collection: 'vacancies', data: vacancy })
    console.log(`Seeded vacancy ${vacancy.key}.`)
  }

  const existingProject = await payload.find({
    collection: 'projects',
    where: { slug: { equals: tmNxeraProject.slug } },
    limit: 1,
  })
  if (existingProject.docs.length > 0)
    console.log(`Skipped project ${tmNxeraProject.slug}: already exists.`)
  else {
    await payload.create({ collection: 'projects', data: tmNxeraProject })
    console.log(`Seeded project ${tmNxeraProject.slug}.`)
  }

  process.exit(0)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
