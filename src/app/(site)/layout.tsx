import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'ITU',
  description: 'ITU Usaha Engineering',
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
