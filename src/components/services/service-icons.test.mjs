import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { getServiceIconMedia } from './service-icons.ts'

test('service icon media resolves to its uploaded image as decorative content', () => {
  const image = { url: '/media/bolt.svg', alt: 'Bolt icon' }

  assert.deepEqual(getServiceIconMedia(image), {
    src: '/media/bolt.svg',
    alt: '',
  })
})

test('service icon media falls back when an upload is missing or only has an ID', () => {
  assert.equal(getServiceIconMedia(null), null)
  assert.equal(getServiceIconMedia(42), null)
  assert.equal(getServiceIconMedia({ alt: 'No URL yet' }), null)
})
