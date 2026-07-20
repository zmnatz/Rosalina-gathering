import { describe, it, expect } from 'vitest'
import { startLevel, stepGame } from './engine'
import type { EngineState } from './engine'
import type { Luma } from './types'
import { getLevelConfig } from './difficulty'

const CANVAS_W = 800
const CANVAS_H = 600
const CENTER_X = CANVAS_W / 2
const CENTER_Y = CANVAS_H / 2

function makeLuma(overrides: Partial<Luma> = {}): Luma {
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

function makeState(overrides: Partial<EngineState> = {}): EngineState {
  return {
    level: 1,
    timeLeft: getLevelConfig(1).timeLeft,
    levelStartElapsed: 0,
    lumas: [],
    draggedId: null,
    ...overrides,
  }
}

describe('stepGame', () => {
  it('catches a luma sitting at the center and reports its hue', () => {
    const caught = makeLuma({ id: 1, baseX: CENTER_X, baseY: CENTER_Y, offset: 0, hue: 200 })
    const far = makeLuma({ id: 2, baseX: 0, baseY: 0, hue: 10 })
    const state = makeState({ lumas: [caught, far] })

    const result = stepGame(state, 0, CANVAS_W, CANVAS_H)

    expect(result.events.caughtHues).toEqual([200])
    expect(result.events.gameOver).toBe(false)
    expect(result.state.lumas.map((l) => l.id)).toEqual([2])
  })

  it('advances position by drift for lumas that are not dragged or caught', () => {
    const luma = makeLuma({ id: 1, baseX: 0, baseY: 0, offset: 0, hue: 5 })
    const state = makeState({ lumas: [luma] })

    const result = stepGame(state, 1, CANVAS_W, CANVAS_H)

    const [updated] = result.state.lumas
    expect(updated.x).toBeCloseTo(Math.sin(1) * 20)
    expect(updated.y).toBeCloseTo(Math.cos(1) * 20)
  })

  it('starts the next level when the last luma is caught', () => {
    const luma = makeLuma({ id: 1, baseX: CENTER_X, baseY: CENTER_Y, offset: 0, hue: 50 })
    const state = makeState({ lumas: [luma] })
    const rng = () => 0

    const result = stepGame(state, 5, CANVAS_W, CANVAS_H, rng)

    expect(result.events.caughtHues).toEqual([50])
    expect(result.events.gameOver).toBe(false)
    expect(result.state.level).toBe(2)
    expect(result.state.levelStartElapsed).toBe(5)
    expect(result.state.lumas).toHaveLength(getLevelConfig(2).lumaCount)
    expect(result.state.draggedId).toBeNull()
  })

  it('reports game over once the level time is spent', () => {
    const state = makeState({ lumas: [makeLuma({ id: 1, baseX: 0, baseY: 0 })] })
    const config = getLevelConfig(1)

    const result = stepGame(state, config.timeLeft, CANVAS_W, CANVAS_H)

    expect(result.events.gameOver).toBe(true)
    expect(result.events.caughtHues).toEqual([])
    expect(result.state.timeLeft).toBe(0)
  })

  it('excludes the dragged luma from drift but still checks it for catches', () => {
    const dragged = makeLuma({ id: 1, x: CENTER_X, y: CENTER_Y, baseX: 999, baseY: 999, hue: 77 })
    const other = makeLuma({ id: 2, baseX: 0, baseY: 0, hue: 5 })
    const state = makeState({ lumas: [dragged, other], draggedId: 1 })

    const result = stepGame(state, 3, CANVAS_W, CANVAS_H)

    expect(result.events.caughtHues).toEqual([77])
    expect(result.state.lumas.map((l) => l.id)).toEqual([2])
    expect(result.state.draggedId).toBeNull()
  })
})

describe('startLevel', () => {
  it('spawns the configured number of lumas and resets drag state', () => {
    const state = startLevel(3, 10, CANVAS_W, CANVAS_H, () => 0)

    expect(state.level).toBe(3)
    expect(state.timeLeft).toBe(getLevelConfig(3).timeLeft)
    expect(state.levelStartElapsed).toBe(10)
    expect(state.lumas).toHaveLength(getLevelConfig(3).lumaCount)
    expect(state.draggedId).toBeNull()
  })
})
