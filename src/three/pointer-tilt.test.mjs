import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createTiltState, stepTilt, resetTilt } from './pointer-tilt.ts'

test('pointer axes drive pitch and yaw with bounded delta and damping', () => {
  const state = createTiltState()
  stepTilt(state, { x: 1, y: -1 }, { x: 0.03, y: 0.09 }, 1)
  assert.ok(Math.abs(state.rotation.x - -0.0006133333333333333) < 1e-12)
  assert.ok(Math.abs(state.rotation.y - 0.00184) < 1e-12)
  const other = createTiltState()
  stepTilt(other, { x: 1, y: -1 }, { x: 0.03, y: 0.09 }, 1 / 30)
  assert.deepEqual(state, other)
})

test('tilt settles and reset clears both velocity and displacement', () => {
  const state = createTiltState()
  let settled = false
  for (let i = 0; i < 600; i++)
    settled = stepTilt(state, { x: 1, y: 1 }, { x: 0.03, y: 0.09 }, 1 / 60)
  assert.equal(settled, true)
  assert.ok(Math.abs(state.rotation.y - 0.09) < 0.0001)
  resetTilt(state)
  assert.deepEqual(state, { rotation: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } })
  assert.equal(stepTilt(state, { x: 0, y: 0 }, { x: 0.03, y: 0.09 }, 1 / 60), true)
})
