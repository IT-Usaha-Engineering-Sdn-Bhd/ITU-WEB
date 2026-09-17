export function ReasonCard({ title, body }: { title: string; body?: string | null }) {
  return (
    <div className="rounded-lg border border-surface-alt bg-white p-6">
      <div className="mb-3 h-10 w-10 rounded-full bg-accent/10" aria-hidden />
      <h3 className="text-h5">{title}</h3>
      {body && <p className="mt-2 text-small text-text/70">{body}</p>}
    </div>
  )
}
