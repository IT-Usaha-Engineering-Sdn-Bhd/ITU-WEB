'use client'
import { useEffect, useState } from 'react'
import { Moon, Sun } from '@phosphor-icons/react'
import { applyTheme } from '@/lib/theme'

export function ThemeToggle() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    setDark(document.documentElement.dataset.mode === 'dark')
  }, [])
  return (
    <button
      type="button"
      className="icon-button"
      aria-label="Dark mode"
      aria-pressed={dark}
      onClick={() => {
        const next = document.documentElement.dataset.mode !== 'dark'
        applyTheme(next ? 'dark' : 'light', document.documentElement, () => localStorage)
        setDark(next)
      }}
    >
      {dark ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
    </button>
  )
}
