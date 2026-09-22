import { getPayloadClient } from '@/lib/payload'
import { Scene } from '@/three/Scene'
import { Reveal } from '@/components/Reveal'

export default async function HomePage() {
  const payload = await getPayloadClient()
  const media = await payload.count({ collection: 'media' })

  return (
    <main className="relative flex min-h-screen items-center justify-center">
      <Scene />
      <Reveal>
        <h1 className="text-center text-4xl font-bold text-bone">
          Your Trusted Partner in Data Centre
        </h1>
        <p className="mt-2 text-center text-muted">
          {media.totalDocs} media item{media.totalDocs === 1 ? '' : 's'} in Payload
        </p>
      </Reveal>
    </main>
  )
}
