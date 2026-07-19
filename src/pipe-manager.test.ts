import { describe, it, expect } from 'vitest'
import { spawnPipe, movePipes, removeOffscreen } from './pipe-manager'
import type { Pipe } from './types'

describe('spawnPipe', () => {
  it('spawns a pipe at the right edge of the canvas', () => {
    const p = spawnPipe(800)
    expect(p.x).toBe(800)
    expect(p.passed).toBe(false)
    expect(p.top).toBeGreaterThanOrEqual(80)
    expect(p.bottom).toBeGreaterThanOrEqual(80)
  })

  it('respects gap parameter', () => {
    const p = spawnPipe(800, 300)
    expect(p.top + p.bottom).toBeLessThanOrEqual(800 - 300)
  })

  it('uses seeded RNG to produce deterministic results', () => {
    const rng = () => 0
    const p = spawnPipe(800, 260, rng)
    expect(p.top).toBe(80)
  })

  it('uses seeded RNG at max to produce highest top', () => {
    const rng = () => 1
    const p = spawnPipe(800, 260, rng)
    expect(p.top).toBe(461)
  })

  it('produces valid pipe where top + bottom + gap = canvasH', () => {
    const p = spawnPipe(800)
    expect(p.top + 260 + p.bottom).toBe(800)
  })

  it('handles minimum canvas height', () => {
    const p = spawnPipe(420)
    expect(p.top).toBe(80)
    expect(p.bottom).toBe(80)
  })
})

describe('movePipes', () => {
  it('moves pipes left by speed', () => {
    const pipes: Pipe[] = [
      { x: 400, top: 200, bottom: 600, passed: false },
    ]
    const moved = movePipes(pipes, 1.8)
    expect(moved[0].x).toBe(398.2)
  })

  it('does not mutate original array', () => {
    const pipes: Pipe[] = [
      { x: 400, top: 200, bottom: 600, passed: false },
    ]
    movePipes(pipes, 1.8)
    expect(pipes[0].x).toBe(400)
  })

  it('handles multiple pipes', () => {
    const pipes: Pipe[] = [
      { x: 500, top: 200, bottom: 600, passed: false },
      { x: 300, top: 300, bottom: 500, passed: false },
    ]
    const moved = movePipes(pipes, 2)
    expect(moved[0].x).toBe(498)
    expect(moved[1].x).toBe(298)
  })
})

describe('removeOffscreen', () => {
  it('removes pipes past the limit', () => {
    const pipes: Pipe[] = [
      { x: -50, top: 200, bottom: 600, passed: false },
      { x: -150, top: 300, bottom: 500, passed: false },
      { x: 100, top: 200, bottom: 600, passed: false },
    ]
    const kept = removeOffscreen(pipes)
    expect(kept).toHaveLength(2)
    expect(kept[0].x).toBe(-50)
    expect(kept[1].x).toBe(100)
  })

  it('keeps all pipes when none are past limit', () => {
    const pipes: Pipe[] = [
      { x: 0, top: 200, bottom: 600, passed: false },
      { x: 100, top: 300, bottom: 500, passed: false },
    ]
    expect(removeOffscreen(pipes)).toHaveLength(2)
  })

  it('returns empty array from empty input', () => {
    expect(removeOffscreen([])).toHaveLength(0)
  })
})
