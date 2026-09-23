'use client'
import Link from 'next/link'
import { useState, type FormEvent } from 'react'
import { ArrowUpRight } from '@phosphor-icons/react'

const fields = [
  { name: 'name', label: 'Name', required: true, maxLength: 120 },
  { name: 'email', label: 'Email Address', required: true, maxLength: 254, type: 'email' },
  { name: 'phone', label: 'Contact No.', required: true, maxLength: 40, type: 'tel' },
  { name: 'companyName', label: 'Company Name', required: false, maxLength: 200 },
] as const

export function ContactForm({ title, description }: { title: string; description: string }) {
  const [state, setState] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
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
      if (!response.ok)
        throw new Error(result.error || 'Your message could not be sent. Please try again.')
      form.reset()
      setState('success')
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Your message could not be sent. Please try again.',
      )
      setState('error')
    }
  }
  return (
    <div className="contact-form-panel">
      <p className="eyebrow">Start a conversation</p>
      <h2>{title}</h2>
      <p className="section-body">{description}</p>
      <form onSubmit={submit} aria-busy={state === 'pending'}>
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
            </label>
          ))}
        </div>
        <label>
          Company Address
          <textarea name="companyAddress" maxLength={1000} rows={2} autoComplete="street-address" />
        </label>
        <label>
          Message <span aria-hidden="true">*</span>
          <textarea name="message" maxLength={5000} rows={5} required />
        </label>
        <div className="form-trap" aria-hidden="true">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <p className="form-privacy">
          Your details are handled according to our{' '}
          <Link href="/privacy-policy">Privacy Policy</Link>.
        </p>
        {state === 'success' && (
          <p role="status" className="form-success">
            Thank you. Your enquiry has been received.
          </p>
        )}
        {state === 'error' && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <button className="button button-accent" type="submit" disabled={state === 'pending'}>
          {state === 'pending' ? 'Submitting…' : 'Submit Now'}
          <ArrowUpRight size={18} />
        </button>
      </form>
    </div>
  )
}
