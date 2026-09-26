import { test } from 'node:test'
import assert from 'node:assert/strict'
import { renderPolicy } from './render-policy.ts'

test('health downgrade wins over high quality and remains fixed DPR one', () => {
  assert.deepEqual(renderPolicy('high', true, true, 1, false), {
    dpr: 1,
    high: false,
    frameloop: 'always',
  })
  assert.deepEqual(renderPolicy('standard', false, true, 1, false).dpr, [1, 1.5])
  assert.deepEqual(renderPolicy('high', false, true, 1, false).dpr, [1, 2])
})

test('hidden or offscreen takes precedence over motion; reduced motion uses demand', () => {
  assert.equal(renderPolicy('high', false, false, 1, false).frameloop, 'never')
  assert.equal(renderPolicy('high', false, true, 0, true).frameloop, 'never')
  assert.equal(renderPolicy('high', false, true, 1, true).frameloop, 'demand')
})
