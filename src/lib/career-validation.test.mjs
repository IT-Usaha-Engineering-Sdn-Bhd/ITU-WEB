import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { isPdf, validateApplication } from './career-validation.ts'

const valid = { name: 'Ada', email: 'ada@example.com', phone: '+60 12345', vacancy: 'account-executive', introduction: 'I would love to join.' }

test('accepts and trims a valid application', () => {
  assert.deepEqual(validateApplication({ ...valid, name: ' Ada ' }), { ok: true, data: valid })
})

test('rejects missing required fields and invalid email', () => {
  assert.equal(validateApplication({ ...valid, name: ' ' }).ok, false)
  assert.equal(validateApplication({ ...valid, email: 'nope' }).ok, false)
  assert.equal(validateApplication({ ...valid, introduction: ' ' }).ok, false)
})

test('rejects oversized and unexpected values', () => {
  assert.equal(validateApplication({ ...valid, introduction: 'a'.repeat(2001) }).ok, false)
  assert.equal(validateApplication({ ...valid, name: ['Ada'] }).ok, false)
  assert.equal(validateApplication({ ...valid, role: 'admin' }).ok, false)
})

const pdfBytes = new TextEncoder().encode('%PDF-1.4\n...')
const pngBytes = new TextEncoder().encode('\x89PNG\r\n...')

test('isPdf checks extension, mimetype, signature and size', () => {
  assert.equal(isPdf({ name: 'resume.pdf', type: 'application/pdf', size: pdfBytes.length }, pdfBytes), true)
  assert.equal(isPdf({ name: 'resume.png', type: 'application/pdf', size: pdfBytes.length }, pdfBytes), false)
  assert.equal(isPdf({ name: 'resume.pdf', type: 'image/png', size: pdfBytes.length }, pdfBytes), false)
  // Disguised file: .pdf name and application/pdf mimetype, but PNG bytes.
  assert.equal(isPdf({ name: 'resume.pdf', type: 'application/pdf', size: pngBytes.length }, pngBytes), false)
  assert.equal(isPdf({ name: 'resume.pdf', type: 'application/pdf', size: 6 * 1024 * 1024 }, pdfBytes), false)
})
