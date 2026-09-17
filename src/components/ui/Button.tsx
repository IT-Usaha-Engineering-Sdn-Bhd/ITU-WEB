import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Common = {
  variant?: 'primary' | 'outline'
  className?: string
}

type AsLink = Common & { href: string; children: ReactNode }
type AsButton = Common & ButtonHTMLAttributes<HTMLButtonElement>

const styles = {
  primary: 'bg-accent text-white hover:bg-accent-dark',
  outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
}

const base = 'inline-flex items-center justify-center rounded-md px-6 py-3 text-small font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export function LinkButton({ href, children, variant = 'primary', className = '' }: AsLink) {
  return (
    <Link href={href} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </Link>
  )
}

export function Button({ variant = 'primary', className = '', ...props }: AsButton) {
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />
}
