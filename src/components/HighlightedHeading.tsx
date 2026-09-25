import { splitHighlight } from '@/lib/heading'

export function HighlightedHeading({
  text,
  highlight,
}: {
  text: string
  highlight?: string | null
}) {
  const [before, match, after] = splitHighlight(text, highlight)
  return (
    <>
      {before}
      {match && <span className="text-accent">{match}</span>}
      {after}
    </>
  )
}
