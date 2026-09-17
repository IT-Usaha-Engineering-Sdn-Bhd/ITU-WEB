'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { HONEYPOT_FIELD } from '@/lib/validation'

export function ContactForm() {
  const router = useRouter()
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setFormError(null)
    setErrors({})

    const res = await fetch('/api/contact/', { method: 'POST', body: new FormData(e.currentTarget) })
    const data = await res.json()

    if (res.ok) {
      router.push('/thank-you/')
      return
    }
    setErrors(data.fieldErrors ?? {})
    setFormError(data.error ?? 'Something went wrong. Please try again.')
    setSubmitting(false)
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {formError && (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-small text-red-700">
          {formError}
        </p>
      )}

      <Field label="Name" name="name" required error={errors.name} />
      <Field label="Business Email" name="email" type="email" required error={errors.email} />
      <Field label="Phone" name="phone" type="tel" error={errors.phone} />
      <Field label="Company" name="company" error={errors.company} />
      <Field label="Service / Project Interest" name="interest" error={errors.interest} />

      <div>
        <label htmlFor="message" className="mb-1 block text-small font-semibold text-primary">
          Message <span className="text-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className="w-full rounded-md border border-surface-alt px-4 py-3 text-body focus:border-accent focus:outline-none"
        />
        {errors.message && (
          <p id="message-error" className="mt-1 text-small text-red-600">
            {errors.message[0]}
          </p>
        )}
      </div>

      <label className="flex items-start gap-2 text-small text-text/80">
        <input type="checkbox" name="consent" required className="mt-1" />
        I consent to IT Usaha Engineering storing my details to respond to this enquiry.
      </label>
      {errors.consent && <p className="text-small text-red-600">{errors.consent[0]}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-small font-semibold text-white hover:bg-accent-dark disabled:opacity-60"
      >
        {submitting ? 'Submitting…' : 'Submit Now'}
      </button>
    </form>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  error,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  error?: string[]
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-small font-semibold text-primary">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className="w-full rounded-md border border-surface-alt px-4 py-3 text-body focus:border-accent focus:outline-none"
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-small text-red-600">
          {error[0]}
        </p>
      )}
    </div>
  )
}
