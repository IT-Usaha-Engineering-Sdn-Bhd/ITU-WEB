import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { defaults } from './seed-pages.ts'

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
