'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { HONEYPOT_FIELD } from '@/lib/validation'
import type { JobPosition } from '@/payload-types'

export function ApplicationForm({ positions }: { positions: JobPosition[] }) {
  const router = useRouter()
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setFormError(null)
    setErrors({})

    const res = await fetch('/api/apply/', { method: 'POST', body: new FormData(e.currentTarget) })
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

      <div>
        <label htmlFor="applicantName" className="mb-1 block text-small font-semibold text-primary">
          Name <span className="text-accent">*</span>
        </label>
        <input id="applicantName" name="applicantName" required className="w-full rounded-md border border-surface-alt px-4 py-3 text-body focus:border-accent focus:outline-none" />
        {errors.applicantName && <p className="mt-1 text-small text-red-600">{errors.applicantName[0]}</p>}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-small font-semibold text-primary">
          Email <span className="text-accent">*</span>
        </label>
        <input id="email" name="email" type="email" required className="w-full rounded-md border border-surface-alt px-4 py-3 text-body focus:border-accent focus:outline-none" />
        {errors.email && <p className="mt-1 text-small text-red-600">{errors.email[0]}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-small font-semibold text-primary">
          Phone
        </label>
        <input id="phone" name="phone" type="tel" className="w-full rounded-md border border-surface-alt px-4 py-3 text-body focus:border-accent focus:outline-none" />
      </div>

      <div>
        <label htmlFor="position" className="mb-1 block text-small font-semibold text-primary">
          Position <span className="text-accent">*</span>
        </label>
        <select id="position" name="position" required className="w-full rounded-md border border-surface-alt px-4 py-3 text-body focus:border-accent focus:outline-none">
          <option value="">Select a position</option>
          {positions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
              {p.location ? ` — ${p.location}` : ''}
            </option>
          ))}
        </select>
        {errors.position && <p className="mt-1 text-small text-red-600">{errors.position[0]}</p>}
      </div>

      <div>
        <label htmlFor="coverMessage" className="mb-1 block text-small font-semibold text-primary">
          Cover Message
        </label>
        <textarea id="coverMessage" name="coverMessage" rows={4} className="w-full rounded-md border border-surface-alt px-4 py-3 text-body focus:border-accent focus:outline-none" />
      </div>

      <div>
        <label htmlFor="cv" className="mb-1 block text-small font-semibold text-primary">
          CV (PDF or Word, max 5MB) <span className="text-accent">*</span>
        </label>
        <input id="cv" name="cv" type="file" accept=".pdf,.doc,.docx" required className="w-full text-body" />
        {errors.cv && <p className="mt-1 text-small text-red-600">{errors.cv[0]}</p>}
      </div>

      <label className="flex items-start gap-2 text-small text-text/80">
        <input type="checkbox" name="consent" required className="mt-1" />
        I consent to IT Usaha Engineering storing my details and CV to process this application.
      </label>
      {errors.consent && <p className="text-small text-red-600">{errors.consent[0]}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-small font-semibold text-white hover:bg-accent-dark disabled:opacity-60"
      >
        {submitting ? 'Submitting…' : 'Submit Application'}
      </button>
    </form>
  )
}
