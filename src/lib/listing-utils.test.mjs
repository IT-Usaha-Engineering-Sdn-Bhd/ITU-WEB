import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import {
  consultantLabel,
  dateRange,
  formatMonthYear,
  parseCategory,
  parsePage,
  parseStatus,
  youtubeEmbedUrl,
  youtubeId,
} from './listing-utils.ts'

test('parseCategory falls back to the first category for anything invalid', () => {
  assert.equal(parseCategory('annual-dinner'), 'annual-dinner')
  assert.equal(parseCategory('not-a-category'), 'company-award-ceremony')
  assert.equal(parseCategory(undefined), 'company-award-ceremony')
})

test('parseStatus only accepts ongoing, else completed', () => {
  assert.equal(parseStatus('ongoing'), 'ongoing')
  assert.equal(parseStatus('completed'), 'completed')
  assert.equal(parseStatus('bogus'), 'completed')
  assert.equal(parseStatus(undefined), 'completed')
})

test('parsePage rejects non-positive-integers', () => {
  assert.equal(parsePage('3'), 3)
  assert.equal(parsePage('0'), 1)
  assert.equal(parsePage('-1'), 1)
  assert.equal(parsePage('abc'), 1)
  assert.equal(parsePage(undefined), 1)
})

test('youtubeId handles watch, youtu.be, embed and shorts URLs', () => {
  assert.equal(youtubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), 'dQw4w9WgXcQ')
  assert.equal(youtubeId('https://youtu.be/dQw4w9WgXcQ'), 'dQw4w9WgXcQ')
  assert.equal(youtubeId('https://www.youtube.com/embed/dQw4w9WgXcQ'), 'dQw4w9WgXcQ')
  assert.equal(youtubeId('https://www.youtube.com/shorts/dQw4w9WgXcQ'), 'dQw4w9WgXcQ')
  assert.equal(youtubeId('not a url'), null)
  assert.equal(youtubeId('https://example.com/watch?v=dQw4w9WgXcQ'), null)
  assert.equal(youtubeId('https://youtu.be/short'), null)
  assert.equal(youtubeId(null), null)
})

test('youtubeEmbedUrl uses the privacy-enhanced domain', () => {
  assert.equal(
    youtubeEmbedUrl('https://youtu.be/dQw4w9WgXcQ'),
    'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
  )
  assert.equal(youtubeEmbedUrl(null), null)
})

test('formatMonthYear formats short and long in UTC', () => {
  assert.equal(formatMonthYear('2025-09-01T00:00:00.000Z', 'short'), 'Sept 2025')
  assert.equal(formatMonthYear('2025-09-01T00:00:00.000Z', 'long'), 'September 2025')
  assert.equal(formatMonthYear(null), '')
})

test('dateRange shows Present for ongoing projects with no completion date', () => {
  assert.equal(
    dateRange('ongoing', '2025-09-01T00:00:00.000Z', '2026-09-01T00:00:00.000Z'),
    'Sept 2025 – Sept 2026',
  )
  assert.equal(dateRange('ongoing', '2025-09-01T00:00:00.000Z', null), 'Sept 2025 – Present')
  assert.equal(dateRange('completed', '2025-09-01T00:00:00.000Z', null), 'Sept 2025')
})

test('consultantLabel pluralizes only for more than one', () => {
  assert.equal(consultantLabel(0), 'Data Center Consultant')
  assert.equal(consultantLabel(1), 'Data Center Consultant')
  assert.equal(consultantLabel(2), 'Data Center Consultants')
})
