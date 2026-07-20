import { describe, it, expect } from 'vitest'
import { computeDrift } from './physics'

describe('computeDrift', () => {
  it('returns the base position offset by the drift radius at elapsed=0', () => {
    const { x, y } = computeDrift(100, 200, 0, 0, 20)
    expect(x).toBeCloseTo(100)
    expect(y).toBeCloseTo(220)
  })

  it('applies the phase offset', () => {
    const { x, y } = computeDrift(100, 200, Math.PI / 2, 0, 20)
    expect(x).toBeCloseTo(120)
    expect(y).toBeCloseTo(200)
  })

  it('moves in a circle as elapsed time advances', () => {
    const quarter = computeDrift(0, 0, 0, Math.PI / 2, 10)
    expect(quarter.x).toBeCloseTo(10)
    expect(quarter.y).toBeCloseTo(0)
  })

  it('defaults to the standard drift radius', () => {
    const { y } = computeDrift(0, 0, 0, 0)
    expect(y).toBe(20)
  })
})
