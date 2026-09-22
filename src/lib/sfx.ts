'use client'
import { Howl } from 'howler'

type SfxName = 'ui-hover' | 'ui-click' | 'stage-reveal' | 'section-snap'
const sounds = new Map<SfxName, Howl>()
const listeners = new Set<() => void>()
let ambient: Howl | null = null
let muted = true
let initialized = false
let activated = false

export function initializeSfx() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  let hasPreference = true
  try {
    const stored = sessionStorage.getItem('itu:sound')
    hasPreference = stored !== null
    muted = stored !== 'on'
  } catch { /* Optional storage. */ }
  const activate = () => {
    activated = true
    // First-ever interaction this session with no explicit choice yet: turn sound on rather
    // than waiting for a separate click on the sound toggle. A stored preference (on or off)
    // is always respected as-is.
    if (!hasPreference) { hasPreference = true; setSfxMuted(false) }
    else if (!muted) startAmbient()
    window.removeEventListener('pointerdown', activate)
    window.removeEventListener('keydown', activate)
  }
  window.addEventListener('pointerdown', activate)
  window.addEventListener('keydown', activate)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) ambient?.pause()
    else if (activated && !muted) startAmbient()
  })
  // Delegated so every button/link/CTA gets hover + click sound with no per-component wiring.
  let hovered: Element | null = null
  const interactive = (target: EventTarget | null) => (target as Element | null)?.closest?.('button, a, [role="button"]') ?? null
  window.addEventListener('pointerover', (event) => {
    if (event.pointerType === 'touch') return
    const button = interactive(event.target)
    if (!button) { hovered = null; return }
    if (button === hovered || (button as HTMLButtonElement).disabled) return
    hovered = button
    playSfx('ui-hover')
  })
  window.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch') return
    const button = interactive(event.target)
    if (!button || (button as HTMLButtonElement).disabled) return
    playSfx('ui-click')
  })
  listeners.forEach((listener) => listener())
}
function startAmbient() {
  if (!ambient) ambient = new Howl({ src: ['/sfx/ambient-loop.mp3'], loop: true, volume: 0.12 })
  if (!ambient.playing()) ambient.play()
}
export function playSfx(name: SfxName) {
  if (muted || !activated || document.hidden) return
  let sound = sounds.get(name)
  if (!sound) {
    sound = new Howl({ src: [`/sfx/${name}.mp3`], volume: name === 'ui-hover' ? 0.12 : 0.25 })
    sounds.set(name, sound)
  }
  sound.play()
}
export function setSfxMuted(next: boolean) {
  activated = true
  muted = next
  try { sessionStorage.setItem('itu:sound', muted ? 'off' : 'on') } catch { /* Optional storage. */ }
  if (muted) {
    ambient?.pause()
    sounds.forEach((sound) => sound.stop())
  } else startAmbient()
  listeners.forEach((listener) => listener())
}
export const isSfxMuted = () => muted
export function subscribeSfx(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}
