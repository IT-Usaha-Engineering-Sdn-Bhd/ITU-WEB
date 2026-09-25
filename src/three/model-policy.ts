export type Quality = 'high' | 'standard' | 'constrained'
export type Capabilities = {
  width: number
  saveData?: boolean
  effectiveType?: string
  cores?: number
  memory?: number
}
export function selectQuality({
  width,
  saveData,
  effectiveType,
  cores,
  memory,
}: Capabilities): Quality {
  if (
    saveData ||
    /(^|-)2g$/.test(effectiveType ?? '') ||
    effectiveType === '3g' ||
    (cores !== undefined && cores <= 4) ||
    (memory !== undefined && memory <= 4)
  )
    return 'constrained'
  return width >= 1200 ? 'high' : 'standard'
}
export function devicePolicy() {
  const device = navigator as Navigator & {
    deviceMemory?: number
    connection?: { saveData?: boolean; effectiveType?: string }
  }
  return selectQuality({
    width: window.innerWidth,
    cores: device.hardwareConcurrency,
    memory: device.deviceMemory,
    saveData: device.connection?.saveData,
    effectiveType: device.connection?.effectiveType,
  })
}
