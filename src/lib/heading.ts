export function splitHighlight(text: string, highlight?: string | null): [string, string, string] {
  const index = highlight ? text.indexOf(highlight) : -1
  return index < 0 || !highlight
    ? [text, '', '']
    : [text.slice(0, index), highlight, text.slice(index + highlight.length)]
}
