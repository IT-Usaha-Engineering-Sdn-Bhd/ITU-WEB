type Axes = { x: number; y: number }
type TiltState = { rotation: Axes; velocity: Axes }

export function createTiltState(): TiltState {
  return { rotation: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } }
}

export function resetTilt(state: TiltState) {
  state.rotation.x = state.rotation.y = state.velocity.x = state.velocity.y = 0
}

/** Advance the rack's spring-damper; return true once both axes have settled. */
export function stepTilt(state: TiltState, pointer: Axes, intensity: Axes, delta: number) {
  const step = Math.max(0, Math.min(delta, 1 / 30))
  const target = { x: pointer.y * intensity.x, y: pointer.x * intensity.y }
  let settled = true
  for (const axis of ['x', 'y'] as const) {
    state.velocity[axis] += (target[axis] - state.rotation[axis]) * 24 * step
    state.velocity[axis] *= Math.max(0, 1 - 7 * step)
    state.rotation[axis] += state.velocity[axis] * step
    settled &&=
      Math.abs(state.velocity[axis]) < 0.0001 &&
      Math.abs(target[axis] - state.rotation[axis]) < 0.0001
  }
  return settled
}
