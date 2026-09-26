import type { Quality } from './model-policy'

export function renderPolicy(
  quality: Quality,
  downgraded: boolean,
  visible: boolean,
  ratio: number,
  reduced: boolean,
): {
  dpr: number | [number, number]
  high: boolean
  frameloop: 'never' | 'always' | 'demand'
} {
  const high = quality === 'high' && !downgraded
  return {
    high,
    dpr: downgraded ? 1 : high ? [1, 2] : [1, 1.5],
    frameloop: !visible || ratio === 0 ? 'never' : reduced ? 'demand' : 'always',
  }
}
