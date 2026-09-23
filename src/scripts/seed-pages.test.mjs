import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { defaults, tmNxeraProject } from './seed-pages.ts'

test('About seed includes all leaders and milestones', () => {
  assert.equal(defaults.aboutUs.leaders.length, 3)
  assert.equal(defaults.aboutUs.milestones.length, 14)
  assert.equal(defaults.aboutUs.milestones[13].year, 'Today and Beyond')
})

test('policy sections keep headings separate from paragraphs and lists', () => {
  assert.equal(defaults.privacyPolicy.sections.length, 6)
  assert.equal(defaults.privacyPolicy.sections[0].title, 'Information We Collect')
  assert.equal(defaults.privacyPolicy.sections[0].intro, 'We may collect:')
  assert.equal(defaults.privacyPolicy.sections[0].items?.length, 2)
  assert.equal(defaults.termsAndConditions.sections.length, 7)
  assert.equal(defaults.termsAndConditions.sections[3].items?.length, 4)
})

test('career seed produces all seven vacancies with stable keys and order', () => {
  assert.equal(defaults.careerPage.vacancies.length, 7)
  assert.equal(defaults.careerPage.vacancies[0].key, 'project-engineer-mechanical-electrical')
  assert.equal(defaults.careerPage.vacancies[1].key, 'hr-admin-executive')
  assert.deepEqual(defaults.careerPage.vacancies.map((v) => v.order), [1, 2, 3, 4, 5, 6, 7])
})

test('HR & Admin Executive keeps Human Resources and Administration as separate headed subsections', () => {
  const sections = defaults.careerPage.vacancies[1].sections
  assert.equal(sections.length, 3)
  assert.equal(sections[0].heading, 'Human Resources')
  assert.equal(sections[0].label, 'Responsibilities')
  assert.equal(sections[1].heading, 'Administration')
  assert.equal(sections[1].label, 'Responsibilities')
  assert.equal(sections[2].heading, undefined)
  assert.equal(sections[2].label, 'Requirement')
})

test('Internship responsibilities keep their intro line separate from the bullet items', () => {
  const sections = defaults.careerPage.vacancies[6].sections
  assert.equal(sections[0].label, 'Responsibilities')
  assert.equal(sections[0].intro, 'Design & Build for Data Centre include of:')
  assert.equal(sections[0].items.length, 8)
})

test('TM Nxera seed has valid Lexical content (heading, paragraph, bullet list)', () => {
  const [heading, paragraph, list] = tmNxeraProject.body.root.children
  assert.equal(heading.type, 'heading')
  assert.equal(heading.tag, 'h2')
  assert.equal(heading.children[0].text, 'Block 1')
  assert.equal(paragraph.type, 'paragraph')
  assert.match(paragraph.children[0].text, /DC fit out works$/)
  assert.equal(list.type, 'list')
  assert.equal(list.children[0].children[0].text, 'IT Load Capacity: 16MW')
  assert.equal(tmNxeraProject.status, 'ongoing')
  assert.equal(tmNxeraProject.completionDate, '2026-09-01T00:00:00.000Z')
})
