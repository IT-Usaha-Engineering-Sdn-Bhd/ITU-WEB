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

export const defaults = {
  aboutUs: parseAbout(source('about-us.md')),
  contactUs: parseContact(source('contact-us.md')),
  privacyPolicy: parsePolicy(source('privacypolicy.md')),
  termsAndConditions: parsePolicy(source('tnc.md')),
}

async function main() {
  if (process.argv.includes('--write-defaults')) {
    writeFileSync(path.join(root, 'src/lib/page-defaults.json'), `${JSON.stringify(defaults, null, 2)}\n`)
    return
  }
  const { getPayloadClient } = await import('../lib/payload')
  const payload = await getPayloadClient()
  const entries = [
    ['about-us', defaults.aboutUs, 'headline'], ['contact-us', defaults.contactUs, 'headline'],
    ['privacy-policy', defaults.privacyPolicy, 'heading'], ['terms-and-conditions', defaults.termsAndConditions, 'heading'],
  ] as const
  for (const [slug, data, marker] of entries) {
    const saved = await payload.findGlobal({ slug })
    if ((marker === 'headline' && 'headline' in saved && saved.headline) || (marker === 'heading' && 'heading' in saved && saved.heading)) {
      console.log(`Skipped ${slug}: already populated.`); continue
    }
    await payload.updateGlobal({ slug, data })
    console.log(`Seeded ${slug}.`)
  }
  process.exit(0)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error); process.exit(1) })
}
