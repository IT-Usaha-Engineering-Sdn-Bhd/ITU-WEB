const WIDTH = 1200
const HEIGHT = 800
const TRACE_COUNT = 4

// A random orthogonal circuit trace: alternating horizontal/vertical runs starting from one
// edge of the viewBox and exiting through the nearer edge on its last axis, same shape as the
// original hand-drawn paths (e.g. "M0,120 H260 V300 H520 V80 H900 V420 H1200").
function randomTrace(): { d: string; corners: [number, number][] } {
  const horizontalStart = Math.random() < 0.5
  let x: number
  let y: number
  if (horizontalStart) {
    x = Math.random() < 0.5 ? 0 : WIDTH
    y = Math.round(Math.random() * HEIGHT)
  } else {
    x = Math.round(Math.random() * WIDTH)
    y = Math.random() < 0.5 ? 0 : HEIGHT
  }
  const d = [`M${x},${y}`]
  const corners: [number, number][] = []
  let horizontal = horizontalStart
  const bends = 3 + Math.floor(Math.random() * 3)
  for (let i = 0; i < bends; i++) {
    if (horizontal) x = Math.round(Math.random() * WIDTH)
    else y = Math.round(Math.random() * HEIGHT)
    d.push(`${horizontal ? 'H' : 'V'}${horizontal ? x : y}`)
    corners.push([x, y])
    horizontal = !horizontal
  }
  if (horizontal) {
    x = x < WIDTH / 2 ? 0 : WIDTH
    d.push(`H${x}`)
  } else {
    y = y < HEIGHT / 2 ? 0 : HEIGHT
    d.push(`V${y}`)
  }
  return { d: d.join(' '), corners }
}

// Subtle, semi-transparent circuit-trace backdrop, mounted per-section (see the landing
// section components that render it). Pure CSS/SVG — no WebGL, no JS animation loop. A fresh
// random layout is generated on every mount, so each section (and each page load) gets its
// own trace pattern instead of the same fixed artwork everywhere.
export function Backdrop() {
  const traces = Array.from({ length: TRACE_COUNT }, randomTrace)
  const nodes = traces.flatMap((trace) => trace.corners.filter(() => Math.random() < 0.5))

  return (
    <svg
      className="circuit-backdrop motion-reduce:[&_path]:animate-none"
      aria-hidden="true"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <g fill="none" stroke="var(--color-accent)" strokeWidth="1.5">
        {traces.map((trace, i) => (
          <path
            key={i}
            d={trace.d}
            className="circuit-trace"
            style={{ animationDelay: `${i * 1.6}s` }}
          />
        ))}
        {nodes.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={4} fill="var(--color-accent)" stroke="none" />
        ))}
      </g>
    </svg>
  )
}
