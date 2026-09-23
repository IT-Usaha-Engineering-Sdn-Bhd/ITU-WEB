type SectionBounds = { top: number; bottom: number }

/** Relative destination, or null when native scrolling should retain control. */
export function sectionDestination(
  sections: SectionBounds[],
  direction: number,
  height: number,
  inset: number,
): number | null {
  const index = sections.findIndex(
    (section) => section.top <= inset + 3 && section.bottom > inset + 3,
  )
  if (index < 0) {
    // Nothing straddles the nav inset — we're off the tracked sections entirely (e.g. below
    // the last one, in the footer). Land on the nearest tracked section in the travel
    // direction instead of trapping the user in permanently-native scrolling.
    if (direction > 0) {
      const next = sections.find((section) => section.top > inset + 3)
      return next ? next.top - inset : null
    }
    const behind = sections.filter((section) => section.bottom < inset - 3)
    const next = behind[behind.length - 1]
    return next ? Math.max(next.top - inset, next.bottom - height) : null
  }
  const section = sections[index]
  if (direction > 0 && section.bottom > height + 3) return null
  if (direction < 0 && section.top < inset - 3) return null
  const next = sections[index + (direction > 0 ? 1 : -1)]
  if (!next) return null
  return direction < 0 ? Math.max(next.top - inset, next.bottom - height) : next.top - inset
}
