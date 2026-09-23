'use client'
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CaretDown } from '@phosphor-icons/react'
import type { Vacancy } from '@/payload-types'

type Errors = Partial<
  Record<'name' | 'email' | 'phone' | 'vacancy' | 'introduction' | 'resume', string>
>

type Labels = {
  nameLabel: string
  emailLabel: string
  phoneLabel: string
  vacancyLabel: string
  selectPlaceholder: string
  introductionLabel: string
  resumeLabel: string
  closedLabel: string
  applyButtonLabel: string
  noOpeningsMessage: string
  privacyLine: string
  successMessage: string
  errorFallback: string
  submitLabel: string
  submittingLabel: string
  nameRequired: string
  emailInvalid: string
  phoneRequired: string
  vacancyRequired: string
  introductionRequired: string
  resumeRequired: string
  resumeMustBePdf: string
  resumeTooLarge: string
}

function PositionSelect({
  options,
  value,
  onChange,
  describedBy,
  placeholder,
}: {
  options: Vacancy[]
  value: string
  onChange: (key: string) => void
  describedBy?: string
  placeholder: string
}) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const selected = options.find((option) => option.key === value)

  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])

  function pick(key: string) {
    onChange(key)
    setOpen(false)
    trigger.current?.focus()
  }

  function focusOption(index: number) {
    ref.current?.querySelectorAll<HTMLElement>('[role="option"]')[index]?.focus()
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (
      event.key === 'ArrowDown' ||
      event.key === 'ArrowUp' ||
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault()
      setOpen(true)
      const startIndex = Math.max(
        options.findIndex((option) => option.key === value),
        0,
      )
      requestAnimationFrame(() => focusOption(startIndex))
    }
  }

  function onOptionKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusOption(Math.min(index + 1, options.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusOption(Math.max(index - 1, 0))
    } else if (event.key === 'Escape') {
      setOpen(false)
      trigger.current?.focus()
    }
  }

  return (
    <div
      ref={ref}
      className="position-select"
      data-open={open}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <input type="hidden" name="vacancy" value={value} />
      <button
        ref={trigger}
        type="button"
        className="position-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-labelledby={`career-vacancy-label ${id}`}
        aria-describedby={describedBy}
        onClick={() => setOpen(!open)}
        onKeyDown={onTriggerKeyDown}
      >
        <span id={id} className={selected ? undefined : 'position-select-placeholder'}>
          {selected ? selected.title : placeholder}
        </span>
        <CaretDown size={16} aria-hidden="true" className={open ? 'rotate-180' : ''} />
      </button>
      <ul
        role="listbox"
        className="position-select-panel"
        aria-labelledby="career-vacancy-label"
        hidden={!open}
      >
        {options.map((option, index) => (
          <li key={option.id} role="option" aria-selected={option.key === value}>
            <button
              type="button"
              tabIndex={-1}
              onClick={() => pick(option.key)}
              onKeyDown={(event) => onOptionKeyDown(event, index)}
            >
              {option.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CareerApplication({
  vacancies,
  applyHeading,
  applyBody,
  labels,
}: {
  vacancies: Vacancy[]
  applyHeading: string
  applyBody: string
  labels: Labels
}) {
  const openVacancies = vacancies.filter((v) => v.open)
  const [vacancyKey, setVacancyKey] = useState('')
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Errors>({})
  const [state, setState] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [formError, setFormError] = useState('')
  const headingRef = useRef<HTMLHeadingElement>(null)

  function selectVacancy(key: string) {
    setVacancyKey(key)
    headingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    headingRef.current?.focus({ preventScroll: true })
  }

  function validate(data: FormData): Errors {
    const next: Errors = {}
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const phone = String(data.get('phone') || '').trim()
    const vacancy = String(data.get('vacancy') || '').trim()
    const introduction = String(data.get('introduction') || '').trim()
    const resume = data.get('resume')
    if (!name) next.name = labels.nameRequired
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = labels.emailInvalid
    if (!phone) next.phone = labels.phoneRequired
    if (!vacancy) next.vacancy = labels.vacancyRequired
    if (!introduction) next.introduction = labels.introductionRequired
    if (!(resume instanceof File) || resume.size === 0) next.resume = labels.resumeRequired
    else if (resume.type !== 'application/pdf' || !resume.name.toLowerCase().endsWith('.pdf'))
      next.resume = labels.resumeMustBePdf
    else if (resume.size > 5 * 1024 * 1024) next.resume = labels.resumeTooLarge
    return next
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state === 'pending') return
    const form = event.currentTarget
    const data = new FormData(form)
    const fieldErrors = validate(data)
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length > 0) return
    setState('pending')
    setFormError('')
    try {
      const response = await fetch('/api/career-applications', { method: 'POST', body: data })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || labels.errorFallback)
      form.reset()
      setVacancyKey('')
      setState('success')
    } catch (cause) {
      setFormError(cause instanceof Error ? cause.message : labels.errorFallback)
      setState('error')
    }
  }

  return (
    <>
      <div className="vacancy-list">
        {vacancies.map((vacancy) => {
          const key = String(vacancy.id)
          const isOpen = Boolean(openIds[key])
          const panelId = `vacancy-panel-${key}`
          return (
            <div key={vacancy.id} className="vacancy-accordion" data-open={isOpen}>
              <button
                type="button"
                className="vacancy-summary"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIds((prev) => ({ ...prev, [key]: !prev[key] }))}
              >
                <span>{vacancy.title}</span>
                {!vacancy.open && (
                  <span className="vacancy-closed-badge">{labels.closedLabel}</span>
                )}
                <CaretDown size={18} aria-hidden="true" />
              </button>
              <div className="vacancy-panel" id={panelId} role="region" inert={!isOpen}>
                <div className="vacancy-panel-inner">
                  <div className="vacancy-body">
                    {vacancy.sections?.map((section, i) => (
                      <div className="vacancy-section" key={section.id ?? i}>
                        {section.heading && <h4>{section.heading}</h4>}
                        <h5>{section.label}</h5>
                        {section.intro && <p>{section.intro}</p>}
                        {section.items && section.items.length > 0 && (
                          <ul>
                            {section.items.map((item, j) => (
                              <li key={item.id ?? j}>{item.text}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                    {vacancy.open && (
                      <button
                        type="button"
                        className="button button-outline"
                        onClick={() => selectVacancy(vacancy.key)}
                      >
                        {labels.applyButtonLabel}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="contact-form-panel" id="career-form">
        <h2 id="career-form-heading" ref={headingRef} tabIndex={-1}>
          {applyHeading}
        </h2>
        <p className="section-body">{applyBody}</p>
        {openVacancies.length === 0 ? (
          <p className="section-body">{labels.noOpeningsMessage}</p>
        ) : (
          <form onSubmit={submit} aria-busy={state === 'pending'} noValidate>
            <div className="form-two-col">
              <label>
                {labels.nameLabel}
                <span aria-hidden="true"> *</span>
                <input
                  name="name"
                  required
                  maxLength={120}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'career-error-name' : undefined}
                />
                {errors.name && (
                  <span className="field-error" id="career-error-name" role="alert">
                    {errors.name}
                  </span>
                )}
              </label>
              <label>
                {labels.emailLabel}
                <span aria-hidden="true"> *</span>
                <input
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'career-error-email' : undefined}
                />
                {errors.email && (
                  <span className="field-error" id="career-error-email" role="alert">
                    {errors.email}
                  </span>
                )}
              </label>
              <label>
                {labels.phoneLabel}
                <span aria-hidden="true"> *</span>
                <input
                  name="phone"
                  type="tel"
                  required
                  maxLength={40}
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? 'career-error-phone' : undefined}
                />
                {errors.phone && (
                  <span className="field-error" id="career-error-phone" role="alert">
                    {errors.phone}
                  </span>
                )}
              </label>
              <div className="form-field">
                <span id="career-vacancy-label">{labels.vacancyLabel}</span>
                <span aria-hidden="true"> *</span>
                <PositionSelect
                  options={openVacancies}
                  value={vacancyKey}
                  onChange={setVacancyKey}
                  describedBy={errors.vacancy ? 'career-error-vacancy' : undefined}
                  placeholder={labels.selectPlaceholder}
                />
                {errors.vacancy && (
                  <span className="field-error" id="career-error-vacancy" role="alert">
                    {errors.vacancy}
                  </span>
                )}
              </div>
            </div>
            <label>
              {labels.introductionLabel}
              <span aria-hidden="true"> *</span>
              <textarea
                name="introduction"
                required
                maxLength={2000}
                rows={5}
                aria-invalid={Boolean(errors.introduction)}
                aria-describedby={errors.introduction ? 'career-error-introduction' : undefined}
              />
              {errors.introduction && (
                <span className="field-error" id="career-error-introduction" role="alert">
                  {errors.introduction}
                </span>
              )}
            </label>
            <label>
              {labels.resumeLabel}
              <span aria-hidden="true"> *</span>
              <input
                name="resume"
                type="file"
                accept="application/pdf"
                required
                aria-invalid={Boolean(errors.resume)}
                aria-describedby={errors.resume ? 'career-error-resume' : undefined}
              />
              {errors.resume && (
                <span className="field-error" id="career-error-resume" role="alert">
                  {errors.resume}
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
                {formError}
              </p>
            )}
            <button className="button button-accent" type="submit" disabled={state === 'pending'}>
              {state === 'pending' ? labels.submittingLabel : labels.submitLabel}
              <ArrowUpRight size={18} />
            </button>
          </form>
        )}
      </div>
    </>
  )
}
