import { describe, it, expect } from 'vitest'
import { spawnLumas } from './luma-spawner'

describe('spawnLumas', () => {
  it('spawns the requested number of lumas', () => {
    expect(spawnLumas(5, 800, 600)).toHaveLength(5)
  })

  it('assigns sequential unique ids', () => {
    const lumas = spawnLumas(3, 800, 600)
    expect(lumas.map((l) => l.id)).toEqual([0, 1, 2])
  })

  it('positions lumas within the canvas margins', () => {
    const lumas = spawnLumas(20, 800, 600)
    for (const l of lumas) {
      expect(l.baseX).toBeGreaterThanOrEqual(50)
      expect(l.baseX).toBeLessThanOrEqual(750)
      expect(l.baseY).toBeGreaterThanOrEqual(50)
      expect(l.baseY).toBeLessThanOrEqual(550)
    }
  })

  it('initializes x/y to the base position', () => {
    const [l] = spawnLumas(1, 800, 600, () => 0.5)
    expect(l.x).toBe(l.baseX)
    expect(l.y).toBe(l.baseY)
  })

  it('uses a seeded RNG to produce deterministic results', () => {
    const rng = () => 0
    const [l] = spawnLumas(1, 800, 600, rng)
    expect(l.baseX).toBe(50)
    expect(l.baseY).toBe(50)
    expect(l.offset).toBe(0)
    expect(l.hue).toBe(0)
  })

  it('returns an empty array for zero count', () => {
    expect(spawnLumas(0, 800, 600)).toEqual([])
  })
})
