import Link from 'next/link'
import { CaretLeft, CaretRight } from '@phosphor-icons/react/dist/ssr'

export function Pagination({ page, totalPages, hrefFor }: { page: number; totalPages: number; hrefFor: (page: number) => string }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return <nav className="pagination" aria-label="Pagination">
    {page > 1 ? <Link href={hrefFor(page - 1)} className="icon-button" aria-label="Previous page"><CaretLeft size={18} /></Link>
      : <span className="icon-button" aria-hidden="true"><CaretLeft size={18} /></span>}
    <ol>{pages.map((n) => <li key={n}>
      {n === page ? <span aria-current="page">{n}</span> : <Link href={hrefFor(n)}>{n}</Link>}
    </li>)}</ol>
    {page < totalPages ? <Link href={hrefFor(page + 1)} className="icon-button" aria-label="Next page"><CaretRight size={18} /></Link>
      : <span className="icon-button" aria-hidden="true"><CaretRight size={18} /></span>}
  </nav>
}
