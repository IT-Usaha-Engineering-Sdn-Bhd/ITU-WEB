'use client'
import { Howl, Howler } from 'howler'
import { createSoundController } from './sound-controller'

type SfxName = 'ui-hover' | 'ui-click' | 'stage-reveal' | 'section-snap'
const sounds = new Map<SfxName, Howl>()
const listeners = new Set<() => void>()
let ambient: Howl | null = null
let ambientId: number | undefined
let controller: ReturnType<typeof createSoundController> | null = null
const notify = () => listeners.forEach((listener) => listener())
function startAmbient() {
  if (document.hidden) return
  // Called directly from Commission or Sound On, inside user activation.
  void Howler.ctx?.resume().catch(() => {})
  if (!ambient)
    ambient = new Howl({
      src: ['/sfx/ambient-loop.mp3'],
      loop: true,
      volume: 0.12,
      onplayerror: () => {
        controller?.playbackFailed()
        notify()
      },
    })
  if (!ambient.playing(ambientId))
    ambientId = ambientId === undefined ? ambient.play() : ambient.play(ambientId)
}
export function initializeSfx() {
  if (controller || typeof window === 'undefined') return
  let preference: string | null = null
  try {
    preference = localStorage.getItem('itu:sound') ?? sessionStorage.getItem('itu:sound')
  } catch {
    /* Optional storage. */
  }
  controller = createSoundController(preference, {
    start: startAmbient,
    stop: () => {
      ambient?.pause()
      sounds.forEach((sound) => sound.stop())
    },
    save: (value) => {
      try {
        localStorage.setItem('itu:sound', value)
        sessionStorage.setItem('itu:sound', value)
      } catch {
        /* Optional storage. */
      }
    },
  })
  document.addEventListener('visibilitychange', () => controller?.visibility(document.hidden))
  let hovered: Element | null = null
  const interactive = (target: EventTarget | null) =>
    (target as Element | null)?.closest?.('button, a, [role="button"]') ?? null
  window.addEventListener('pointerover', (event) => {
    if (event.pointerType === 'touch') return
    const button = interactive(event.target)
    if (!button) {
      hovered = null
      return
    }
    if (button === hovered || (button as HTMLButtonElement).disabled) return
    hovered = button
    playSfx('ui-hover')
  })
  window.addEventListener('pointerdown', (event) => {
    const button = interactive(event.target)
    if (event.pointerType !== 'touch' && button && !(button as HTMLButtonElement).disabled)
      playSfx('ui-click')
  })
  notify()
}
export function commissionSound() {
  initializeSfx()
  controller?.commission()
  playSfx('stage-reveal')
  notify()
}
export function playSfx(name: SfxName) {
  if (!controller || controller.muted() || !controller.activated() || document.hidden) return
  let sound = sounds.get(name)
  if (!sound) {
    sound = new Howl({ src: [`/sfx/${name}.mp3`], volume: name === 'ui-hover' ? 0.12 : 0.25 })
    sounds.set(name, sound)
  }
  try {
    sound.play()
  } catch {
    /* Navigation is independent of audio availability. */
  }
}
export function setSfxMuted(next: boolean) {
  initializeSfx()
  controller?.setMuted(next)
  notify()
}
export const isSfxMuted = () => controller?.muted() ?? true
export function subscribeSfx(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
