'use client'
import { useLayoutEffect } from 'react'
import { initializeTheme, themeInitializer } from '@/lib/theme'

export function ThemeInitializer() {
  // Next can insert a 404 fallback on the client, where a raw script is inert.
  // Layout effect covers that path before paint; server HTML uses the inline script.
  useLayoutEffect(() => {
    initializeTheme(document.documentElement, () => localStorage)
  }, [])
  return <script dangerouslySetInnerHTML={{ __html: themeInitializer }} />
}
