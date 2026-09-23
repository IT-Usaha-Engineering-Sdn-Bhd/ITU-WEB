import 'dotenv/config'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const source = (name: string) => readFileSync(path.join(root, 'template', name), 'utf8').replace(/\r\n/g, '\n').trim()
const match = (value: string, pattern: RegExp) => {
  const found = value.match(pattern)?.[1]?.trim()
  if (!found) throw new Error(`Template does not match ${pattern}`)
  return found
}

export function parseAbout(value: string) {
  const headline = match(value, /^Left align header: (.+)$/m)
  const background = match(value, /- Right side body: ([\s\S]*?)\n\nParallex hero banner/m)
  const leaders = [...value.matchAll(/^[123]\. (.+?) - (.+)\n  - ([^\n]+)/gm)]
    .map((row) => ({ name: row[1].trim(), role: row[2].trim(), bio: row[3].trim() }))
  const milestones = [...value.matchAll(/^  - (\d{4}(?:-\d{4})?|Today and Beyond): (.+)$/gm)]
    .map((row) => ({ year: row[1].trim(), body: row[2].trim() }))
  if (leaders.length !== 3 || milestones.length !== 14) throw new Error('About template leadership or milestones changed')
  return {
    headline, highlight: match(value, /- Span highlighted text: (.+)/),
    backgroundHeading: match(value, /- Left side header: (.+)/), background,
    vision: match(value, /- Our Vision: (.+)/), mission: match(value, /- Our Mission: (.+)/),
    leadershipHeading: 'Our Leadership',
    leadershipIntro: match(value, /Center body: (Meet[^\n]+)/), leaders,
    milestonesHeading: 'Company Milestones',
    milestonesIntro: match(value, /Center body: (Since 1997[^\n]+)/), milestones,
    seo: { title: 'About Us', description: 'Learn about IT Usaha Engineering, our leadership and milestones since 1997.' },
  }
}

export function parseContact(value: string) {
  return {
    headline: match(value, /Left align header: (.+)/), companyName: match(value, /Left side header: (.+)/),
    companyNumber: match(value, /Left side body: (Company No\.: .+)/),
    formTitle: match(value, /- Form title: (.+)/), formDescription: match(value, /- Form description: (.+)/),
    seo: { title: 'Contact Us', description: 'Discuss your data centre or critical system project with IT Usaha Engineering.' },
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
      if (content.length > 1) return { title, intro: content[0].trim(), items: content.slice(1).map((text) => ({ text: text.trim() })) }
      return { title, body: (content[0] ?? '').trim() }
    }),
    seo: { title: heading.trim(), description: `${heading.trim()} for the IT Usaha Engineering website.` },
  }
}

// A simple page heading with no CMS-authored "Span highlighted text" line (unlike about-us) —
// accent the last word, same visual treatment, no extra template instruction needed.
function lastWordHighlight(heading: string) {
  return heading.split(' ').at(-1) ?? heading
}

export function parseEventsPage(value: string) {
  const heading = match(value, /^Left align header: (.+)$/m)
  return { heading, highlight: lastWordHighlight(heading), seo: { title: 'Events', description: "See what's happening at IT Usaha Engineering." } }
}

export function parseProjectsPage(value: string) {
  const heading = match(value, /^Left align header: (.+)$/m)
  return { heading, highlight: lastWordHighlight(heading), seo: { title: 'Projects', description: 'Data centres and MEP projects delivered by IT Usaha Engineering.' } }
}

// Splits one vacancy's body into sections. A paragraph (blank-line separated) either opens
// with a heading line followed by a "Label:" line (e.g. "Administration\nResponsibilities:"),
// or opens directly with the "Label:" line. Within its body, a line ending in ":" (e.g. the
// Internship's "Design & Build for Data Centre include of:") is the section's intro, not a
// bullet item.
function parseVacancySections(body: string) {
  return body.split(/\n\s*\n/).map((block) => {
    const lines = block.trim().split('\n').map((line) => line.trim()).filter(Boolean)
    const hasHeading = lines.length > 1 && lines[1].endsWith(':') && !lines[0].endsWith(':')
    const heading = hasHeading ? lines[0] : undefined
    const label = (hasHeading ? lines[1] : lines[0]).replace(/:$/, '')
    const rest = lines.slice(hasHeading ? 2 : 1)
    const hasIntro = rest.length > 0 && rest[0].endsWith(':')
    return { heading, label, intro: hasIntro ? rest[0] : undefined, items: (hasIntro ? rest.slice(1) : rest).map((text) => ({ text })) }
  })
}

export function parseCareer(value: string) {
  const heading = match(value, /^Left align header: (.+)$/m)
  const vacancyBlock = match(value, /Accordian:\n([\s\S]+?)\n\nLeft side header: Apply Now/)
  const vacancies = vacancyBlock.split(/\n(?=\d+\. )/).map((chunk) => {
    const [, order, title, body] = chunk.match(/^(\d+)\. (.+?)\n\n([\s\S]+)$/) ?? []
    if (!title) throw new Error(`Career template vacancy did not parse: ${chunk.slice(0, 40)}`)
    return {
      title: title.trim(), order: Number(order),
      key: title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      open: true, sections: parseVacancySections(body),
    }
  })
  if (vacancies.length !== 7) throw new Error('Career template vacancy count changed')
  return {
    heading, highlight: lastWordHighlight(heading),
    applyHeading: match(value, /Left side header: (Apply Now)/),
    applyBody: match(value, /Left side body: (.+)/),
    seo: { title: 'Career', description: 'Explore open positions at IT Usaha Engineering.' },
    vacancies,
  }
}

// The one real project the plan asks to seed, with valid Lexical content (a level-2 heading,
// a paragraph and a bullet list) — see the plan's "Seed valid Lexical content" section.
export const tmNxeraProject = {
  title: 'TM Nxera, Johor', slug: 'tm-nxera-johor', status: 'ongoing' as const, order: 0,
  client: 'ST Dynamo DC Sdn Bhd', consultants: [{ name: 'Squire Mech Pte Ltd' }],
  scope: 'Mechanical & Electrical System',
  commencementDate: '2025-09-01T00:00:00.000Z', completionDate: '2026-09-01T00:00:00.000Z',
  published: true,
  body: {
    root: {
      type: 'root', format: '' as const, indent: 0, direction: 'ltr' as const, version: 1,
      children: [
        { type: 'heading', tag: 'h2', format: '', indent: 0, direction: 'ltr', version: 1,
          children: [{ type: 'text', format: 0, detail: 0, mode: 'normal', style: '', text: 'Block 1', version: 1 }] },
        { type: 'paragraph', format: '', indent: 0, direction: 'ltr', version: 1,
          children: [{ type: 'text', format: 0, detail: 0, mode: 'normal', style: '', text: 'To supply & install, testing commissioning & maintenance of mechanical and electrical system to DC fit out works', version: 1 }] },
        { type: 'list', tag: 'ul', listType: 'bullet', start: 1, format: '', indent: 0, direction: 'ltr', version: 1,
          children: [{ type: 'listitem', value: 1, format: '', indent: 0, direction: 'ltr', version: 1,
            children: [{ type: 'text', format: 0, detail: 0, mode: 'normal', style: '', text: 'IT Load Capacity: 16MW', version: 1 }] }] },
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
}

async function main() {
  if (process.argv.includes('--write-defaults')) {
    // Vacancies are seeded as their own collection documents, not part of the career-page
    // global — keep them out of the page-defaults fallback file.
    const { heading, highlight, applyHeading, applyBody, seo } = defaults.careerPage
    const careerPage = { heading, highlight, applyHeading, applyBody, seo }
    writeFileSync(path.join(root, 'src/lib/page-defaults.json'), `${JSON.stringify({ ...defaults, careerPage }, null, 2)}\n`)
    return
  }
  const { getPayloadClient } = await import('../lib/payload')
  const payload = await getPayloadClient()
  const entries = [
    ['about-us', defaults.aboutUs, 'headline'], ['contact-us', defaults.contactUs, 'headline'],
    ['privacy-policy', defaults.privacyPolicy, 'heading'], ['terms-and-conditions', defaults.termsAndConditions, 'heading'],
    ['events-page', defaults.eventsPage, 'heading'], ['projects-page', defaults.projectsPage, 'heading'],
    ['career-page', defaults.careerPage, 'heading'],
  ] as const
  for (const [slug, data, marker] of entries) {
    const saved = await payload.findGlobal({ slug })
    if ((marker === 'headline' && 'headline' in saved && saved.headline) || (marker === 'heading' && 'heading' in saved && saved.heading)) {
      console.log(`Skipped ${slug}: already populated.`); continue
    }
    await payload.updateGlobal({ slug, data })
    console.log(`Seeded ${slug}.`)
  }

  for (const vacancy of defaults.careerPage.vacancies) {
    const existing = await payload.find({ collection: 'vacancies', where: { key: { equals: vacancy.key } }, limit: 1 })
    if (existing.docs.length > 0) { console.log(`Skipped vacancy ${vacancy.key}: already exists.`); continue }
    await payload.create({ collection: 'vacancies', data: vacancy })
    console.log(`Seeded vacancy ${vacancy.key}.`)
  }

  const existingProject = await payload.find({ collection: 'projects', where: { slug: { equals: tmNxeraProject.slug } }, limit: 1 })
  if (existingProject.docs.length > 0) console.log(`Skipped project ${tmNxeraProject.slug}: already exists.`)
  else { await payload.create({ collection: 'projects', data: tmNxeraProject }); console.log(`Seeded project ${tmNxeraProject.slug}.`) }

  process.exit(0)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error); process.exit(1) })
}
