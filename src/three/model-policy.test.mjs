import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { selectQuality, devicePolicy } from './model-policy.ts'

test('missing capability APIs still allow standard 3D', () => {
  assert.equal(selectQuality({ width: 390 }), 'standard')
  assert.equal(selectQuality({ width: 1440 }), 'high')
})
test('each constraint starts with a poster', () => {
  for (const signal of [{ saveData: true }, { effectiveType: '2g' }, { cores: 4 }, { memory: 4 }]) {
    assert.equal(selectQuality({ width: 1440, ...signal }), 'constrained')
  }
})

test('browser connection prototype accessors activate poster-first policy', () => {
  const previousNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  const previousWindow = globalThis.window
  try {
    const connection = Object.create({
      get saveData() {
        return true
      },
      get effectiveType() {
        return '4g'
      },
    })
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { hardwareConcurrency: 16, deviceMemory: 16, connection },
    })
    globalThis.window = { innerWidth: 1440 }
    assert.equal(devicePolicy(), 'constrained')
  } finally {
    if (previousNavigator) Object.defineProperty(globalThis, 'navigator', previousNavigator)
    globalThis.window = previousWindow
  }
})
