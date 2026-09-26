import { test } from 'node:test'
import assert from 'node:assert/strict'
import { runInNewContext } from 'node:vm'
import { themeInitializer, applyTheme, initializeTheme } from './theme.ts'

test('pre-paint initializer accepts only saved light/dark and defaults light', () => {
  for (const [saved, expected] of [
    [null, 'light'],
    ['dark', 'dark'],
    ['light', 'light'],
    ['auto', 'light'],
    ['DARK', 'light'],
  ]) {
    const document = { documentElement: { dataset: {} } }
    runInNewContext(themeInitializer, { document, localStorage: { getItem: () => saved } })
    assert.equal(document.documentElement.dataset.mode, expected)
  }
})

test('blocked storage does not prevent initialization or changing theme', () => {
  const document = { documentElement: { dataset: {} } }
  runInNewContext(themeInitializer, {
    document,
    get localStorage() {
      throw Error('blocked')
    },
  })
  assert.equal(document.documentElement.dataset.mode, 'light')
  applyTheme('dark', document.documentElement, () => {
    throw Error('blocked')
  })
  assert.equal(document.documentElement.dataset.mode, 'dark')
})

test('theme change updates the document and persists the same mode', () => {
  const root = { dataset: {} }
  const writes = []
  applyTheme('dark', root, () => ({ setItem: (...args) => writes.push(args) }))
  assert.equal(root.dataset.mode, 'dark')
  assert.deepEqual(writes, [['itu:theme', 'dark']])
})

test('client-rendered error fallback initializes saved theme without replacing a live choice', () => {
  const root = { dataset: {} }
  initializeTheme(root, () => ({ getItem: () => 'dark' }))
  assert.equal(root.dataset.mode, 'dark')
  initializeTheme(root, () => ({ getItem: () => 'light' }))
  assert.equal(root.dataset.mode, 'dark')
  const blocked = { dataset: {} }
  initializeTheme(blocked, () => {
    throw Error('blocked')
  })
  assert.equal(blocked.dataset.mode, 'light')
})
