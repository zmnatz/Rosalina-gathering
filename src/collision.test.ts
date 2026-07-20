import { describe, it, expect } from 'vitest'
import { distance, isCaught, findLumaAt } from './collision'
import type { Luma } from './types'

function luma(overrides: Partial<Luma> = {}): Luma {
  return {
    id: 0,
    x: 0,
    y: 0,
    baseX: 0,
    baseY: 0,
    offset: 0,
    hue: 0,
    ...overrides,
  }
}

describe('distance', () => {
  it('computes euclidean distance', () => {
    expect(distance(0, 0, 3, 4)).toBe(5)
  })
})

describe('isCaught', () => {
  it('returns true when the luma is within the catch radius', () => {
    expect(isCaught(luma({ x: 10, y: 0 }), 0, 0, 60)).toBe(true)
  })

  it('returns false when the luma is outside the catch radius', () => {
    expect(isCaught(luma({ x: 100, y: 0 }), 0, 0, 60)).toBe(false)
  })

  it('returns false at exactly the boundary', () => {
    expect(isCaught(luma({ x: 60, y: 0 }), 0, 0, 60)).toBe(false)
  })
})

describe('findLumaAt', () => {
  it('returns the luma within pick radius of a point', () => {
    const target = luma({ id: 1, x: 50, y: 50 })
    const lumas = [luma({ id: 0, x: 500, y: 500 }), target]
    expect(findLumaAt(lumas, 55, 55, 40)).toBe(target)
  })

  it('returns null when no luma is within range', () => {
    const lumas = [luma({ x: 500, y: 500 })]
    expect(findLumaAt(lumas, 0, 0, 40)).toBeNull()
  })

  it('returns the first matching luma when multiple overlap', () => {
    const first = luma({ id: 0, x: 10, y: 10 })
    const second = luma({ id: 1, x: 12, y: 12 })
    expect(findLumaAt([first, second], 10, 10, 40)).toBe(first)
  })
})
