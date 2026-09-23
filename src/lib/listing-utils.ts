import { EVENT_CATEGORIES } from '@/collections/Events'

export { EVENT_CATEGORIES }

export type EventCategory = (typeof EVENT_CATEGORIES)[number]['value']
export type ProjectStatus = 'completed' | 'ongoing'

const CATEGORY_VALUES = EVENT_CATEGORIES.map((c) => c.value)

export function parseCategory(value: string | string[] | undefined): EventCategory {
  const found = CATEGORY_VALUES.find((c) => c === value)
  return found ?? CATEGORY_VALUES[0]
}

export function parseStatus(value: string | string[] | undefined): ProjectStatus {
  return value === 'ongoing' ? 'ongoing' : 'completed'
}

export function parsePage(value: string | string[] | undefined): number {
  const n = Number(Array.isArray(value) ? value[0] : value)
  return Number.isInteger(n) && n > 0 ? n : 1
}

// Accepts watch, youtu.be, embed and shorts URLs; only a valid 11-char video id passes.
export function youtubeId(url: string | null | undefined): string | null {
  if (!url) return null
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  const host = parsed.hostname.replace(/^www\./, '')
  let id: string | null = null
  if (host === 'youtu.be') id = parsed.pathname.slice(1)
  else if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (parsed.pathname === '/watch') id = parsed.searchParams.get('v')
    else if (parsed.pathname.startsWith('/embed/')) id = parsed.pathname.slice('/embed/'.length)
    else if (parsed.pathname.startsWith('/shorts/')) id = parsed.pathname.slice('/shorts/'.length)
  }
  return id && /^[\w-]{11}$/.test(id) ? id : null
}

export function youtubeEmbedUrl(url: string | null | undefined): string | null {
  const id = youtubeId(url)
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
}

const MONTHS_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
]
const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function formatMonthYear(
  date: string | null | undefined,
  style: 'short' | 'long' = 'short',
): string {
  if (!date) return ''
  const d = new Date(date)
  const months = style === 'short' ? MONTHS_SHORT : MONTHS_LONG
  return `${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

export function dateRange(
  status: ProjectStatus,
  commencementDate?: string | null,
  completionDate?: string | null,
): string {
  const start = formatMonthYear(commencementDate)
  const end = completionDate
    ? formatMonthYear(completionDate)
    : status === 'ongoing'
      ? 'Present'
      : ''
  return [start, end].filter(Boolean).join(' – ')
}

export function consultantLabel(count: number): string {
  return count > 1 ? 'Data Center Consultants' : 'Data Center Consultant'
}
