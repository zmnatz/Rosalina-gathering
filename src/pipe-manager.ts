import type { Pipe } from './types'
import { PIPE_GAP } from './constants'

export function spawnPipe(
  canvasH: number,
  gap: number = PIPE_GAP,
  rng: () => number = Math.random,
): Pipe {
  const minH = 80
  const maxH = canvasH - gap - minH
  const top = Math.floor(rng() * (maxH - minH + 1)) + minH
  return {
    x: canvasH,
    top,
    bottom: canvasH - top - gap,
    passed: false,
  }
}

export function movePipes(pipes: Pipe[], speed: number): Pipe[] {
  return pipes.map((p) => ({ ...p, x: p.x - speed }))
}

export function removeOffscreen(pipes: Pipe[], limit: number = -100): Pipe[] {
  return pipes.filter((p) => p.x > limit)
}
