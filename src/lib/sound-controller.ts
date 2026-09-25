type Effects = { start: () => void; stop: () => void; save: (value: string) => void }
export function createSoundController(preference: string | null, effects: Effects) {
  let muted = preference !== 'on'
  let activated = false
  let blocked = false
  const start = () => {
    try {
      effects.start()
    } catch {
      blocked = true
    }
  }
  const setMuted = (next: boolean) => {
    activated = true
    blocked = false
    muted = next
    preference = next ? 'off' : 'on'
    try {
      effects.save(preference)
    } catch {
      /* Storage is optional. */
    }
    if (next) effects.stop()
    else start()
  }
  return {
    muted: () => !activated || muted || blocked,
    activated: () => activated,
    setMuted,
    playbackFailed() {
      blocked = true
      effects.stop()
    },
    commission() {
      activated = true
      if (preference !== 'off') setMuted(false)
    },
    visibility(hidden: boolean) {
      if (hidden) effects.stop()
      else if (activated && !muted && !blocked) start()
    },
  }
}
