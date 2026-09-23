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
  assert.deepEqual(
    defaults.careerPage.vacancies.map((v) => v.order),
    [1, 2, 3, 4, 5, 6, 7],
  )
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

test('Data Centre seed covers the critical infrastructure bullets and both "why choose us" cards', () => {
  assert.equal(defaults.serviceDataCentre.critical.items.length, 4)
  assert.equal(defaults.serviceDataCentre.why.length, 2)
  assert.equal(defaults.serviceDataCentre.testing.equipment.length, 0)
  assert.match(defaults.serviceDataCentre.intro, /has completed many Data Centre projects/)
})

test('High Tension seed covers all eight service sections with their bullet counts', () => {
  const data = defaults.serviceHighTension
  assert.equal(data.power.length, 3)
  assert.equal(data.backup.length, 2)
  assert.equal(data.protection.length, 3)
  assert.deepEqual(
    data.power.map((s) => s.items.length),
    [4, 4, 4],
  )
  assert.deepEqual(
    data.backup.map((s) => s.items.length),
    [4, 5],
  )
  assert.equal(data.protection[2].items.length, 4)
  assert.equal(
    data.protection[2].note,
    'Our lightning protection systems are designed with reliability and compliance to international standards, including:',
  )
  assert.equal(data.protection[1].title, 'Fire Protection System')
})

test('Project Management seed keeps all twelve PMC services', () => {
  assert.equal(defaults.serviceProjectManagement.services.length, 12)
  assert.equal(
    defaults.serviceProjectManagement.services[0].title,
    'Preliminary Planning & Due Diligence',
  )
})

test('Facilities Management seed keeps six support and five maintenance items', () => {
  assert.equal(defaults.serviceFacilitiesManagement.support.items.length, 6)
  assert.equal(defaults.serviceFacilitiesManagement.maintenance.items.length, 5)
  assert.equal(defaults.serviceFacilitiesManagement.why.length, 2)
  assert.match(defaults.serviceFacilitiesManagement.intro, /data centres — we stay with them/)
})

test('DFMA seed keeps four capabilities, three benefits and two facts, with no template instructions leaking into copy', () => {
  const data = defaults.serviceDfma
  assert.equal(data.capabilities.cards.length, 4)
  assert.equal(data.benefits.items.length, 3)
  assert.equal(data.facts.length, 2)
  assert.equal(data.facts[0].value, '3,654 m²')
  assert.equal(data.visual.title, 'Modular Assembly')
  const json = JSON.stringify(data)
  assert.doesNotMatch(json, /Hero banner image|Include a simple diagram|Grid card with icons/)
})

test('service page defaults leave every media field empty', () => {
  const services = [
    defaults.serviceDataCentre,
    defaults.serviceHighTension,
    defaults.serviceProjectManagement,
    defaults.serviceFacilitiesManagement,
    defaults.serviceDfma,
  ]
  for (const service of services)
    assert.doesNotMatch(JSON.stringify(service), /"image":|"heroImage":|"ogImage":/)
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
