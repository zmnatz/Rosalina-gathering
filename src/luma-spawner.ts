import type { Luma } from './types'

export function spawnLumas(
  count: number,
  canvasW: number,
  canvasH: number,
  rng: () => number = Math.random,
): Luma[] {
  const lumas: Luma[] = []
  for (let i = 0; i < count; i++) {
    const baseX = rng() * (canvasW - 100) + 50
    const baseY = rng() * (canvasH - 100) + 50
    lumas.push({
      id: i,
      x: baseX,
      y: baseY,
      baseX,
      baseY,
      offset: rng() * Math.PI * 2,
      hue: rng() * 360,
    })
  }
  return lumas
}
