import type { Luma } from './types'
import { CATCH_RADIUS } from './constants'
import { computeDrift } from './physics'
import { isCaught } from './collision'
import { spawnLumas } from './luma-spawner'
import { getLevelConfig } from './difficulty'

export interface EngineState {
  level: number
  timeLeft: number
  levelStartElapsed: number
  lumas: Luma[]
  draggedId: number | null
}

export interface StepEvents {
  caughtHues: number[]
  gameOver: boolean
}

export interface StepResult {
  state: EngineState
  events: StepEvents
}

export function startLevel(
  level: number,
  elapsed: number,
  canvasW: number,
  canvasH: number,
  rng: () => number = Math.random,
): EngineState {
  const config = getLevelConfig(level)
  return {
    level,
    timeLeft: config.timeLeft,
    levelStartElapsed: elapsed,
    lumas: spawnLumas(config.lumaCount, canvasW, canvasH, rng),
    draggedId: null,
  }
}

export function stepGame(
  state: EngineState,
  elapsed: number,
  canvasW: number,
  canvasH: number,
  rng: () => number = Math.random,
): StepResult {
  const config = getLevelConfig(state.level)
  const timeLeft = config.timeLeft - (elapsed - state.levelStartElapsed)

  if (timeLeft <= 0) {
    return {
      state: { ...state, timeLeft: 0 },
      events: { caughtHues: [], gameOver: true },
    }
  }

  const cx = canvasW / 2
  const cy = canvasH / 2

  const lumas = state.lumas.map((luma) => {
    if (luma.id === state.draggedId) return luma
    const { x, y } = computeDrift(luma.baseX, luma.baseY, luma.offset, elapsed)
    return { ...luma, x, y }
  })

  const caught = lumas.filter((luma) => isCaught(luma, cx, cy, CATCH_RADIUS))

  if (caught.length === 0) {
    return {
      state: { ...state, timeLeft, lumas },
      events: { caughtHues: [], gameOver: false },
    }
  }

  const caughtHues = caught.map((luma) => luma.hue)
  const caughtIds = new Set(caught.map((luma) => luma.id))
  const remaining = lumas.filter((luma) => !caughtIds.has(luma.id))

  if (remaining.length === 0) {
    return {
      state: startLevel(state.level + 1, elapsed, canvasW, canvasH, rng),
      events: { caughtHues, gameOver: false },
    }
  }

  const draggedId =
    state.draggedId !== null && caughtIds.has(state.draggedId) ? null : state.draggedId

  return {
    state: { ...state, timeLeft, lumas: remaining, draggedId },
    events: { caughtHues, gameOver: false },
  }
}
