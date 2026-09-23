// Accessible stand-in for an uploaded photo on the DFMA page: three modules drawing together
// into one assembled block. Static but for a small hover shift — the site's global
// `prefers-reduced-motion` rule (globals.css) already strips that transition.
export function ModularDiagram({ title }: { title: string }) {
  return (
    <svg
      className="modular-diagram"
      viewBox="0 0 320 220"
      role="img"
      aria-labelledby="modular-diagram-title"
    >
      <title id="modular-diagram-title">
        {title}: separate modules assembling into one complete system
      </title>
      <g
        className="modular-diagram-module"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="2"
      >
        <rect x="18" y="30" width="80" height="80" rx="4" />
        <rect x="122" y="30" width="80" height="80" rx="4" />
        <rect x="70" y="126" width="80" height="80" rx="4" />
      </g>
      <g stroke="#eb8c2455" strokeWidth="1.5" strokeDasharray="4 5">
        <line x1="98" y1="70" x2="122" y2="70" />
        <line x1="110" y1="110" x2="110" y2="126" />
      </g>
      <g fill="#f3eee480">
        <circle cx="58" cy="70" r="2.5" />
        <circle cx="162" cy="70" r="2.5" />
        <circle cx="110" cy="166" r="2.5" />
      </g>
    </svg>
  )
}
