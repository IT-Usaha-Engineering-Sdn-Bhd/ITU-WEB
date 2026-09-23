import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { sectionDestination } from './section-scroll.ts'

test('one forward gesture advances to the next section', () => {
  assert.equal(
    sectionDestination(
      [
        { top: 0, bottom: 800 },
        { top: 800, bottom: 1600 },
      ],
      1,
      800,
      80,
    ),
    720,
  )
})

test('a tall section remains freely scrollable until its lower edge', () => {
  assert.equal(
    sectionDestination(
      [
        { top: 80, bottom: 1300 },
        { top: 1300, bottom: 2100 },
      ],
      1,
      800,
      80,
    ),
    null,
  )
  assert.equal(
    sectionDestination(
      [
        { top: -420, bottom: 800 },
        { top: 800, bottom: 1600 },
      ],
      1,
      800,
      80,
    ),
    720,
  )
})

test('reverse scroll inside tall content stays native; its top permits a previous step', () => {
  assert.equal(
    sectionDestination(
      [
        { top: -900, bottom: -100 },
        { top: -100, bottom: 1100 },
      ],
      -1,
      800,
      80,
    ),
    null,
  )
  assert.equal(
    sectionDestination(
      [
        { top: -720, bottom: 80 },
        { top: 80, bottom: 1280 },
      ],
      -1,
      800,
      80,
    ),
    -720,
  )
})

test('the footer and page boundaries never trap scrolling', () => {
  assert.equal(sectionDestination([{ top: -900, bottom: -100 }], 1, 800, 80), null)
  assert.equal(sectionDestination([{ top: 80, bottom: 800 }], -1, 800, 80), null)
  assert.equal(sectionDestination([], 1, 800, 80), null)
})

test('scrolling up from the footer, with nothing straddling the inset, re-engages on the nearest tracked section behind', () => {
  assert.equal(
    sectionDestination(
      [
        { top: -1600, bottom: -800 },
        { top: -800, bottom: 0 },
      ],
      -1,
      800,
      80,
    ),
    -800,
  )
})

test('scrolling down with nothing straddling the inset lands on the nearest tracked section ahead', () => {
  assert.equal(
    sectionDestination(
      [
        { top: 800, bottom: 1600 },
        { top: 1600, bottom: 2400 },
      ],
      1,
      800,
      80,
    ),
    720,
  )
})
