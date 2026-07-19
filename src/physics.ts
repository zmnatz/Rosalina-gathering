import { BLOOPER_HEIGHT } from './constants'

export function applyGravity(velocity: number, gravity: number): number {
  return velocity + gravity
}

export function updatePosition(y: number, velocity: number): number {
  return y + velocity
}

export function isOutOfBounds(
  y: number,
  canvasH: number,
  blooperH: number = BLOOPER_HEIGHT,
): boolean {
  return y + blooperH > canvasH || y < 0
}
