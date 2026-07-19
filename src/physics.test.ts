import { describe, it, expect } from 'vitest'
import { applyGravity, updatePosition, isOutOfBounds } from './physics'

describe('applyGravity', () => {
  it('adds gravity to velocity', () => {
    expect(applyGravity(0, 0.15)).toBe(0.15)
  })

  it('increases downward velocity over time', () => {
    const v = applyGravity(applyGravity(0, 0.15), 0.15)
    expect(v).toBe(0.3)
  })
})

describe('updatePosition', () => {
  it('adds velocity to position', () => {
    expect(updatePosition(400, -4.5)).toBe(395.5)
  })
})

describe('isOutOfBounds', () => {
  it('returns false when blooper is within bounds', () => {
    expect(isOutOfBounds(400, 800)).toBe(false)
  })

  it('returns true when blooper hits floor', () => {
    expect(isOutOfBounds(750, 800)).toBe(true)
  })

  it('returns true when blooper hits ceiling', () => {
    expect(isOutOfBounds(-10, 800)).toBe(true)
  })

  it('returns true at exact floor boundary', () => {
    expect(isOutOfBounds(741, 800, 60)).toBe(true)
  })

  it('returns false just inside floor boundary', () => {
    expect(isOutOfBounds(740, 800, 60)).toBe(false)
  })

  it('accepts custom blooper height', () => {
    expect(isOutOfBounds(701, 800, 100)).toBe(true)
    expect(isOutOfBounds(700, 800, 99)).toBe(false)
  })
})
