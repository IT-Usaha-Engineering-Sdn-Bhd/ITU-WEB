import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { createSoundController } from './sound-controller.ts'

test('initialization and unrelated interaction stay silent until Commission', () => {
  let starts = 0
  const sound = createSoundController(null, {
    start: () => starts++,
    stop: () => {},
    save: () => {},
  })
  assert.equal(sound.muted(), true)
  assert.equal(starts, 0)
  sound.commission()
  assert.equal(sound.muted(), false)
  assert.equal(starts, 1)
})
test('stored off survives Commission and enabled sound pauses in background', () => {
  let starts = 0,
    stops = 0,
    stored = 'off'
  const sound = createSoundController(stored, {
    start: () => starts++,
    stop: () => stops++,
    save: (value) => (stored = value),
  })
  sound.commission()
  assert.equal(starts, 0)
  assert.equal(sound.muted(), true)
  sound.setMuted(false)
  assert.equal(starts, 1)
  assert.equal(stored, 'on')
  sound.visibility(true)
  assert.equal(stops, 1)
  sound.visibility(false)
  assert.equal(starts, 2)
  sound.setMuted(true)
  sound.visibility(false)
  assert.equal(starts, 2)
  assert.equal(stored, 'off')
})
test('blocked playback never prevents entry and can be retried', () => {
  let starts = 0
  const sound = createSoundController(null, {
    start: () => {
      starts++
      throw Error('blocked')
    },
    stop: () => {},
    save: () => {},
  })
  assert.doesNotThrow(() => sound.commission())
  sound.setMuted(false)
  assert.equal(starts, 2)
})

test('stored on remains effectively silent until one deliberate activation', () => {
  let starts = 0
  const sound = createSoundController('on', {
    start: () => starts++,
    stop: () => {},
    save: () => {},
  })
  assert.equal(sound.muted(), true)
  sound.setMuted(!sound.muted())
  assert.equal(starts, 1)
  assert.equal(sound.muted(), false)
})

test('playback failure exposes retry without replacing the saved on preference', () => {
  let stored = 'on'
  let starts = 0
  const sound = createSoundController(stored, {
    start: () => starts++,
    stop: () => {},
    save: (value) => {
      stored = value
    },
  })
  sound.commission()
  sound.playbackFailed()
  assert.equal(sound.muted(), true)
  assert.equal(stored, 'on')
  sound.commission()
  assert.equal(starts, 2)
  assert.equal(sound.muted(), false)
})
