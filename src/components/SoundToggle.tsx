'use client'
import { useEffect, useSyncExternalStore } from 'react'
import { SpeakerHigh, SpeakerX } from '@phosphor-icons/react'
import { initializeSfx, isSfxMuted, playSfx, setSfxMuted, subscribeSfx } from '@/lib/sfx'

export function SoundToggle({ label = false }: { label?: boolean }) {
  const muted = useSyncExternalStore(subscribeSfx, isSfxMuted, () => true)
  useEffect(() => {
    initializeSfx()
  }, [])
  return (
    <button
      type="button"
      className={label ? 'sound-toggle' : 'icon-button'}
      aria-label={muted ? 'Enable sound' : 'Mute sound'}
      aria-pressed={!muted}
      onClick={() => {
        setSfxMuted(!muted)
        if (muted) playSfx('ui-click')
      }}
    >
      {muted ? <SpeakerX size={19} /> : <SpeakerHigh size={19} />}
      {label && <span>Sound {muted ? 'off' : 'on'}</span>}
    </button>
  )
}
