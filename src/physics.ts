import { DRIFT_RADIUS } from './constants'

export function computeDrift(
  baseX: number,
  baseY: number,
  offset: number,
  elapsedSeconds: number,
  radius: number = DRIFT_RADIUS,
): { x: number; y: number } {
  return {
    x: baseX + Math.sin(elapsedSeconds + offset) * radius,
    y: baseY + Math.cos(elapsedSeconds + offset) * radius,
  }
}
