import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { splitHighlight } from './heading.ts'

test('highlights only the first match while preserving trailing and repeated text', () => {
  assert.deepEqual(splitHighlight('Our power and power systems', 'power'), [
    'Our ',
    'power',
    ' and power systems',
  ])
})
test('empty or missing highlights leave the full heading intact', () => {
  for (const highlight of ['', 'absent', undefined]) {
    assert.deepEqual(splitHighlight('Complete heading', highlight), ['Complete heading', '', ''])
  }
})
