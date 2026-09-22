import type { Metadata } from 'next'
import { Manrope, Work_Sans } from 'next/font/google'
import '../globals.css'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })
const workSans = Work_Sans({ subsets: ['latin'], variable: '--font-work-sans', display: 'swap' })

export const metadata: Metadata = {
  title: 'ITU',
  description: 'ITU Usaha Engineering',
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${workSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
