// Subtle, semi-transparent circuit-trace backdrop for every page. Pure CSS/SVG — no WebGL,
// no JS animation loop — so it runs everywhere, including when the 3D canvas is idle or absent.
export function Backdrop() {
  return (
    <svg
      className="circuit-backdrop motion-reduce:[&_path]:animate-none"
      aria-hidden="true"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
    >
      <g fill="none" stroke="var(--color-accent)" strokeWidth="1.5">
        {[
          'M0,120 H260 V300 H520 V80 H900 V420 H1200',
          'M0,520 H180 V640 H460 V520 H820 V700 H1200',
          'M100,0 V180 H340 V420 H60 V800',
          'M1100,0 V220 H860 V560 H1150 V800',
        ].map((d, i) => (
          <path
            key={d}
            d={d}
            className="circuit-trace"
            style={{ animationDelay: `${i * 1.6}s` }}
          />
        ))}
        {[
          [260, 120], [520, 300], [900, 80], [180, 520], [460, 640], [820, 520], [340, 180], [860, 220],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={4} fill="var(--color-accent)" stroke="none" />
        ))}
      </g>
    </svg>
  )
}
