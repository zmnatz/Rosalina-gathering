import type { Luma } from './types'

export function distance(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(ax - bx, ay - by)
}

export function isCaught(
  luma: Luma,
  centerX: number,
  centerY: number,
  radius: number,
): boolean {
  return distance(luma.x, luma.y, centerX, centerY) < radius
}

export function findLumaAt(
  lumas: Luma[],
  x: number,
  y: number,
  pickRadius: number,
): Luma | null {
  for (const luma of lumas) {
    if (distance(luma.x, luma.y, x, y) < pickRadius) return luma
  }
  return null
}
