'use client'

import dynamic from 'next/dynamic'

// Loaded client-only: three/@react-three/fiber must never reach the server bundle.
export const Scene = dynamic(() => import('./GlobalCanvas').then((m) => m.GlobalCanvas), {
  ssr: false,
})
