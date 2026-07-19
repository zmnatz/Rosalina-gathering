import { describe, it, expect } from 'vitest'
import { checkPipeCollision, type BlooperConfig } from './collision'
import type { Pipe } from './types'

const config: BlooperConfig = { width: 60, height: 60 }
const canvasH = 800

function pipe(overrides: Partial<Pipe> = {}): Pipe {
  return { x: 400, top: 200, bottom: 600, passed: false, ...overrides }
}

describe('checkPipeCollision', () => {
  it('returns false when blooper is centered in the gap', () => {
    expect(checkPipeCollision(400, pipe(), canvasH, config)).toBe(false)
  })

  it('returns false when blooper is at the gap center with pipe far ahead', () => {
    expect(checkPipeCollision(400, pipe({ x: 800 }), canvasH, config)).toBe(
      false,
    )
  })

  it('returns false when blooper is at the gap center with pipe far behind', () => {
    expect(checkPipeCollision(400, pipe({ x: -200 }), canvasH, config)).toBe(
      false,
    )
  })

  it('returns true when blooper top edge overlaps top pipe', () => {
    const p = pipe({ x: 0, top: 190 })
    expect(checkPipeCollision(170, p, canvasH, config)).toBe(true)
  })

  it('returns true when blooper bottom edge overlaps bottom pipe', () => {
    const p = pipe({ x: 0, top: 300, bottom: 500 })
    expect(checkPipeCollision(650, p, canvasH, config)).toBe(true)
  })

  it('returns false when blooper is above both pipes (before enter gap)', () => {
    expect(checkPipeCollision(50, pipe(), canvasH, config)).toBe(false)
  })

  it('returns false when blooper is below both pipes (past exit)', () => {
    expect(
      checkPipeCollision(750, pipe({ top: 300, bottom: 500 }), canvasH, config),
    ).toBe(false)
  })

  it('returns false when blooper is beyond pipe horizontally (past right edge)', () => {
    expect(
      checkPipeCollision(400, pipe({ x: 300, top: 100 }), canvasH, config),
    ).toBe(false)
  })

  it('returns true at exact pipe lip top', () => {
    const p = pipe({ x: 0, top: 175 })
    expect(checkPipeCollision(160, p, canvasH, config)).toBe(true)
  })

  it('returns true at exact pipe lip bottom', () => {
    const p = pipe({ x: 0, top: 200, bottom: 595 })
    expect(checkPipeCollision(620, p, canvasH, config)).toBe(true)
  })
})
