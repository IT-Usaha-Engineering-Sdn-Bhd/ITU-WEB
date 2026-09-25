'use client'
import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'

type Labels = {
  nameLabel: string
  emailLabel: string
  phoneLabel: string
  companyNameLabel: string
  companyAddressLabel: string
  messageLabel: string
  privacyLine: string
  successMessage: string
  errorFallback: string
  submitLabel: string
  submittingLabel: string
}

export function ContactForm({
  eyebrow,
  title,
  description,
  labels,
}: {
  eyebrow: string
  title: string
  description: string
  labels: Labels
}) {
  const fields = [
    { name: 'name', label: labels.nameLabel, required: true, maxLength: 120 },
    { name: 'email', label: labels.emailLabel, required: true, maxLength: 254, type: 'email' },
    { name: 'phone', label: labels.phoneLabel, required: true, maxLength: 40, type: 'tel' },
    { name: 'companyName', label: labels.companyNameLabel, required: false, maxLength: 200 },
  ] as const
  const [state, setState] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state === 'pending') return
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form).entries())
    setState('pending')
    setError('')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || labels.errorFallback)
      form.reset()
      setState('success')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : labels.errorFallback)
      setState('error')
    }
  }
  return (
    <div className="contact-form-panel">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p className="section-body">{description}</p>
      <form
        onSubmit={submit}
        aria-busy={state === 'pending'}
        onInvalidCapture={(event) => {
          const field = event.target as HTMLInputElement | HTMLTextAreaElement
          setFieldErrors((previous) => ({ ...previous, [field.name]: field.validationMessage }))
        }}
        onInput={(event) => {
          const field = event.target as HTMLInputElement | HTMLTextAreaElement
          if (field.validity.valid)
            setFieldErrors((previous) => ({ ...previous, [field.name]: '' }))
        }}
      >
        <div className="form-two-col">
          {fields.map((field) => (
            <label key={field.name}>
              {field.label}
              {field.required && <span aria-hidden="true"> *</span>}
              <input
                name={field.name}
                type={'type' in field ? field.type : 'text'}
                maxLength={field.maxLength}
                required={field.required}
                aria-invalid={Boolean(fieldErrors[field.name])}
                aria-describedby={
                  fieldErrors[field.name] ? `contact-error-${field.name}` : undefined
                }
                autoComplete={
                  field.name === 'name'
                    ? 'name'
                    : field.name === 'email'
                      ? 'email'
                      : field.name === 'phone'
                        ? 'tel'
                        : 'organization'
                }
              />
              {fieldErrors[field.name] && (
                <span className="field-error" id={`contact-error-${field.name}`}>
                  {fieldErrors[field.name]}
                </span>
              )}
            </label>
          ))}
        </div>
        <label>
          {labels.companyAddressLabel}
          <textarea name="companyAddress" maxLength={1000} rows={2} autoComplete="street-address" />
        </label>
        <label>
          {labels.messageLabel} <span aria-hidden="true">*</span>
          <textarea
            name="message"
            maxLength={5000}
            rows={5}
            required
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={fieldErrors.message ? 'contact-error-message' : undefined}
          />
          {fieldErrors.message && (
            <span className="field-error" id="contact-error-message">
              {fieldErrors.message}
            </span>
          )}
        </label>
        <div className="form-trap" aria-hidden="true">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <p className="form-privacy">
          {labels.privacyLine} <Link href="/privacy-policy">Privacy Policy</Link>.
        </p>
        {state === 'success' && (
          <p role="status" className="form-success">
            {labels.successMessage}
          </p>
        )}
        {state === 'error' && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <button className="button button-accent" type="submit" disabled={state === 'pending'}>
          {state === 'pending' ? labels.submittingLabel : labels.submitLabel}
          <ArrowUpRight size={18} />
        </button>
      </form>
    </div>
  )
}
