import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { validateContact } from './contact-validation.ts'

const valid = {
  name: 'Ada',
  email: 'ada@example.com',
  phone: '+60 12345',
  companyName: '',
  companyAddress: '',
  message: 'Please call.',
}

test('accepts and trims a valid enquiry', () => {
  assert.deepEqual(validateContact({ ...valid, name: ' Ada ' }), { ok: true, data: valid })
})

test('rejects missing required fields and invalid email', () => {
  assert.equal(validateContact({ ...valid, name: ' ' }).ok, false)
  assert.equal(validateContact({ ...valid, email: 'nope' }).ok, false)
  assert.equal(validateContact({ ...valid, message: ' ' }).ok, false)
})

test('rejects oversized and unexpected values', () => {
  assert.equal(validateContact({ ...valid, message: 'a'.repeat(5001) }).ok, false)
  assert.equal(validateContact({ ...valid, name: ['Ada'] }).ok, false)
  assert.equal(validateContact({ ...valid, role: 'admin' }).ok, false)
})
